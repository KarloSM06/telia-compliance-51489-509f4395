import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Menu } from "lucide-react";
import { useLeadChat } from "@/hooks/useLeadChat";
import { cn } from "@/lib/utils";
import linkedinLogo from "@/assets/linkedin-icon.webp";
import anthropicLogo from "@/assets/anthropic-ai-logo.png";
import { ConversationList } from "./ConversationList";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const LeadChatInterface = () => {
  const { 
    conversations,
    currentConversationId,
    messages, 
    loading, 
    sending, 
    sendMessage,
    createNewConversation,
    selectConversation,
    deleteConversation,
  } = useLeadChat('claude-linkedin');
  const [input, setInput] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
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
    <div className="h-full flex gap-4">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 flex-shrink-0">
        <Card className="h-full">
          <ConversationList
            conversations={conversations}
            currentConversationId={currentConversationId}
            onSelectConversation={selectConversation}
            onNewConversation={createNewConversation}
            onDeleteConversation={deleteConversation}
          />
        </Card>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={showSidebar} onOpenChange={setShowSidebar}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50 text-white bg-[#D97642] hover:bg-[#C66632]"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <ConversationList
            conversations={conversations}
            currentConversationId={currentConversationId}
            onSelectConversation={(id) => {
              selectConversation(id);
              setShowSidebar(false);
            }}
            onNewConversation={() => {
              createNewConversation();
              setShowSidebar(false);
            }}
            onDeleteConversation={deleteConversation}
          />
        </SheetContent>
      </Sheet>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col bg-orange-50/30 dark:bg-orange-950/10">
        <CardHeader className="border-b bg-[#D97642] text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <img src={linkedinLogo} alt="LinkedIn" className="h-7 w-7 object-contain" />
                <span className="text-white/60">×</span>
                <img src={anthropicLogo} alt="Anthropic" className="h-7 w-7 object-contain" />
              </div>
              <CardTitle className="text-lg">AI Chat Assistent</CardTitle>
            </div>
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
                  <img src={linkedinLogo} alt="LinkedIn" className="h-12 w-12 object-contain" />
                  <span className="text-2xl text-muted-foreground">×</span>
                  <img src={anthropicLogo} alt="Anthropic" className="h-12 w-12 object-contain" />
                </div>
                <h3 className="font-semibold mb-2">Välkommen till AI Lead-assistenten</h3>
                <p className="text-sm text-muted-foreground">
                  {conversations.length === 0 
                    ? "Starta en ny konversation för att börja söka leads."
                    : "Berätta vad för leads du söker, t.ex: 'Hitta tech-företag i Stockholm med 50+ anställda'"
                  }
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
                    <div className="w-8 h-8 rounded-full bg-[#D97642] flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2 shadow-sm",
                      message.role === 'user'
                        ? "bg-[#D97642] text-white"
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
                    <div className="w-8 h-8 rounded-full bg-[#D97642] flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {sending && (
                <div className="flex gap-3 animate-fade-in">
                  <div className="w-8 h-8 rounded-full bg-[#D97642] flex items-center justify-center flex-shrink-0">
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
              className="bg-[#D97642] hover:bg-[#C66632]"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
  );
};
