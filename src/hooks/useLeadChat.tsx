import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  metadata?: any;
}

export function useLeadChat(provider: string = 'claude-linkedin') {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMessages();
      
      // Subscribe to real-time updates
      const channel = supabase
        .channel('lead_chat_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'lead_chat_messages',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            fetchMessages();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchMessages = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('lead_chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', provider)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data || []).map(msg => ({
        ...msg,
        role: msg.role as 'user' | 'assistant'
      })));
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      toast.error('Kunde inte hämta chatthistorik');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string, webhookUrl?: string) => {
    if (!user || !content.trim()) return;

    setSending(true);
    try {
      // Save user message
      const { data: userMessage, error: userError } = await supabase
        .from('lead_chat_messages')
        .insert({
          user_id: user.id,
          provider,
          role: 'user',
          content: content.trim()
        })
        .select()
        .single();

      if (userError) throw userError;

      // Send to webhook (n8n)
      if (webhookUrl) {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id: user.id,
            message: content.trim(),
            context: provider,
            conversation_id: userMessage.id
          })
        });

        if (!response.ok) {
          throw new Error('Webhook request failed');
        }

        const result = await response.json();

        // Save assistant response
        if (result.response) {
          await supabase
            .from('lead_chat_messages')
            .insert({
              user_id: user.id,
              provider,
              role: 'assistant',
              content: result.response,
              metadata: result.metadata || {}
            });
        }
      }

      toast.success('Meddelande skickat');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Kunde inte skicka meddelande');
    } finally {
      setSending(false);
    }
  };

  const clearChat = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('lead_chat_messages')
        .delete()
        .eq('user_id', user.id)
        .eq('provider', provider);

      if (error) throw error;
      
      setMessages([]);
      toast.success('Chatthistorik rensad');
    } catch (error) {
      console.error('Error clearing chat:', error);
      toast.error('Kunde inte rensa chatthistorik');
    }
  };

  return {
    messages,
    loading,
    sending,
    sendMessage,
    clearChat,
    refetch: fetchMessages
  };
}
