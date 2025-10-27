import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export interface ChatMessage {
  id: string;
  user_id: string;
  provider: string;
  role: 'user' | 'assistant';
  content: string;
  metadata: any;
  created_at: string;
}

const N8N_CHAT_WEBHOOK_URL = "https://n8n.srv1053222.hstgr.cloud/webhook/linkedin-chat";

export const useLeadChat = (provider: string = 'claude-linkedin') => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!user) {
      setMessages([]);
      setLoading(false);
      return;
    }

    fetchMessages();

    // Real-time subscription for new messages
    const channel = supabase
      .channel('lead_chat_messages_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'lead_chat_messages',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, provider]);

  const fetchMessages = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('lead_chat_messages' as any)
      .select('*')
      .eq('provider', provider)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching chat messages:', error);
      toast({
        title: "Error",
        description: "Failed to load chat history",
        variant: "destructive",
      });
    } else {
      setMessages((data as any as ChatMessage[]) || []);
    }
    setLoading(false);
  };

  const sendMessage = async (content: string) => {
    if (!user || !content.trim()) return false;

    setSending(true);

    try {
      // 1. Save user message to Supabase
      const { data: userMessage, error: insertError } = await supabase
        .from('lead_chat_messages' as any)
        .insert({
          user_id: user.id,
          provider,
          role: 'user',
          content: content.trim(),
          metadata: {},
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // 2. Send to n8n webhook for AI processing
      await fetch(N8N_CHAT_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          message: content.trim(),
          message_id: (userMessage as any)?.id,
          provider,
          timestamp: new Date().toISOString(),
        }),
      });

      setSending(false);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      setSending(false);
      return false;
    }
  };

  const clearHistory = async () => {
    if (!user) return false;

    const { error } = await supabase
      .from('lead_chat_messages' as any)
      .delete()
      .eq('user_id', user.id)
      .eq('provider', provider);

    if (error) {
      console.error('Error clearing chat history:', error);
      toast({
        title: "Error",
        description: "Failed to clear chat history",
        variant: "destructive",
      });
      return false;
    }

    setMessages([]);
    toast({
      title: "Success",
      description: "Chat history cleared",
    });
    return true;
  };

  return {
    messages,
    loading,
    sending,
    sendMessage,
    clearHistory,
    refetch: fetchMessages,
  };
};
