import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { normalizePhoneNumber } from "@/lib/phoneUtils";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface QuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CHAT_URL = `https://shskknkivuewuqonjdjc.supabase.co/functions/v1/chat-assistant`;

export const QuoteModal = ({ open, onOpenChange }: QuoteModalProps) => {
  const [step, setStep] = useState<'chat' | 'form'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hej! 👋 Jag heter Krono och jag hjälper dig att formulera din offertförfrågan. Berätta om ditt företag och vilken typ av AI-lösning ni är intresserade av?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (userMessage: string) => {
    const userMsg: Message = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    let assistantContent = '';

    try {
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to start stream');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') {
                  return prev.map((m, i) => 
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [...prev, { role: 'assistant', content: assistantContent }];
              });
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Ursäkta, något gick fel. Vänligen försök igen.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput('');
    await streamChat(userMessage);
  };

  const handleContinueToForm = () => {
    const conversationSummary = messages
      .filter(m => m.role === 'user')
      .map(m => m.content)
      .join('\n\n');
    setSummary(conversationSummary);
    setStep('form');
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!summary.trim() || !phoneNumber.trim()) {
      toast({
        title: "Saknad information",
        description: "Vänligen fyll i alla obligatoriska fält",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const normalizedPhone = normalizePhoneNumber(phoneNumber);
      
      const { error } = await supabase.functions.invoke('krono-quote', {
        body: {
          summary: summary.trim(),
          email: email.trim() || null,
          phone_number: normalizedPhone
        }
      });

      if (error) throw error;

      toast({
        title: "Tack för din förfrågan!",
        description: "Vi återkommer inom kort med en offert.",
      });
      
      // Reset form
      setStep('chat');
      setMessages([{
        role: 'assistant',
        content: 'Hej! 👋 Jag heter Krono och jag hjälper dig att formulera din offertförfrågan. Berätta om ditt företag och vilken typ av AI-lösning ni är intresserade av?'
      }]);
      setSummary('');
      setEmail('');
      setPhoneNumber('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast({
        title: "Ett fel uppstod",
        description: "Kunde inte skicka din förfrågan. Vänligen försök igen.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent" />
            {step === 'chat' ? 'Få offert med hjälp av Krono' : 'Slutför din offertförfrågan'}
          </DialogTitle>
          <DialogDescription>
            {step === 'chat' 
              ? 'Chatta med Krono för att formulera din offertförfrågan'
              : 'Granska och komplettera din information'
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'chat' ? (
          <div className="space-y-4">
            <ScrollArea className="h-[300px] border rounded-lg p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <p className="text-sm">Skriver...</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                placeholder="Skriv ditt meddelande..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={isLoading}
              />
              <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <Button 
              onClick={handleContinueToForm} 
              className="w-full"
              disabled={messages.length < 3}
            >
              Fortsätt till formulär
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmitQuote} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="summary">Sammanfattning *</Label>
              <Textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={6}
                required
                placeholder="Redigera sammanfattningen från konversationen..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-post (valfritt)</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din@epost.se"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefonnummer *</Label>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="070-123 45 67"
                required
              />
              <p className="text-xs text-muted-foreground">
                Numret konverteras automatiskt till internationellt format (+46...)
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep('chat')}
                className="flex-1"
              >
                Tillbaka
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Skickar..." : "Skicka förfrågan"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
