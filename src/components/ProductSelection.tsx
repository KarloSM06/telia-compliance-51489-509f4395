import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRight, CheckCircle, Zap, Target, Sparkles, ChefHat, Headphones, UserCheck, TrendingUp, MessageSquare, ShoppingCart, Award, Send, Loader2, Phone, BarChart3, Users, Clock, Star } from "lucide-react";
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
  return <div className="relative overflow-hidden bg-gradient-hero">
      
      {/* Quick Navigation */}
      <QuickNavigation />
      
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 lg:py-40">
        {/* Hero Background Image with Overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <img src={heroBackground} alt="Hiems tekniker installerar värmesystem" className="w-full h-full object-cover" />
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
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 mb-8 backdrop-blur-sm border border-accent/20 hover:bg-accent/20 transition-all duration-300">
              <Sparkles className="h-4 w-4 text-accent animate-pulse" />
              <span className="text-sm font-medium text-white">AI-driven automation för företag</span>
            </div>
            
            <h1 className="text-5xl font-display font-bold tracking-tight text-white sm:text-6xl lg:text-7xl mb-8 leading-tight">
              Skräddarsydda AI-lösningar för{" "}
              <span className="bg-gradient-gold bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                framtidens företag
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl leading-relaxed mb-12 font-light text-white/90 max-w-3xl mx-auto">
              Vi bygger skräddarsydda intelligenta lösningar som gör ditt företag snabbare, smartare och framförallt mer lönsamt
            </p>
            <p className="text-lg leading-relaxed text-white/80 max-w-3xl mx-auto">   Med Hiems får ni inte bara tillgång till marknadens främsta AI-lösningar. Ni får en trogen partner som ser till att eran verksamhet alltid befinner sig i framkant </p>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-gradient-gold text-primary hover:shadow-glow hover:scale-105 transition-all duration-300 font-semibold text-lg px-10 py-7" onClick={() => setIsConsultationModalOpen(true)}>
                Boka konsultation
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white bg-white/10 hover:bg-white hover:text-primary hover:scale-105 transition-all duration-300 font-semibold text-lg px-10 py-7 backdrop-blur-sm" onClick={() => document.getElementById('krono-chat')?.scrollIntoView({
              behavior: 'smooth'
            })}>
                Prata med Krono
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Section */}
      

      {/* Vad vi gör Section */}
      <section className="relative py-24 bg-gradient-to-b from-background to-primary/20 animate-fade-in">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-white mb-4">Vad vi gör</h2>
            <div className="w-20 h-1 bg-gradient-gold mx-auto rounded-full"></div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <AnimatedSection delay={0} className="group relative rounded-2xl bg-white/5 p-8 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-300 hover:shadow-glow">
              <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity"></div>
              <CheckCircle className="h-12 w-12 text-accent mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
              <h3 className="text-xl font-display font-bold text-white mb-3">Analys av era behov och mål</h3>
              <p className="text-white/70 leading-relaxed">Vi analyserar er verksamhet för att förstå era mål, processer och tillväxtpotential. Genom datadriven insikt identifierar vi hur AI kan effektivisera arbetet och öka intäkterna.</p>
            </AnimatedSection>
            <AnimatedSection delay={100} className="group relative rounded-2xl bg-white/5 p-8 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-300 hover:shadow-glow">
              <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity"></div>
              <Zap className="h-12 w-12 text-accent mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
              <h3 className="text-xl font-display font-bold text-white mb-3">Skräddarsydda verktyg</h3>
              <p className="text-white/70 leading-relaxed">Utifrån analysen utvecklar vi skräddarsydda AI-verktyg anpassade till era behov. De integreras sömlöst i befintliga system och optimerar era flöden – för både effektivitet och lönsamhet.</p>
            </AnimatedSection>
            <AnimatedSection delay={200} className="group relative rounded-2xl bg-white/5 p-8 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-300 hover:shadow-glow">
              <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity"></div>
              <Target className="h-12 w-12 text-accent mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
              <h3 className="text-xl font-display font-bold text-white mb-3">Lösningar i praktiken</h3>
              <p className="text-white/70 leading-relaxed">När lösningarna tas i bruk märks effekten direkt: snabbare processer, smartare beslut och ökade intäkter. Vi följer upp och vidareutvecklar så att era AI-verktyg fortsätter skapa värde över tid.</p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="relative py-32 bg-primary/10" style={{ backgroundImage: 'url(/images/tools-background.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/40 to-primary"></div>
        <div className="mx-auto max-w-[1800px] px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-4xl text-center mb-12 animate-fade-in bg-primary/30 backdrop-blur-sm rounded-2xl p-8 border border-primary/30">
            <h2 className="text-5xl font-display font-bold text-white mb-6 drop-shadow-lg">Är ni endast i behov av ett visst verktyg?</h2>
            <div className="w-24 h-1.5 bg-gradient-gold mx-auto rounded-full mb-8"></div>
            <p className="text-lg text-white mb-8 drop-shadow-md">Kolla in våra färdiga paket. Vi har utvecklat dessa för att göra processen så snabb och smidig som möjligt.</p>
            <Button 
              onClick={() => setShowPackages(!showPackages)} 
              size="lg" 
              variant="outline" 
              className="border-2 border-white/20 text-white bg-white/5 hover:bg-white/10 hover:scale-105 transition-all duration-300 font-semibold"
            >
              {showPackages ? 'Dölj paket' : 'Se mer'}
              <ArrowRight className={`ml-2 h-5 w-5 transition-transform duration-300 ${showPackages ? 'rotate-90' : ''}`} />
            </Button>
          </div>

          {showPackages && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6 max-w-[1800px] mx-auto animate-fade-in animate-scale-in">
            {/* AI Receptionist - Krono */}
            <AnimatedSection delay={0}>
            <Card className="group relative overflow-hidden border-2 border-white/10 bg-gradient-card backdrop-blur-sm hover:border-accent/50 hover:scale-[1.02] transition-all duration-500 hover:shadow-glow h-full flex flex-col">
              <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <CardHeader className="relative p-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Headphones className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-xl font-display mb-2">AI Receptionist</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Missa aldrig ett samtal eller en affär. AI-receptionisten hanterar samtal, SMS och mejl dygnet runt – bokar, avbokar och kvalificerar kunder automatiskt. Perfekt för serviceföretag, kliniker och byråer som vill frigöra tid utan att tappa kundkontakt.</CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-4 p-6 pt-0 flex-1 flex flex-col">
                <ul className="space-y-3 mb-6 flex-1">
                  {packageDetails.krono.features.slice(0, 3).map((feature, idx) => <li key={idx} className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                        <CheckCircle className="h-3 w-3 text-accent" />
                      </div>
                      <span className="text-foreground/80 leading-relaxed text-sm">{feature}</span>
                    </li>)}
                </ul>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-button group-hover:shadow-glow transition-all duration-300 font-semibold text-sm h-12 mt-auto" onClick={() => handlePackageClick('krono')}>
                      Läs mer
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-3xl font-display mb-4">{packageDetails.krono.title}</DialogTitle>
                      <DialogDescription className="text-base leading-relaxed">
                        {packageDetails.krono.fullDescription}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-6">
                      <div className="mb-6">
                        <label className="text-sm font-medium mb-2 block">Välj antal minuter:</label>
                        <div className="flex items-center gap-4 mb-4">
                          <Slider value={[minuteOptions.indexOf(selectedMinutes)]} onValueChange={value => setSelectedMinutes(minuteOptions[value[0]])} max={minuteOptions.length - 1} step={1} className="flex-1" />
                          <span className="font-semibold min-w-[80px]">{selectedMinutes} min</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Överanvändning: 5 kr/min | SMS: 3 kr/st</p>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <Card className="border-2 hover:border-accent/50 transition-colors h-full flex flex-col">
                          <CardHeader>
                            <CardTitle className="text-xl">Pro</CardTitle>
                            <div className="text-3xl font-bold">{minutePricing[selectedMinutes].pro} kr<span className="text-sm font-normal">/mån</span></div>
                          </CardHeader>
                          <CardContent className="flex-1 flex flex-col">
                            <ul className="space-y-2 mb-4 text-sm flex-1">
                              {packageDetails.krono.pricing?.pro.features.map((f, i) => <li key={i} className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                                  <span>{f}</span>
                                </li>)}
                            </ul>
                            <Button onClick={() => handleCheckout('krono', 'pro')} className="w-full mt-auto" disabled={isCheckingOut}>
                              Välj Pro
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="border-2 border-accent/50 relative h-full flex flex-col">
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
                            POPULÄR
                          </div>
                          <CardHeader>
                            <CardTitle className="text-xl">Business</CardTitle>
                            <div className="text-3xl font-bold">{minutePricing[selectedMinutes].business} kr<span className="text-sm font-normal">/mån</span></div>
                          </CardHeader>
                          <CardContent className="flex-1 flex flex-col">
                            <ul className="space-y-2 mb-4 text-sm flex-1">
                              {packageDetails.krono.pricing?.business.features.map((f, i) => <li key={i} className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                                  <span>{f}</span>
                                </li>)}
                            </ul>
                            <Button onClick={() => handleCheckout('krono', 'business')} className="w-full bg-gradient-gold text-primary hover:shadow-glow hover:scale-105 transition-all duration-300 mt-auto" disabled={isCheckingOut}>
                              Välj Business
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="border-2 hover:border-accent/50 transition-colors h-full flex flex-col">
                          <CardHeader>
                            <CardTitle className="text-xl">Enterprise</CardTitle>
                            <div className="text-3xl font-bold">{minutePricing[selectedMinutes].enterprise}</div>
                          </CardHeader>
                          <CardContent className="flex-1 flex flex-col">
                            <ul className="space-y-2 mb-4 text-sm flex-1">
                              {packageDetails.krono.pricing?.enterprise.features.map((f, i) => <li key={i} className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                                  <span>{f}</span>
                                </li>)}
                            </ul>
                            <Button onClick={() => handleCheckout('krono', 'enterprise')} variant="outline" className="w-full mt-auto" disabled={isCheckingOut}>
                              Kontakta oss
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
            </AnimatedSection>

            {/* AI Restaurang - Gastro */}
            <AnimatedSection delay={100}>
            <Card className="group relative overflow-hidden border-2 border-white/10 bg-gradient-card backdrop-blur-sm hover:border-accent/50 hover:scale-[1.02] transition-all duration-500 hover:shadow-glow h-full flex flex-col">
              <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <CardHeader className="relative p-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <ChefHat className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-xl font-display mb-2">Restaurang & Café</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Missa aldrig en bokning eller beställning – även under rusningstid. AI hanterar bokningar, menyfrågor och kundfeedback via telefon och SMS. För restauranger, caféer och hotell som vill ge snabb service utan stress.</CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-4 p-6 pt-0 flex-1 flex flex-col">
                <ul className="space-y-3 mb-6 flex-1">
                  {packageDetails.gastro.features.map((feature, idx) => <li key={idx} className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                        <CheckCircle className="h-3 w-3 text-accent" />
                      </div>
                      <span className="text-foreground/80 leading-relaxed text-sm">{feature}</span>
                    </li>)}
                </ul>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-button group-hover:shadow-glow transition-all duration-300 font-semibold text-sm h-12 mt-auto" onClick={() => handlePackageClick('gastro')}>
                      Läs mer
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-3xl font-display mb-4">{packageDetails.gastro.title}</DialogTitle>
                      <DialogDescription className="text-base leading-relaxed">
                        {packageDetails.gastro.fullDescription}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-6">
                      <div className="mb-6">
                        <label className="text-sm font-medium mb-2 block">Välj antal minuter:</label>
                        <div className="flex items-center gap-4 mb-4">
                          <Slider value={[minuteOptions.indexOf(selectedMinutes)]} onValueChange={value => setSelectedMinutes(minuteOptions[value[0]])} max={minuteOptions.length - 1} step={1} className="flex-1" />
                          <span className="font-semibold min-w-[80px]">{selectedMinutes} min</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Överanvändning: 5 kr/min | SMS: 3 kr/st</p>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        {['pro', 'business', 'enterprise'].map(tier => <Card key={tier} className={`border-2 ${tier === 'business' ? 'border-accent/50 relative' : 'hover:border-accent/50'} transition-colors`}>
                            {tier === 'business' && <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">POPULÄR</div>}
                            <CardHeader>
                              <CardTitle className="text-xl capitalize">{tier}</CardTitle>
                              <div className="text-3xl font-bold">
                                {tier === 'enterprise' ? minutePricing[selectedMinutes].enterprise : `${minutePricing[selectedMinutes][tier as 'pro' | 'business']} kr`}
                                {tier !== 'enterprise' && <span className="text-sm font-normal">/mån</span>}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2 mb-4 text-sm">
                                {packageDetails.gastro.pricing?.[tier as 'pro' | 'business' | 'enterprise'].features.map((f, i) => <li key={i} className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                                    <span>{f}</span>
                                  </li>)}
                              </ul>
                              <Button onClick={() => handleCheckout('gastro', tier as 'pro' | 'business' | 'enterprise')} className={`w-full ${tier === 'business' ? 'bg-accent hover:bg-accent/90' : ''}`} variant={tier === 'enterprise' ? 'outline' : 'default'} disabled={isCheckingOut}>
                                {tier === 'enterprise' ? 'Kontakta oss' : `Välj ${tier}`}
                              </Button>
                            </CardContent>
                          </Card>)}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
            </AnimatedSection>

            {/* AI Rekrytering - Talent */}
            <AnimatedSection delay={200}>
            <Card className="group relative overflow-hidden border-2 border-white/10 bg-gradient-card backdrop-blur-sm hover:border-accent/50 hover:scale-[1.02] transition-all duration-500 hover:shadow-glow h-full flex flex-col">
              <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <CardHeader className="relative p-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <UserCheck className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-xl font-display mb-2">AI Rekrytering</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Hitta rätt kandidater snabbare. AI screenar ansökningar, rankar kandidater och hittar nya via LinkedIn – helt automatiskt. För HR-avdelningar och rekryteringsbyråer som vill effektivisera sin rekrytering.</CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-4 p-6 pt-0 flex-1 flex flex-col">
                <ul className="space-y-3 mb-6 flex-1">
                  {packageDetails.talent.features.map((feature, idx) => <li key={idx} className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                        <CheckCircle className="h-3 w-3 text-accent" />
                      </div>
                      <span className="text-foreground/80 leading-relaxed text-sm">{feature}</span>
                    </li>)}
                </ul>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-button group-hover:shadow-glow transition-all duration-300 font-semibold text-sm h-12 mt-auto" onClick={() => handlePackageClick('talent')}>
                      Läs mer
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-3xl font-display mb-4">{packageDetails.talent.title}</DialogTitle>
                      <DialogDescription className="text-base leading-relaxed">
                        {packageDetails.talent.fullDescription}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-6">
                      <div className="grid md:grid-cols-3 gap-4">
                        {['pro', 'business', 'enterprise'].map(tier => <Card key={tier} className={`border-2 ${tier === 'business' ? 'border-accent/50 relative' : 'hover:border-accent/50'} transition-colors`}>
                            {tier === 'business' && <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">POPULÄR</div>}
                            <CardHeader>
                              <CardTitle className="text-xl capitalize">{tier}</CardTitle>
                              <div className="text-3xl font-bold">
                                {packageDetails.talent.pricing?.[tier as 'pro' | 'business' | 'enterprise'].price}
                                {tier !== 'enterprise' && <span className="text-sm font-normal"> kr/mån</span>}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2 mb-4 text-sm">
                                {packageDetails.talent.pricing?.[tier as 'pro' | 'business' | 'enterprise'].features.map((f, i) => <li key={i} className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                                    <span>{f}</span>
                                  </li>)}
                              </ul>
                              <Button onClick={() => handleCheckout('talent', tier as 'pro' | 'business' | 'enterprise')} className={`w-full ${tier === 'business' ? 'bg-accent hover:bg-accent/90' : ''}`} variant={tier === 'enterprise' ? 'outline' : 'default'} disabled={isCheckingOut}>
                                {tier === 'enterprise' ? 'Kontakta oss' : `Välj ${tier}`}
                              </Button>
                            </CardContent>
                          </Card>)}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
            </AnimatedSection>

            {/* AI Prospektering - Lead */}
            <AnimatedSection delay={300}>
            <Card className="group relative overflow-hidden border-2 border-white/10 bg-gradient-card backdrop-blur-sm hover:border-accent/50 hover:scale-[1.02] transition-all duration-500 hover:shadow-glow h-full flex flex-col">
              <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <CardHeader className="relative p-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <TrendingUp className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-xl font-display mb-2">AI Prospektering</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Fyll din säljpipeline automatiskt. AI hittar, kontaktar och följer upp leads med personliga mejl och meddelanden. För B2B-företag och säljteam som vill växa utan manuell prospektering.</CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-4 p-6 pt-0 flex-1 flex flex-col">
                <ul className="space-y-3 mb-6 flex-1">
                  {packageDetails.lead.features.map((feature, idx) => <li key={idx} className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                        <CheckCircle className="h-3 w-3 text-accent" />
                      </div>
                      <span className="text-foreground/80 leading-relaxed text-sm">{feature}</span>
                    </li>)}
                </ul>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-button group-hover:shadow-glow transition-all duration-300 font-semibold text-sm h-12 mt-auto" onClick={() => handlePackageClick('lead')}>
                      Läs mer
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-3xl font-display mb-4">{packageDetails.lead.title}</DialogTitle>
                      <DialogDescription className="text-base leading-relaxed">
                        {packageDetails.lead.fullDescription}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-6">
                      <div className="grid md:grid-cols-3 gap-4">
                        {['pro', 'business', 'enterprise'].map(tier => <Card key={tier} className={`border-2 ${tier === 'business' ? 'border-accent/50 relative' : 'hover:border-accent/50'} transition-colors`}>
                            {tier === 'business' && <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">POPULÄR</div>}
                            <CardHeader>
                              <CardTitle className="text-xl capitalize">{tier}</CardTitle>
                              <div className="text-3xl font-bold">
                                {packageDetails.lead.pricing?.[tier as 'pro' | 'business' | 'enterprise'].price}
                                {tier !== 'enterprise' && <span className="text-sm font-normal"> kr/mån</span>}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2 mb-4 text-sm">
                                {packageDetails.lead.pricing?.[tier as 'pro' | 'business' | 'enterprise'].features.map((f, i) => <li key={i} className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                                    <span>{f}</span>
                                  </li>)}
                              </ul>
                              <Button onClick={() => handleCheckout('lead', tier as 'pro' | 'business' | 'enterprise')} className={`w-full ${tier === 'business' ? 'bg-accent hover:bg-accent/90' : ''}`} variant={tier === 'enterprise' ? 'outline' : 'default'} disabled={isCheckingOut}>
                                {tier === 'enterprise' ? 'Kontakta oss' : `Välj ${tier}`}
                              </Button>
                            </CardContent>
                          </Card>)}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
            </AnimatedSection>

            {/* AI Compliance - Thor */}
            <AnimatedSection delay={400}>
            <Card className="group relative overflow-hidden border-2 border-accent/30 bg-gradient-card backdrop-blur-sm hover:border-accent hover:scale-[1.02] transition-all duration-500 hover:shadow-glow h-full flex flex-col">
              <div className="absolute inset-0 bg-gradient-gold opacity-5 group-hover:opacity-20 transition-opacity duration-500"></div>
              <div className="absolute top-4 right-4 px-3 py-1 bg-accent/20 rounded-full border border-accent/50">
                <span className="text-xs font-semibold text-accent">POPULÄR</span>
              </div>
              <CardHeader className="relative p-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <MessageSquare className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-xl font-display mb-2">AI Compliance & Coaching</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Säkerställ kvalitet i varje samtal. AI analyserar säljsamtal, ger feedback och coachar säljare i realtid. För säljteam och kundservice som vill förbättra prestation och kundupplevelse.</CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-4 p-6 pt-0 flex-1 flex flex-col">
                <ul className="space-y-3 mb-6 flex-1">
                  {packageDetails.thor.features.map((feature, idx) => <li key={idx} className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                        <CheckCircle className="h-3 w-3 text-accent" />
                      </div>
                      <span className="text-foreground/80 leading-relaxed text-sm">{feature}</span>
                    </li>)}
                </ul>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full bg-gradient-gold text-accent-foreground hover:opacity-90 shadow-button group-hover:shadow-glow transition-all duration-300 font-semibold text-sm h-12 mt-auto" onClick={() => handlePackageClick('thor')}>
                      Läs mer
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-3xl font-display mb-4">{packageDetails.thor.title}</DialogTitle>
                      <DialogDescription className="text-base leading-relaxed">
                        {packageDetails.thor.fullDescription}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-6">
                      <div className="grid md:grid-cols-3 gap-4">
                        {['pro', 'business', 'enterprise'].map(tier => <Card key={tier} className={`border-2 ${tier === 'business' ? 'border-accent/50 relative' : 'hover:border-accent/50'} transition-colors`}>
                            {tier === 'business' && <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">POPULÄR</div>}
                            <CardHeader>
                              <CardTitle className="text-xl capitalize">{tier}</CardTitle>
                              <div className="text-3xl font-bold">
                                {packageDetails.thor.pricing?.[tier as 'pro' | 'business' | 'enterprise'].price}
                                {tier !== 'enterprise' && <span className="text-sm font-normal"> kr/mån</span>}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2 mb-4 text-sm">
                                {packageDetails.thor.pricing?.[tier as 'pro' | 'business' | 'enterprise'].features.map((f, i) => <li key={i} className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                                    <span>{f}</span>
                                  </li>)}
                              </ul>
                              <Button onClick={() => handleCheckout('thor', tier as 'pro' | 'business' | 'enterprise')} className={`w-full ${tier === 'business' ? 'bg-accent hover:bg-accent/90' : ''}`} variant={tier === 'enterprise' ? 'outline' : 'default'} disabled={isCheckingOut}>
                                {tier === 'enterprise' ? 'Kontakta oss' : `Välj ${tier}`}
                              </Button>
                            </CardContent>
                          </Card>)}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
            </AnimatedSection>

            {/* AI Omdömeshantering - Eko */}
            <AnimatedSection delay={500}>
            <Card className="group relative overflow-hidden border-2 border-white/10 bg-gradient-card backdrop-blur-sm hover:border-accent/50 hover:scale-[1.02] transition-all duration-500 hover:shadow-glow h-full flex flex-col">
              <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <CardHeader className="relative p-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Star className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-xl font-display mb-2">AI Omdömen</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Förvandla kundfeedback till konkurrensfördelar. AI samlar, analyserar och svarar på omdömen från alla plattformar – så ni kan fokusera på att förbättra er verksamhet baserat på data.</CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-4 p-6 pt-0 flex-1 flex flex-col">
                <ul className="space-y-3 mb-6 flex-1">
                  {packageDetails.eko.features.map((feature, idx) => <li key={idx} className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                        <CheckCircle className="h-3 w-3 text-accent" />
                      </div>
                      <span className="text-foreground/80 leading-relaxed text-sm">{feature}</span>
                    </li>)}
                </ul>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-button group-hover:shadow-glow transition-all duration-300 font-semibold text-sm h-12 mt-auto" onClick={() => handlePackageClick('eko')}>
                      Läs mer
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-3xl font-display mb-4">{packageDetails.eko.title}</DialogTitle>
                      <DialogDescription className="text-base leading-relaxed">
                        {packageDetails.eko.fullDescription}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-6">
                      <div className="grid md:grid-cols-3 gap-4">
                        {['pro', 'business', 'enterprise'].map(tier => <Card key={tier} className={`border-2 ${tier === 'business' ? 'border-accent/50 relative' : 'hover:border-accent/50'} transition-colors`}>
                            {tier === 'business' && <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">POPULÄR</div>}
                            <CardHeader>
                              <CardTitle className="text-xl capitalize">{tier}</CardTitle>
                              <div className="text-3xl font-bold">
                                {packageDetails.eko.pricing?.[tier as 'pro' | 'business' | 'enterprise'].price}
                                {tier !== 'enterprise' && <span className="text-sm font-normal"> kr/mån</span>}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2 mb-4 text-sm">
                                {packageDetails.eko.pricing?.[tier as 'pro' | 'business' | 'enterprise'].features.map((f, i) => <li key={i} className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                                    <span>{f}</span>
                                  </li>)}
                              </ul>
                              <Button onClick={() => handleCheckout('eko', tier as 'pro' | 'business' | 'enterprise')} className={`w-full ${tier === 'business' ? 'bg-accent hover:bg-accent/90' : ''}`} variant={tier === 'enterprise' ? 'outline' : 'default'} disabled={isCheckingOut}>
                                {tier === 'enterprise' ? 'Kontakta oss' : `Välj ${tier}`}
                              </Button>
                            </CardContent>
                          </Card>)}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
            </AnimatedSection>
          </div>
          )}
        </div>
      </section>

      {/* Varför Hiems Section */}
      <section className="relative py-24 bg-gradient-to-b from-primary/20 to-background animate-fade-in">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-white mb-4">Varför Hiems?</h2>
            <div className="w-20 h-1 bg-gradient-gold mx-auto rounded-full"></div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <AnimatedSection delay={0} className="group text-center">
              <div className="relative rounded-2xl bg-white/5 p-10 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-300 h-full">
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Target className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-3">Skräddarsydd AI</h3>
                  <p className="text-white/70 leading-relaxed">Vi skapar AI-lösningar helt anpassade efter er verksamhet och era mål – inget standardpaket, allt designat för maximal effekt.</p>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={100} className="group text-center">
              <div className="relative rounded-2xl bg-white/5 p-10 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-300 h-full">
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <CheckCircle className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-3">Ni ser bara resultaten</h3>
                  <p className="text-white/70 leading-relaxed">Vi tar hand om allt – från utveckling till implementation. Ni behöver inte lyfta ett finger, utan får direkt värde och mätbara resultat.</p>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={200} className="group text-center">
              <div className="relative rounded-2xl bg-white/5 p-10 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Award className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-3">Hiems som partner</h3>
                  <p className="text-white/70 leading-relaxed"> Med Hiems får ni inte bara AI – ni får en pålitlig partner som skapar kontinuerlig tillväxt och långsiktigt värde.</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testa själv Section */}
      <section id="krono-chat" className="relative py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection className="mx-auto max-w-4xl">
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
                  Prata med vår AI-rådgivare Krono eller prova vårt demo för att se hur en AI-receptionist fungerar
                </p>
              </div>

              {/* Chat Area */}
              <div className="relative bg-white/5 backdrop-blur-sm">
                <ScrollArea className="h-[400px] p-6" ref={scrollRef}>
                  <div className="space-y-4">
                    {messages.map((msg, idx) => <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${msg.role === 'user' ? 'bg-white text-primary' : 'bg-white/10 text-white backdrop-blur-sm border border-white/20'}`}>
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>)}
                    {isLoading && <div className="flex justify-start">
                        <div className="bg-white/10 rounded-2xl px-4 py-2.5 backdrop-blur-sm border border-white/20">
                          <Loader2 className="h-4 w-4 animate-spin text-white" />
                        </div>
                      </div>}
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-6 border-t border-white/10">
                  <div className="flex gap-3">
                    <Input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyPress} placeholder="Skriv ditt meddelande till Krono..." disabled={isLoading} className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/15" />
                    <Button onClick={handleSend} disabled={!input.trim() || isLoading} size="icon" className="bg-white text-primary hover:bg-white/90 h-10 w-10">
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
                          <Input placeholder="070-123 45 67" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} onKeyDown={e => {
                          if (e.key === 'Enter') {
                            handlePhoneSubmit();
                          }
                        }} className="text-base" />
                          <Button onClick={handlePhoneSubmit} className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                            Ring mig
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
      
      <QuoteModal open={isQuoteModalOpen} onOpenChange={setIsQuoteModalOpen} />
      <ConsultationModal open={isConsultationModalOpen} onOpenChange={setIsConsultationModalOpen} />
      <EnterpriseContactModal open={isEnterpriseModalOpen} onOpenChange={setIsEnterpriseModalOpen} productName={selectedEnterpriseProduct} />
    </div>;
};