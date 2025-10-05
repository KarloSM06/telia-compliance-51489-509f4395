import { Button } from "@/components/ui/button";
import { PlayCircle, Shield, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { DemoBooking } from "@/components/DemoBooking";
export const Hero = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  return <section className="relative overflow-hidden bg-gradient-hero py-20">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
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
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {user ? <Button variant="hero" size="lg" onClick={() => navigate("/dashboard")}>
                Gå till Dashboard
              </Button> : <DemoBooking>
                <Button variant="hero" size="lg">
                  Kom igång - Boka demo
                </Button>
              </DemoBooking>}
            <div className="flex gap-4">
              <Link to="/demo">
                <Button variant="ghost" size="lg" className="text-white hover:bg-white/10">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Testa demo
                </Button>
              </Link>
              <Link to="/exempelrapport">
                <Button variant="ghost" size="lg" className="text-white hover:bg-white/10">
                  Se exempelrapport
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-blue-200" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">100%</p>
                  <p className="text-sm text-blue-200">AI-driven säljcoach</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-200" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">Öka försäljning</p>
                  <p className="text-sm text-blue-200">Godkända samtal</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <div className="flex items-center">
                <PlayCircle className="h-8 w-8 text-blue-200" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">24/7</p>
                  <p className="text-sm text-blue-200">Övervakning</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};