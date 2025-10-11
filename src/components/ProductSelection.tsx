import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRight, CheckCircle, Zap, Target, Sparkles, ChefHat, Headphones, UserCheck, TrendingUp, MessageSquare, ShoppingCart, Award, Send, Loader2, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const CHAT_URL = `https://shskknkivuewuqonjdjc.supabase.co/functions/v1/chat-assistant`;

export const ProductSelection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hej! 👋 Jag heter Krono och är er digitala AI-rådgivare från Hiems. Vilket paket passar bäst för ditt företag? Berätta lite om er verksamhet så hjälper jag er hitta rätt lösning!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

      if (textBuffer.trim()) {
        for (let raw of textBuffer.split('\n')) {
          if (!raw) continue;
          if (raw.endsWith('\r')) raw = raw.slice(0, -1);
          if (raw.startsWith(':') || raw.trim() === '') continue;
          if (!raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
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
          } catch {}
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Ursäkta, något gick fel. Vänligen försök igen eller kontakta oss direkt.'
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  const handlePackageClick = (packageName: string) => {
    navigate(`/${packageName.toLowerCase()}`);
  };

  const handlePhoneSubmit = () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Telefonnummer saknas",
        description: "Vänligen ange ett telefonnummer",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would typically send the phone number to your backend
    toast({
      title: "Tack!",
      description: "Vi ringer upp dig inom kort",
    });
    
    setPhoneNumber('');
    setIsDialogOpen(false);
  };
  return <div className="relative overflow-hidden bg-gradient-hero">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 mb-8 backdrop-blur-sm border border-accent/20">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-white">AI-driven automation för företag</span>
            </div>
            
            <h1 className="text-5xl font-display font-bold tracking-tight text-white sm:text-7xl mb-8 leading-tight">
              Skräddarsydda AI-lösningar för{" "}
              <span className="bg-gradient-gold bg-clip-text text-transparent">
                framtidens företag
              </span>
            </h1>
            
            <p className="text-xl leading-relaxed mb-6 font-light text-white/90">Vi bygger skräddarsydda intelligenta lösningar som gör ditt företag snabbare, smartare och framförallt mer lönsamt</p>
            <p className="text-lg leading-relaxed text-white/80 max-w-3xl mx-auto">   Med Hiems får ni inte bara tillgång till marknadens främsta AI-lösningar. Ni får en trogen partner som ser till att eran verksamhet alltid befinner sig i framkant </p>
          </div>
        </div>
      </section>

      {/* Vad vi gör Section */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-display font-bold text-white mb-4">Vad vi gör</h2>
            <div className="w-20 h-1 bg-gradient-gold mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group relative rounded-2xl bg-white/5 p-8 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-300 hover:shadow-glow animate-fade-in">
              <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity"></div>
              <CheckCircle className="h-12 w-12 text-accent mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-display font-bold text-white mb-3">Analys av era behov och mål</h3>
              <p className="text-white/70 leading-relaxed">Vi analyserar er verksamhet för att förstå era mål, processer och tillväxtpotential. Genom datadriven insikt identifierar vi hur AI kan effektivisera arbetet och öka intäkterna.</p>
            </div>
            <div className="group relative rounded-2xl bg-white/5 p-8 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-300 hover:shadow-glow animate-fade-in delay-100">
              <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity"></div>
              <Zap className="h-12 w-12 text-accent mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-display font-bold text-white mb-3">Skräddarsydda verktyg</h3>
              <p className="text-white/70 leading-relaxed">Utifrån analysen utvecklar vi skräddarsydda AI-verktyg anpassade till era behov. De integreras sömlöst i befintliga system och optimerar era flöden – för både effektivitet och lönsamhet.</p>
            </div>
            <div className="group relative rounded-2xl bg-white/5 p-8 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-300 hover:shadow-glow animate-fade-in delay-200">
              <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity"></div>
              <Target className="h-12 w-12 text-accent mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-display font-bold text-white mb-3">Lösningar i praktiken</h3>
              <p className="text-white/70 leading-relaxed">När lösningarna tas i bruk märks effekten direkt: snabbare processer, smartare beslut och ökade intäkter. Vi följer upp och vidareutvecklar så att era AI-verktyg fortsätter skapa värde över tid.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-display font-bold text-white mb-4">Färdiga paket</h2>
            <div className="w-20 h-1 bg-gradient-gold mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-white/80">Våra färdiga AI-paket är kombinationer av flera verktyg gjorda för att passa olika branscher. Dessa skräddarsys för att passa just er verksamhet och levereras på högst två veckor – så ni snabbt kan börja effektivisera och växa er verksamhet. </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {/* Restaurangpaketet */}
            <Card className="group relative overflow-hidden border-2 border-white/10 bg-gradient-card backdrop-blur-sm hover:border-accent/50 transition-all duration-500 hover:shadow-glow animate-scale-in">
              <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <CardHeader className="relative">
                <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-accent/10 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <ChefHat className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="text-2xl font-display mb-2">Restaurang</CardTitle>
                <CardDescription className="text-base text-muted-foreground">Automatisera rutiner för restauranger och caféer med AI som hanterar bokningar, beställningar och kundfeedback.</CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-foreground/80 leading-relaxed">Automatisk hantering av bokningar och beställningar</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-foreground/80 leading-relaxed">Optimering av kök och serviceflöden</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-foreground/80 leading-relaxed">Intelligent kundfeedback-hantering</span>
                  </li>
                </ul>
                <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-button group-hover:shadow-glow transition-all duration-300 font-semibold text-base h-14" onClick={() => handlePackageClick('restaurang')}>
                  Läs mer
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>

            {/* Receptionistpaketet */}
            <Card className="group relative overflow-hidden border-2 border-white/10 bg-gradient-card backdrop-blur-sm hover:border-accent/50 transition-all duration-500 hover:shadow-glow animate-scale-in delay-100">
              <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <CardHeader className="relative">
                <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-accent/10 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Headphones className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="text-2xl font-display mb-2">Receptionist</CardTitle>
                <CardDescription className="text-base text-muted-foreground">Virtuell AI-receptionist som hanterar samtal, SMS och mejl dygnet runt.</CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-foreground/80 leading-relaxed">24/7 hantering av samtal, SMS och mejl</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-foreground/80 leading-relaxed">Automatiska bokningar och vidarekoppling</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-foreground/80 leading-relaxed">Snabb och professionell service</span>
                  </li>
                </ul>
                <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-button group-hover:shadow-glow transition-all duration-300 font-semibold text-base h-14" onClick={() => handlePackageClick('receptionist')}>
                  Läs mer
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>

            {/* Rekryteringspaketet */}
            <Card className="group relative overflow-hidden border-2 border-white/10 bg-gradient-card backdrop-blur-sm hover:border-accent/50 transition-all duration-500 hover:shadow-glow animate-scale-in delay-200">
              <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <CardHeader className="relative">
                <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-accent/10 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <UserCheck className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="text-2xl font-display mb-2">Rekrytering</CardTitle>
                <CardDescription className="text-base text-muted-foreground">Effektivisera rekrytering med AI som screener, rankar och föreslår de bästa kandidaterna.</CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-foreground/80 leading-relaxed">Automatisk screening av ansökningar</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-foreground/80 leading-relaxed">Rankning och matchning av kandidater</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-foreground/80 leading-relaxed">Snabbare rekrytering av rätt talanger</span>
                  </li>
                </ul>
                <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-button group-hover:shadow-glow transition-all duration-300 font-semibold text-base h-14" onClick={() => handlePackageClick('rekrytering')}>
                  Läs mer
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>

            {/* Prospektpaketet */}
            <Card className="group relative overflow-hidden border-2 border-white/10 bg-gradient-card backdrop-blur-sm hover:border-accent/50 transition-all duration-500 hover:shadow-glow animate-scale-in">
              <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <CardHeader className="relative">
                <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-accent/10 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <TrendingUp className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="text-2xl font-display mb-2">Prospektering</CardTitle>
                <CardDescription className="text-base text-muted-foreground">Öka er försäljningspipeline med AI som identifierar och kvalificerar potentiella kunder.</CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-foreground/80 leading-relaxed">Automatisk identifiering av prospekt</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-foreground/80 leading-relaxed">Kvalificering och skapande av leads</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-foreground/80 leading-relaxed">Maximerar affärsmöjligheter</span>
                  </li>
                </ul>
                <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-button group-hover:shadow-glow transition-all duration-300 font-semibold text-base h-14" onClick={() => handlePackageClick('prospekt')}>
                  Läs mer
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>

            {/* Kvalitets- och feedbackpaketet */}
            <Card className="group relative overflow-hidden border-2 border-accent/30 bg-gradient-card backdrop-blur-sm hover:border-accent transition-all duration-500 hover:shadow-glow animate-scale-in delay-100">
              <div className="absolute inset-0 bg-gradient-gold opacity-5 group-hover:opacity-20 transition-opacity duration-500"></div>
              <div className="absolute top-4 right-4 px-3 py-1 bg-accent/20 rounded-full border border-accent/50">
                <span className="text-xs font-semibold text-accent">POPULÄR</span>
              </div>
              <CardHeader className="relative">
                <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-accent/10 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <MessageSquare className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="text-2xl font-display mb-2">Compliance</CardTitle>
                <CardDescription className="text-base text-muted-foreground">Analysera säljsamtal med AI för kvalitetsgranskning och coaching</CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-foreground/80 leading-relaxed">100% automatisk kvalitetsgranskning</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-foreground/80 leading-relaxed">AI-driven coaching och feedback</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-foreground/80 leading-relaxed">Skyddar varumärket med konsekvent kvalitet</span>
                  </li>
                </ul>
                <Button size="lg" className="w-full bg-gradient-gold text-accent-foreground hover:opacity-90 shadow-button group-hover:shadow-glow transition-all duration-300 font-semibold text-base h-14" onClick={() => handlePackageClick('kvalitet')}>
                  Läs mer
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>

            {/* Hemside- och produktoptimeringspaketet */}
            <Card className="group relative overflow-hidden border-2 border-white/10 bg-gradient-card backdrop-blur-sm hover:border-accent/50 transition-all duration-500 hover:shadow-glow animate-scale-in delay-200">
              <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <CardHeader className="relative">
                <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-accent/10 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <ShoppingCart className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="text-2xl font-display mb-2">Produktoptimering för hemsidor</CardTitle>
                <CardDescription className="text-base text-muted-foreground">AI som visar rätt produkter till rätt kunder baserat på användarbeteende.</CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-foreground/80 leading-relaxed">Analys av användarbeteende och köphistorik</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-foreground/80 leading-relaxed">Automatisk produktprioritering per besökare</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-foreground/80 leading-relaxed">Högre konvertering och ökad försäljning</span>
                  </li>
                </ul>
                <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-button group-hover:shadow-glow transition-all duration-300 font-semibold text-base h-14" onClick={() => handlePackageClick('hemsideoptimering')}>
                  Läs mer
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Varför Hiems Section */}
      <section className="relative py-24 bg-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-display font-bold text-white mb-4">Varför Hiems?</h2>
            <div className="w-20 h-1 bg-gradient-gold mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group text-center animate-fade-in">
              <div className="relative rounded-2xl bg-white/5 p-10 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6 group-hover:scale-110 transition-transform">
                    <Target className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-3">Skräddarsydd AI</h3>
                  <p className="text-white/70 leading-relaxed">Vi skapar AI-lösningar helt anpassade efter er verksamhet och era mål – inget standardpaket, allt designat för maximal effekt.</p>
                </div>
              </div>
            </div>
            <div className="group text-center animate-fade-in delay-100">
              <div className="relative rounded-2xl bg-white/5 p-10 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6 group-hover:scale-110 transition-transform">
                    <CheckCircle className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-3">Ni ser bara resultaten</h3>
                  <p className="text-white/70 leading-relaxed">Vi tar hand om allt – från utveckling till implementation. Ni behöver inte lyfta ett finger, utan får direkt värde och mätbara resultat.</p>
                </div>
              </div>
            </div>
            <div className="group text-center animate-fade-in delay-200">
              <div className="relative rounded-2xl bg-white/5 p-10 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6 group-hover:scale-110 transition-transform">
                    <Award className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-3">Hiems som partner</h3>
                  <p className="text-white/70 leading-relaxed"> Med Hiems får ni inte bara AI – ni får en pålitlig partner som skapar kontinuerlig tillväxt och långsiktigt värde.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testa själv Section */}
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="relative rounded-3xl bg-gradient-primary overflow-hidden shadow-elegant">
              <div className="absolute inset-0 bg-gradient-gold opacity-10"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
              
              {/* Header */}
              <div className="relative p-8 md:p-12 text-center border-b border-white/10">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 mb-6 backdrop-blur-sm border border-white/20">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-white">Hur hade AI hjälpt er verksamhet?</span>
                </div>
                <h2 className="text-4xl font-display font-bold text-white mb-4">Se hur AI hade kunnat effektivisera er verksamhet</h2>
                <p className="text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
                  Prata med Krono, vår AI-rådgivare, eller prova vår demo för att se hur AI kan analysera säljsamtal i realtid.
                </p>
              </div>

              {/* Chat Area */}
              <div className="relative bg-white/5 backdrop-blur-sm">
                <ScrollArea className="h-[400px] p-6" ref={scrollRef}>
                  <div className="space-y-4">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                            msg.role === 'user'
                              ? 'bg-white text-primary'
                              : 'bg-white/10 text-white backdrop-blur-sm border border-white/20'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white/10 rounded-2xl px-4 py-2.5 backdrop-blur-sm border border-white/20">
                          <Loader2 className="h-4 w-4 animate-spin text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-6 border-t border-white/10">
                  <div className="flex gap-3">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Skriv ditt meddelande till Krono..."
                      disabled={isLoading}
                      className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/15"
                    />
                    <Button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      size="icon"
                      className="bg-white text-primary hover:bg-white/90 h-10 w-10"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-4 text-center">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="lg" className="bg-white/5 border-white/20 text-white hover:bg-white/10 font-semibold group">
                          Prova receptionistdemo
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md bg-background border-border">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Phone className="h-5 w-5 text-accent" />
                            Prova Receptionistdemo
                          </DialogTitle>
                          <DialogDescription>
                            Skriv in telefonnummer för att bli uppringd av vår receptionist
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <Input
                            placeholder="070-123 45 67"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handlePhoneSubmit();
                              }
                            }}
                            className="text-base"
                          />
                          <Button 
                            onClick={handlePhoneSubmit}
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                            size="lg"
                          >
                            Ring mig
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>;
};