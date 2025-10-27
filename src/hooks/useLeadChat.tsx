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

const CHAT_URL = "https://shskknkivuewuqonjdjc.supabase.co/functions/v1/linkedin-chat";

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

  const sendMessage = async (content: string, onChunk?: (chunk: string) => void) => {
    if (!user || !content.trim()) return false;

    setSending(true);

    try {
      // 1. Save user message to Supabase
      const { error: insertError } = await supabase
        .from('lead_chat_messages' as any)
        .insert({
          user_id: user.id,
          provider,
          role: 'user',
          content: content.trim(),
          metadata: {},
        });

      if (insertError) {
        throw insertError;
      }

      // 2. Get all messages for context
      const allMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));
      
      // Add the new user message
      allMessages.push({
        role: 'user' as const,
        content: content.trim(),
      });

      // 3. Stream response from AI
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({
          messages: allMessages,
          userId: user.id,
        }),
      });

      if (!response.ok || !response.body) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      // Stream the response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process line by line
        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const chunk = parsed.choices?.[0]?.delta?.content;
            if (chunk && onChunk) {
              onChunk(chunk);
            }
          } catch {
            // Ignore parse errors for incomplete JSON
          }
        }
      }

      setSending(false);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Fel",
        description: error instanceof Error ? error.message : "Kunde inte skicka meddelande",
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
