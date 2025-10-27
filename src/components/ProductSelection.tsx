import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRight, CheckCircle, Zap, Target, Sparkles, ChefHat, Headphones, UserCheck, TrendingUp, MessageSquare, ShoppingCart, Award, Send, Loader2, Phone, BarChart3, Users, Clock, Star, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { QuoteModal } from "@/components/QuoteModal";
import { ConsultationModal } from "@/components/ConsultationModal";
import { normalizePhoneNumber } from "@/lib/phoneUtils";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { EnterpriseContactModal } from "@/components/EnterpriseContactModal";
import { availablePackages } from "@/components/dashboard/PackagesData";
import { AnimatedSection } from "@/components/AnimatedSection";
import { QuickNavigation } from "@/components/QuickNavigation";
import heroBackground from "@/assets/hero-background.jpg";
import toolsBackground from "/public/images/tools-background.jpg";
import karloImage from "@/assets/karlo-mangione.png";
import antonImage from "@/assets/anton-sallnas.png";
import emilImage from "@/assets/emil-westerberg.png";
interface Message {
  role: 'user' | 'assistant';
  content: string;
}
const CHAT_URL = `https://shskknkivuewuqonjdjc.supabase.co/functions/v1/chat-assistant`;
export const ProductSelection = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    user
  } = useAuth();
  const {
    addItem
  } = useCart();
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: 'Hej! 👋 Jag heter Krono och är er digitala AI-rådgivare från Hiems. Vilket paket passar bäst för ditt företag? Berätta lite om er verksamhet så hjälper jag er hitta rätt lösning!'
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isEnterpriseModalOpen, setIsEnterpriseModalOpen] = useState(false);
  const [selectedEnterpriseProduct, setSelectedEnterpriseProduct] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  const streamChat = async (userMessage: string) => {
    const userMsg: Message = {
      role: 'user',
      content: userMessage
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    let assistantContent = '';
    try {
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...messages, userMsg]
        })
      });
      if (!response.ok || !response.body) {
        throw new Error('Failed to start stream');
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let streamDone = false;
      while (!streamDone) {
        const {
          done,
          value
        } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, {
          stream: true
        });
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
                  return prev.map((m, i) => i === prev.length - 1 ? {
                    ...m,
                    content: assistantContent
                  } : m);
                }
                return [...prev, {
                  role: 'assistant',
                  content: assistantContent
                }];
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
                  return prev.map((m, i) => i === prev.length - 1 ? {
                    ...m,
                    content: assistantContent
                  } : m);
                }
                return [...prev, {
                  role: 'assistant',
                  content: assistantContent
                }];
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
    setSelectedPackage(packageName);
  };
  const [selectedMinutes, setSelectedMinutes] = useState(100);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showPackages, setShowPackages] = useState(false);
  const minuteOptions = [100, 250, 500, 1000];
  const minutePricing: Record<number, {
    pro: number;
    business: number;
    enterprise: string;
  }> = {
    100: {
      pro: 899,
      business: 1499,
      enterprise: "Offert"
    },
    250: {
      pro: 1999,
      business: 3499,
      enterprise: "Offert"
    },
    500: {
      pro: 3799,
      business: 6499,
      enterprise: "Offert"
    },
    1000: {
      pro: 6999,
      business: 11999,
      enterprise: "Offert"
    }
  };
  const packageDetails: Record<string, {
    title: string;
    fullDescription: string;
    features: string[];
    hasMinutes?: boolean;
    pricing?: {
      pro: {
        price: string | number;
        features: string[];
      };
      business: {
        price: string | number;
        features: string[];
      };
      enterprise: {
        price: string;
        features: string[];
      };
    };
  }> = {
    krono: {
      title: "🧠 Hiems Krono – AI Receptionist",
      fullDescription: "Hanterar samtal, SMS & mejl dygnet runt.",
      features: ["Hanterar samtal & SMS 24/7", "Bokning & avbokning", "Enkel röstprofil", "Grundläggande rapportering", "Integration med Google Kalender"],
      hasMinutes: true,
      pricing: {
        pro: {
          price: "Från 899 kr",
          features: ["Hanterar samtal & SMS 24/7", "Bokning & avbokning", "Enkel röstprofil", "Grundläggande rapportering", "Integration med Google Kalender"]
        },
        business: {
          price: "Från 1 499 kr",
          features: ["Allt i Pro +", "Flera röstprofiler", "Anpassat samtalsflöde", "Samtalsanalys & transkribering", "Sammanfattning via mejl", "CRM-integration (HubSpot, Pipedrive etc.)"]
        },
        enterprise: {
          price: "Offert",
          features: ["Allt i Business +", "Fler språk & avancerad NLP", "Egen AI-modellträning", "Skräddarsydd dashboard", "Obegränsad trafik & prioriterad support"]
        }
      }
    },
    gastro: {
      title: "🍽️ Hiems Krono Gastro – AI Restaurang & Café",
      fullDescription: "Hanterar bokningar, beställningar, menyfrågor och kundfeedback.",
      features: ["Tar emot bokningar via telefon & SMS", "Bekräftar, ändrar & avbokar", "Enkel menyhantering", "Daglig sammanställning via mejl"],
      hasMinutes: true,
      pricing: {
        pro: {
          price: "Från 899 kr",
          features: ["Tar emot bokningar via telefon & SMS", "Bekräftar, ändrar & avbokar", "Enkel menyhantering", "Daglig sammanställning via mejl"]
        },
        business: {
          price: "Från 1 499 kr",
          features: ["Allt i Pro +", "Integration med kassasystem (t.ex. Trivec)", "Hanterar takeaway & leverans", "Kundfeedback-analys", "Statistik över toppbokningar & återkommande gäster"]
        },
        enterprise: {
          price: "Offert",
          features: ["Allt i Business +", "Fler språk", "Egen röstprofil per restaurang", "Avancerad menyoptimering & upsell-funktion"]
        }
      }
    },
    talent: {
      title: "👔 Hiems Hermes Talent – AI Rekrytering",
      fullDescription: "Screening, kandidatidentifiering & matchning.",
      features: ["Automatisk screening av CV & ansökningar", "Enkel rankning", "Genererar shortlist", "Rapport via e-post"],
      pricing: {
        pro: {
          price: 2999,
          features: ["Automatisk screening av CV & ansökningar", "Enkel rankning", "Genererar shortlist", "Rapport via e-post"]
        },
        business: {
          price: 5499,
          features: ["Allt i Pro +", "Automatisk kandidat-sökning på LinkedIn", "Intervju-sammanfattningar", "Integration med rekryteringssystem (Teamtailor etc.)"]
        },
        enterprise: {
          price: "Offert",
          features: ["Allt i Business +", "Skräddarsydd AI för branschspecifika roller", "Prediktiv matchning baserat på kultur & värderingar"]
        }
      }
    },
    lead: {
      title: "🚀 Hiems Hermes Lead – AI Prospektering",
      fullDescription: "Identifierar, kvalificerar & följer upp leads automatiskt.",
      features: ["Identifierar potentiella kunder", "Skapar kontaktlistor", "Skickar automatiska mejl & uppföljningar"],
      pricing: {
        pro: {
          price: 3999,
          features: ["Identifierar potentiella kunder", "Skapar kontaktlistor", "Skickar automatiska mejl & uppföljningar"]
        },
        business: {
          price: 7499,
          features: ["Allt i Pro +", "AI skriver personliga mejl", "CRM-integration", "Automatiska uppföljningar tills svar"]
        },
        enterprise: {
          price: "Offert",
          features: ["Allt i Business +", "Full funnel automation (mejl → möte → close)", "Prediktiv lead scoring", "Anpassad lead dashboard"]
        }
      }
    },
    thor: {
      title: "🎧 Hiems Thor – AI Compliance & Coaching",
      fullDescription: "Analyserar säljsamtal, ger feedback & coaching.",
      features: ["Automatisk samtalsgranskning", "Grundläggande feedback via e-post"],
      pricing: {
        pro: {
          price: 499,
          features: ["Automatisk samtalsgranskning", "Grundläggande feedback via e-post", "Per agent"]
        },
        business: {
          price: 699,
          features: ["Allt i Pro +", "AI-coach", "Anpassad rapport per säljare", "Dashboard & statistik", "Per agent"]
        },
        enterprise: {
          price: "Offert",
          features: ["Allt i Business +", "Obegränsade användare", "Integration till CRM & samtalsplattformar"]
        }
      }
    },
    eko: {
      title: "⭐ Hiems Eko – AI Omdömeshantering",
      fullDescription: "Samlar, analyserar & agerar på kundomdömen från alla plattformar.",
      features: ["Samlar omdömen från alla plattformar", "AI-analys av sentiments & trender", "Automatiska svar på recensioner"],
      pricing: {
        pro: {
          price: 1999,
          features: ["Samlar omdömen från Google, Facebook & TripAdvisor", "AI-analys av sentiments & nyckelord", "Automatiska svar på positiva recensioner", "Veckorapport via e-post"]
        },
        business: {
          price: 3999,
          features: ["Allt i Pro +", "Svar på alla recensioner (inklusive negativa)", "Trendanalys & konkurrensjämförelse", "Integration med CRM & notifieringar vid negativa omdömen", "Anpassade AI-svar baserat på varumärke"]
        },
        enterprise: {
          price: "Offert",
          features: ["Allt i Business +", "Multi-location hantering", "Prediktiv analys & varningar", "White-label dashboard", "API-integration för egna system"]
        }
      }
    }
  };
  const handleCheckout = async (packageName: string, tier: 'pro' | 'business' | 'enterprise') => {
    // Kontrollera om användaren är inloggad
    if (!user) {
      navigate('/auth');
      return;
    }

    // Om Enterprise tier, öppna kontakt-modal istället
    if (tier === 'enterprise') {
      setSelectedEnterpriseProduct(packageDetails[packageName]?.title || packageName);
      setIsEnterpriseModalOpen(true);
      return;
    }

    // Hitta rätt paket från PackagesData
    const packageData = availablePackages.find(pkg => pkg.id === packageName);
    if (!packageData) {
      toast({
        title: "Fel",
        description: "Kunde inte hitta paketet",
        variant: "destructive"
      });
      return;
    }

    // Hämta rätt price ID
    let priceId: string | undefined;
    if (packageData.hasMinutes && packageData.stripePriceIds) {
      // För Krono & Gastro med minuter
      priceId = packageData.stripePriceIds[tier]?.[selectedMinutes];
    } else if (packageData.tiers) {
      // För övriga paket med tiers
      const tierData = packageData.tiers.find(t => t.name === tier);
      priceId = tierData?.stripePriceId;
    }
    if (!priceId) {
      toast({
        title: "Fel",
        description: "Kunde inte hitta pris-ID för detta alternativ",
        variant: "destructive"
      });
      return;
    }

    // Lägg till i kundvagnen
    addItem({
      productId: packageData.id,
      productName: packageData.fullName,
      tier: tier,
      minutes: packageData.hasMinutes ? selectedMinutes : undefined,
      priceId: priceId,
      price: packageData.hasMinutes ? packageData.minutePricing?.[selectedMinutes]?.[tier] as number : packageData.tiers?.find(t => t.name === tier)?.price as number
    });
    toast({
      title: "Tillagd i kundvagnen!",
      description: `${packageData.fullName} (${tier.toUpperCase()}) har lagts till`
    });
  };
  const normalizePhoneNumber = (phone: string): string => {
    // Remove all spaces, dashes, and parentheses
    let normalized = phone.replace(/[\s\-\(\)]/g, '');

    // If it starts with 0, assume it's Swedish and convert to +46
    if (normalized.startsWith('0')) {
      normalized = '+46' + normalized.substring(1);
    }
    // If it doesn't start with +, assume Swedish and add +46
    else if (!normalized.startsWith('+')) {
      normalized = '+46' + normalized;
    }
    return normalized;
  };
  const handlePhoneSubmit = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Telefonnummer saknas",
        description: "Vänligen ange ett telefonnummer",
        variant: "destructive"
      });
      return;
    }
    try {
      const normalizedPhone = normalizePhoneNumber(phoneNumber);
      const {
        error
      } = await supabase.from('phone_numbers').insert({
        phone_number: normalizedPhone
      });
      if (error) throw error;
      toast({
        title: "Tack!",
        description: `Vi ringer upp dig inom kort på ${normalizedPhone}`
      });
      setPhoneNumber('');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving phone number:', error);
      toast({
        title: "Ett fel uppstod",
        description: "Kunde inte spara ditt telefonnummer. Vänligen försök igen.",
        variant: "destructive"
      });
    }
  };
  return <div className="relative overflow-hidden bg-background">
      
      {/* Quick Navigation */}
      <QuickNavigation />
      
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 lg:py-40">
        {/* Hero Background Image with Overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={heroBackground} 
            alt="Hiems tekniker installerar värmesystem" 
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/75 to-primary/90"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-transparent to-primary/30"></div>
        </div>
        
        {/* Animated background elements on top of image */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{
          animationDelay: '1s'
        }}></div>
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection className="mx-auto max-w-4xl text-center">
            
            
            <h1 className="text-5xl font-display font-bold tracking-tight text-white sm:text-6xl lg:text-7xl mb-8 leading-tight">
              Vi bygger intelligenta system som arbetar åt dig
            </h1>
            
            <p className="text-lg sm:text-xl leading-relaxed mb-12 font-light text-white/90 max-w-3xl mx-auto">
              Vi bygger skräddarsydda intelligenta lösningar som gör ditt företag snabbare, smartare och framförallt mer lönsamt
            </p>
            <p className="text-lg leading-relaxed text-white/80 max-w-3xl mx-auto">   Med Hiems får ni inte bara tillgång till marknadens främsta AI-lösningar. Ni får en trogen partner som ser till att eran verksamhet alltid befinner sig i framkant </p>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-gradient-gold text-primary hover:shadow-glow hover:scale-105 transition-all duration-300 font-semibold text-lg px-10 py-7" onClick={() => setIsConsultationModalOpen(true)}>
                Boka behovsanalys
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white bg-white/10 hover:bg-white hover:text-primary hover:scale-105 transition-all duration-300 font-semibold text-lg px-10 py-7 backdrop-blur-sm" onClick={() => document.getElementById('about-ai')?.scrollIntoView({ behavior: 'smooth' })}>
                Vad är AI?
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Vad vi gör Section */}
      <section className="relative py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-foreground mb-6">Vi utvecklar skräddarsydda AI-system – från idé till drift</h2>
            <div className="w-20 h-1 bg-gradient-gold mx-auto rounded-full"></div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <AnimatedSection delay={0} className="group relative bg-card p-8 border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-elegant">
              <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6">
                  <span className="text-2xl font-bold text-accent">1</span>
                </div>
                <h3 className="text-xl font-display font-bold mb-3">Behovsanalys</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Vi börjar med att förstå hur ni arbetar i dag
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Identifierar var AI och automatisering kan spara tid
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={100} className="group relative bg-card p-8 border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-elegant">
              <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6">
                  <span className="text-2xl font-bold text-accent">2</span>
                </div>
                <h3 className="text-xl font-display font-bold mb-3">Utveckling & integration</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Vi designar och bygger lösningen i verktyg som n8n, Supabase och OpenAI
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Integrerar med era befintliga system – allt fungerar direkt
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200} className="group relative bg-card p-8 border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-elegant">
              <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6">
                  <span className="text-2xl font-bold text-accent">3</span>
                </div>
                <h3 className="text-xl font-display font-bold mb-3">Drift & optimering</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Vi följer upp, mäter resultat och förbättrar flöden över tid
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Våra lösningar i praktiken Section */}
      <section id="products" className="relative py-24 bg-muted/30">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={toolsBackground}
            alt="Tekniska verktyg och system"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-foreground mb-6">Exempel på vad vi bygger</h2>
            <div className="w-20 h-1 bg-gradient-gold mx-auto rounded-full mb-8"></div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
            <AnimatedSection delay={0} className="bg-card p-6 border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-elegant">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Headphones className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">AI-receptionister</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Hanterar bokningar, kalendrar och offertförslag automatiskt
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={100} className="bg-card p-6 border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-elegant">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">AI-chatbots</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Guidar kunder, svarar på frågor och skapar leads
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200} className="bg-card p-6 border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-elegant">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Automatiserade flöden (n8n)</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Kopplar ihop system, minskar manuellt arbete
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={300} className="bg-card p-6 border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-elegant">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Databaser (Supabase)</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Säkra lagringslösningar som gör AI:n smartare
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={400} className="text-center">
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Alla våra system är unika – anpassade efter hur just ditt företag arbetar.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Hur vi använder AI och automatisering Section */}
      <section id="about-ai" className="relative py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-display font-bold text-foreground mb-6">Så fungerar tekniken bakom</h2>
            <div className="w-20 h-1 bg-gradient-gold mx-auto rounded-full mb-8"></div>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Vi använder OpenAI för språkförståelse, n8n för att koppla ihop system och Supabase för datalagring.
              Tillsammans blir det helhetslösningar där AI kan läsa, förstå och agera – utan att någon behöver klicka runt manuellt.
            </p>

            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-semibold"
              onClick={() => document.getElementById('krono-chat')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Läs mer om hur AI fungerar
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* Om oss Section */}
      <section id="about" className="relative py-32 bg-muted/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-5xl font-display font-bold mb-6 text-foreground">Ett ungt team som bygger framtidens system</h2>
            <div className="w-24 h-1.5 bg-gradient-gold mx-auto rounded-full mb-8"></div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Vi startade Hiems för att göra AI tillgängligt, begripligt och användbart för alla företag.
              Vår styrka ligger i att vi både förstår tekniken och kan bygga den i praktiken.
              Vi jobbar nära varje kund och levererar lösningar som gör skillnad direkt i vardagen.
            </p>
          </AnimatedSection>


          {/* Team Section */}
          <AnimatedSection className="mb-12">
            <h3 className="text-3xl font-display font-bold text-center mb-12 text-foreground">Möt teamet</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatedSection delay={0} className="rounded-none bg-card backdrop-blur-sm border border-border p-8 text-center hover:border-accent/50 transition-all duration-300 hover:shadow-elegant">
                <img 
                  src={antonImage} 
                  alt="Anton Sallnäs" 
                  className="w-64 h-64 rounded-full mx-auto mb-6 object-cover border-2 border-accent/30"
                  loading="lazy"
                />
                <h4 className="text-xl font-bold mb-2">Anton Sallnäs</h4>
                <p className="text-lg text-muted-foreground mb-4">CEO</p>
                <p className="text-sm text-muted-foreground mb-1">anton@hiems.se</p>
                <p className="text-sm text-muted-foreground">070-657 15 32</p>
                <p className="text-xs text-muted-foreground/70 italic mt-4">"Jag brinner för att göra AI begripligt"</p>
              </AnimatedSection>
              
              <AnimatedSection delay={100} className="rounded-none bg-card backdrop-blur-sm border border-border p-8 text-center hover:border-accent/50 transition-all duration-300 hover:shadow-elegant">
                <img 
                  src={karloImage} 
                  alt="Karlo Mangione" 
                  className="w-64 h-64 rounded-full mx-auto mb-6 object-cover border-2 border-accent/30"
                  loading="lazy"
                />
                <h4 className="text-xl font-bold mb-2">Karlo Mangione</h4>
                <p className="text-lg text-muted-foreground mb-4">COO</p>
                <p className="text-sm text-muted-foreground mb-1">karlo.mangione@hiems.se</p>
                <p className="text-sm text-muted-foreground">070-231 22 71</p>
                <p className="text-xs text-muted-foreground/70 italic mt-4">"AI ska vara enkelt att använda"</p>
              </AnimatedSection>
              
              <AnimatedSection delay={200} className="rounded-none bg-card backdrop-blur-sm border border-border p-8 text-center hover:border-accent/50 transition-all duration-300 hover:shadow-elegant">
                <img 
                  src={emilImage} 
                  alt="Emil Westerberg" 
                  className="w-64 h-64 rounded-full mx-auto mb-6 object-cover border-2 border-accent/30"
                  loading="lazy"
                />
                <h4 className="text-xl font-bold mb-2">Emil Westerberg</h4>
                <p className="text-lg text-muted-foreground mb-4">CLO</p>
                <p className="text-sm text-muted-foreground mb-1">emil@hiems.se</p>
                <p className="text-sm text-muted-foreground">072-327 34 65</p>
                <p className="text-xs text-muted-foreground/70 italic mt-4">"Teknologi som skapar verkligt värde"</p>
              </AnimatedSection>
              
              <AnimatedSection delay={300} className="rounded-none bg-card backdrop-blur-sm border border-border p-8 text-center hover:border-accent/50 transition-all duration-300 hover:shadow-elegant">
                <div className="w-64 h-64 rounded-full mx-auto mb-6 bg-gradient-primary flex items-center justify-center border-2 border-accent/30">
                  <span className="text-6xl font-bold text-white">ME</span>
                </div>
                <h4 className="text-xl font-bold mb-2">Malte Ekbäck</h4>
                <p className="text-lg text-muted-foreground mb-4">CFO</p>
                <p className="text-sm text-muted-foreground mb-1">malte@hiems.se</p>
                <p className="text-sm text-muted-foreground">073-024 66 28</p>
                <p className="text-xs text-muted-foreground/70 italic mt-4">"Smart tillväxt med AI"</p>
              </AnimatedSection>
            </div>
          </AnimatedSection>

          {/* CTA */}
          <AnimatedSection delay={400} className="text-center mt-16">
            <Button onClick={() => setIsConsultationModalOpen(true)} size="lg" className="bg-gradient-gold text-primary hover:opacity-90 shadow-button font-semibold text-lg px-8 py-6 h-auto">
              Träffa teamet
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* Vår metod Section */}
      <section className="relative py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-foreground mb-6">Från behov till fungerande system</h2>
            <div className="w-20 h-1 bg-gradient-gold mx-auto rounded-full mb-8"></div>
            <p className="text-lg text-muted-foreground">En enkel process – från idé till resultat.</p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <AnimatedSection delay={0} className="relative">
              <div className="bg-card p-8 border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-elegant h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-xl font-bold text-accent">1</span>
                  </div>
                  <h3 className="text-xl font-display font-bold">Analys</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Vi kartlägger er verksamhet
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={100} className="relative">
              <div className="bg-card p-8 border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-elegant h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-xl font-bold text-accent">2</span>
                  </div>
                  <h3 className="text-xl font-display font-bold">Utveckling</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Vi bygger lösningen
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200} className="relative">
              <div className="bg-card p-8 border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-elegant h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-xl font-bold text-accent">3</span>
                  </div>
                  <h3 className="text-xl font-display font-bold">Drift & support</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Vi säkerställer att allt fungerar
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Kontakt Section */}
      <section id="contact" className="relative py-32 bg-gradient-to-b from-primary/10 via-primary/20 to-primary/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection className="mx-auto max-w-3xl text-center">
            <h2 className="text-5xl font-display font-bold text-foreground mb-6">Boka din gratis behovsanalys</h2>
            <div className="w-24 h-1.5 bg-gradient-gold mx-auto rounded-full mb-8"></div>
            <p className="text-lg text-muted-foreground leading-relaxed mb-12">
              Vi visar hur AI och automation kan effektivisera just er verksamhet – utan förpliktelser.
            </p>
            
            <Button 
              onClick={() => setIsConsultationModalOpen(true)} 
              size="lg" 
              className="bg-gradient-gold text-primary hover:shadow-glow hover:scale-105 transition-all duration-300 font-semibold text-lg px-12 py-8 h-auto"
            >
              Boka behovsanalys
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </AnimatedSection>
        </div>
      </section>
      
      <QuoteModal open={isQuoteModalOpen} onOpenChange={setIsQuoteModalOpen} />
      <ConsultationModal open={isConsultationModalOpen} onOpenChange={setIsConsultationModalOpen} />
      <EnterpriseContactModal open={isEnterpriseModalOpen} onOpenChange={setIsEnterpriseModalOpen} productName={selectedEnterpriseProduct} />
    </div>;
};