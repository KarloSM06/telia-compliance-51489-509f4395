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
  return <div className="relative overflow-hidden bg-gradient-hero">
      
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
      <section className="relative py-24 bg-gradient-to-b from-primary/10 via-primary/20 to-primary/10 animate-fade-in">
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

      {/* Om oss Section */}
      <section id="about" className="relative py-32 bg-primary/20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection className="mx-auto max-w-3xl text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 mb-6 backdrop-blur-sm border border-accent/20">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-white">Om oss – Hiems</span>
            </div>
            <h2 className="text-5xl font-display font-bold mb-6 text-white">Vi är unga, drivna och brinner för AI</h2>
            <div className="w-24 h-1.5 bg-gradient-gold mx-auto rounded-full mb-8"></div>
            <p className="text-lg text-white/90 leading-relaxed">
              Hiems grundades av ett team som ser möjligheterna med AI och vill göra tekniken tillgänglig för alla företag, inte bara stora aktörer. Vi kombinerar ung drivkraft, nyfikenhet och teknisk expertis med förståelse för bygg- och VVS-verksamheter. Vårt mål är enkelt: skapa lösningar som sparar tid, minskar dubbelarbete och gör vardagen enklare.
            </p>
          </AnimatedSection>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            <AnimatedSection delay={0} className="group text-center">
              <div className="relative rounded-2xl bg-card p-8 border border-border hover:border-accent/50 transition-all duration-300 h-full hover:shadow-elegant">
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Zap className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-display font-bold mb-3">Tillgänglig AI för alla</h3>
                  <p className="text-muted-foreground leading-relaxed">Vi tror på tillgänglig AI som alla kan använda, oavsett företagsstorlek eller teknisk expertis.</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={100} className="group text-center">
              <div className="relative rounded-2xl bg-card p-8 border border-border hover:border-accent/50 transition-all duration-300 h-full hover:shadow-elegant">
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Wrench className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-display font-bold mb-3">Hands-on & kreativa</h3>
                  <p className="text-muted-foreground leading-relaxed">Vi är hands-on och kreativa, och bygger lösningar som faktiskt fungerar i verkligheten.</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200} className="group text-center">
              <div className="relative rounded-2xl bg-card p-8 border border-border hover:border-accent/50 transition-all duration-300 h-full hover:shadow-elegant">
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Users className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-display font-bold mb-3">Personliga relationer</h3>
                  <p className="text-muted-foreground leading-relaxed">Vi värdesätter personliga relationer med våra kunder och ser er framgång som vår framgång.</p>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Team Section */}
          <AnimatedSection className="mb-12">
            <h3 className="text-3xl font-display font-bold text-center mb-12">Möt teamet</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatedSection delay={0} className="rounded-2xl bg-card backdrop-blur-sm border border-border p-8 text-center hover:border-accent/50 transition-all duration-300 hover:shadow-elegant">
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
              
              <AnimatedSection delay={100} className="rounded-2xl bg-card backdrop-blur-sm border border-border p-8 text-center hover:border-accent/50 transition-all duration-300 hover:shadow-elegant">
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
              
              <AnimatedSection delay={200} className="rounded-2xl bg-card backdrop-blur-sm border border-border p-8 text-center hover:border-accent/50 transition-all duration-300 hover:shadow-elegant">
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
              
              <AnimatedSection delay={300} className="rounded-2xl bg-card backdrop-blur-sm border border-border p-8 text-center hover:border-accent/50 transition-all duration-300 hover:shadow-elegant">
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
            <Button onClick={() => setIsConsultationModalOpen(true)} size="lg" className="bg-gradient-gold text-accent-foreground hover:opacity-90 shadow-button font-semibold text-lg px-8 py-6 h-auto">
              Boka behovsanalys
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* Varför Hiems Section */}
      <section className="relative py-24 bg-primary/20 animate-fade-in">
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
          {/* Krono Chat Center */}
          <AnimatedSection className="max-w-4xl mx-auto">
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