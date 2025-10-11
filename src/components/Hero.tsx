import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, TrendingUp, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { DemoBooking } from "@/components/DemoBooking";
import { QuoteModal } from "@/components/QuoteModal";
import { useState } from "react";

export const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  return (
    <div className="relative overflow-hidden">
      <section className="relative min-h-[600px] bg-gradient-to-br from-primary via-primary/90 to-primary/80 py-24">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Öka försäljningen och säkerställ att varje{" "}
              <span className="bg-gradient-to-r from-blue-200 to-blue-100 bg-clip-text text-transparent">
                säljsamtal
              </span>{" "}
              följer riktlinjerna
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              AI-baserad kvalitetsgranskning – inga regelbrott, inga risker. 
              Automatisk analys av säljsamtal enligt era företagsriktlinjer.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Button 
                size="lg" 
                variant="default"
                onClick={() => setShowQuoteModal(true)}
              >
                Få offert
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              {user ? (
                <Button size="lg" variant="outline" onClick={() => navigate('/dashboard')}>
                  Gå till Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <DemoBooking>
                  <Button size="lg" variant="outline">
                    Boka demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </DemoBooking>
              )}
              <Button variant="outline" size="lg" onClick={() => navigate('/demo')}>
                Testa demo
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/example-report')}>
                Se exempelrapport
              </Button>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="flex items-center p-6">
                  <Shield className="h-8 w-8 text-blue-200" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-white">100%</p>
                    <p className="text-sm text-blue-200">AI-driven säljcoach</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="flex items-center p-6">
                  <TrendingUp className="h-8 w-8 text-blue-200" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-white">Öka försäljning</p>
                    <p className="text-sm text-blue-200">Godkända samtal</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="flex items-center p-6">
                  <CheckCircle className="h-8 w-8 text-blue-200" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-white">24/7</p>
                    <p className="text-sm text-blue-200">Övervakning</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      <QuoteModal open={showQuoteModal} onOpenChange={setShowQuoteModal} />
    </div>
  );
};
