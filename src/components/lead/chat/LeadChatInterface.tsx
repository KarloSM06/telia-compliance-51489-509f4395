import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Trash2, Bot, User } from "lucide-react";
import { useLeadChat } from "@/hooks/useLeadChat";
import { cn } from "@/lib/utils";
import linkedinLogo from "@/assets/linkedin-logo.png";
import anthropicLogo from "@/assets/anthropic-logo.png";

export const LeadChatInterface = () => {
  const { messages, loading, sending, sendMessage, clearHistory } = useLeadChat('claude-linkedin');
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    
    const userInput = input;
    setInput("");
    
    // Create a temporary assistant message that will be updated with streamed content
    let streamedContent = "";
    
    const success = await sendMessage(userInput, (chunk) => {
      streamedContent += chunk;
      // The message will be added to the list via real-time subscription
    });
    
    if (!success) {
      setInput(userInput); // Restore input on error
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="h-full flex flex-col bg-gradient-to-br from-blue-50/50 to-orange-50/50 dark:from-blue-950/20 dark:to-orange-950/20">
      <CardHeader className="border-b bg-gradient-to-r from-blue-600 to-orange-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img src={linkedinLogo} alt="LinkedIn" className="h-7 w-7 rounded-md bg-white/10 p-0.5" />
              <span className="text-white/60">×</span>
              <img src={anthropicLogo} alt="Anthropic" className="h-7 w-7 rounded-md bg-white/10 p-0.5" />
            </div>
            <CardTitle className="text-lg">AI Chat Assistent</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={clearHistory}
            className="text-white hover:bg-white/20"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {loading ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Laddar chatthistorik...
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center px-4">
              <div>
                <div className="inline-flex items-center gap-3 mb-4">
                  <img src={linkedinLogo} alt="LinkedIn" className="h-12 w-12 rounded-lg" />
                  <span className="text-2xl text-muted-foreground">×</span>
                  <img src={anthropicLogo} alt="Anthropic" className="h-12 w-12 rounded-lg" />
                </div>
                <h3 className="font-semibold mb-2">Välkommen till AI Lead-assistenten</h3>
                <p className="text-sm text-muted-foreground">
                  Berätta vad för leads du söker, t.ex:<br />
                  "Hitta tech-företag i Stockholm med 50+ anställda"
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 animate-fade-in",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-orange-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2 shadow-sm",
                      message.role === 'user'
                        ? "bg-blue-600 text-white"
                        : "bg-white dark:bg-gray-800 border"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {new Date(message.created_at).toLocaleTimeString('sv-SE', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {sending && (
                <div className="flex gap-3 animate-fade-in">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-orange-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="max-w-[80%] rounded-2xl px-4 py-2 bg-white dark:bg-gray-800 border">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t bg-background">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Skriv ditt meddelande här..."
              className="min-h-[60px] resize-none"
              disabled={sending}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
