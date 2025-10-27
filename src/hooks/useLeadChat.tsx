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
  conversation_id: string | null;
}

export interface Conversation {
  id: string;
  user_id: string;
  provider: string;
  title: string | null;
  created_at: string;
  updated_at: string;
  message_count: number;
}

const CHAT_URL = "https://shskknkivuewuqonjdjc.supabase.co/functions/v1/linkedin-chat";

export const useLeadChat = (provider: string = 'claude-linkedin') => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!user) {
      setMessages([]);
      setConversations([]);
      setLoading(false);
      return;
    }

    fetchConversations();

    // Real-time subscription for conversations
    const conversationsChannel = supabase
      .channel('lead_chat_conversations_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lead_chat_conversations',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    // Real-time subscription for messages
    const messagesChannel = supabase
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
          const newMessage = payload.new as ChatMessage;
          if (newMessage.conversation_id === currentConversationId) {
            setMessages(prev => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(conversationsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [user, provider, currentConversationId]);

  const fetchConversations = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('lead_chat_conversations' as any)
      .select('*')
      .eq('provider', provider)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
    } else {
      const convData = (data as any as Conversation[]) || [];
      setConversations(convData);
      
      // If no current conversation and we have conversations, select the most recent
      if (!currentConversationId && convData.length > 0) {
        setCurrentConversationId(convData[0].id);
      }
    }
    setLoading(false);
  };

  const fetchMessages = async (conversationId: string) => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('lead_chat_messages' as any)
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching chat messages:', error);
      toast({
        title: "Fel",
        description: "Kunde inte ladda chatthistorik",
        variant: "destructive",
      });
    } else {
      setMessages((data as any as ChatMessage[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (currentConversationId) {
      fetchMessages(currentConversationId);
    } else {
      setMessages([]);
    }
  }, [currentConversationId]);

  const createNewConversation = async () => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('lead_chat_conversations' as any)
      .insert({
        user_id: user.id,
        provider,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Fel",
        description: "Kunde inte skapa ny konversation",
        variant: "destructive",
      });
      return null;
    }

    setCurrentConversationId((data as any).id);
    setMessages([]);
    await fetchConversations();
    return (data as any).id;
  };

  const selectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId);
  };

  const deleteConversation = async (conversationId: string) => {
    if (!user) return false;

    const { error } = await supabase
      .from('lead_chat_conversations' as any)
      .delete()
      .eq('id', conversationId);

    if (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: "Fel",
        description: "Kunde inte ta bort konversation",
        variant: "destructive",
      });
      return false;
    }

    if (currentConversationId === conversationId) {
      setCurrentConversationId(null);
      setMessages([]);
    }

    await fetchConversations();
    toast({
      title: "Borttagen",
      description: "Konversationen har tagits bort",
    });
    return true;
  };

  const sendMessage = async (content: string, onChunk?: (chunk: string) => void) => {
    if (!user || !content.trim()) return false;

    let conversationId = currentConversationId;
    
    // Create new conversation if none exists
    if (!conversationId) {
      conversationId = await createNewConversation();
      if (!conversationId) return false;
    }

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
          conversation_id: conversationId,
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
          conversationId,
        }),
      });

      if (!response.ok || !response.body) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Kunde inte få AI-svar');
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

  return {
    conversations,
    currentConversationId,
    messages,
    loading,
    sending,
    sendMessage,
    createNewConversation,
    selectConversation,
    deleteConversation,
    refetch: fetchConversations,
  };
};
