import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Shield, ArrowRight, CheckCircle, Zap, Target, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const ProductSelection = () => {
  const navigate = useNavigate();

  const handleKronoClick = () => {
    window.location.href = "https://chronodesk.se";
  };

  const handleHermesClick = () => {
    navigate("/hermes");
  };

  return (
    <div className="relative overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
              🚀 Skräddarsydd automation för framtidens företag
            </h1>
            <p className="text-lg leading-8 text-blue-100 mb-8">
              Vi bygger intelligenta automationsflöden som gör ditt företag snabbare, smartare och mer lönsamt – utan att du behöver vara en kodexpert.
            </p>
            <p className="text-base leading-7 text-blue-100">
              Med vår AI-teknologi analyserar vi säljsamtal i realtid för att upptäcka regelbrott, ge utvecklingsrekommendationer och säkerställa efterlevnad – allt enligt era egna riktlinjer.
            </p>
            <p className="text-base leading-7 text-blue-100 mt-4">
              Från att identifiera risker i samtal till att skapa automatiserade arbetsflöden som sparar tid och pengar – vi gör det möjligt.
            </p>
          </div>
        </div>
      </section>

      {/* Vad vi gör Section */}
      <section className="relative py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">🎯 Vad vi gör</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <CheckCircle className="h-10 w-10 text-blue-200 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Automatiserade säljsamtalsanalyser</h3>
              <p className="text-blue-100">Upptäck regelbrott och få utvecklingsrekommendationer direkt i realtid.</p>
            </div>
            <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <Zap className="h-10 w-10 text-blue-200 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Skräddarsydda automationsflöden</h3>
              <p className="text-blue-100">Bygg flöden som passar just ditt företags behov – utan att du behöver vara en teknisk expert.</p>
            </div>
            <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <Target className="h-10 w-10 text-blue-200 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">AI-driven insikt och kontroll</h3>
              <p className="text-blue-100">Få insikter som hjälper dig att fatta bättre beslut och hålla koll på verksamheten.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="relative py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Våra produkter</h2>
            <p className="text-lg text-blue-100">Välj den AI-lösning som passar ditt behov</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-5xl mx-auto">
            {/* Krono Card */}
            <Card className="relative overflow-hidden border-2 border-primary/20 bg-card/95 backdrop-blur-sm hover:border-primary/40 transition-all hover:shadow-elegant group">
              <CardHeader>
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 group-hover:scale-110 transition-transform">
                  <Phone className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Krono</CardTitle>
                <CardDescription className="text-lg">
                  AI-driven receptionist som hanterar era samtal 24/7
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Automatisk samtalsmottagning dygnet runt</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Intelligent samtalshantering och routing</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Missa aldrig ett viktigt samtal</span>
                  </li>
                </ul>
                <Button 
                  size="lg" 
                  className="w-full group-hover:shadow-lg transition-shadow"
                  onClick={handleKronoClick}
                >
                  Gå till Krono
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>

            {/* Hermes Card */}
            <Card className="relative overflow-hidden border-2 border-primary/20 bg-card/95 backdrop-blur-sm hover:border-primary/40 transition-all hover:shadow-elegant group">
              <CardHeader>
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Hermes</CardTitle>
                <CardDescription className="text-lg">
                  AI-kvalitetsgranskning av säljsamtal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">100% automatisk compliance-kontroll</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Öka försäljningen med AI-coach</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Spara tid och skydda ert varumärke</span>
                  </li>
                </ul>
                <Button 
                  size="lg" 
                  className="w-full group-hover:shadow-lg transition-shadow"
                  onClick={handleHermesClick}
                >
                  Välj Hermes
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Varför Hiems Section */}
      <section className="relative py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">💡 Varför Hiems?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="rounded-lg bg-white/10 p-8 backdrop-blur-sm">
                <Lightbulb className="h-12 w-12 text-blue-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Enkelhet</h3>
                <p className="text-blue-100">Vi gör komplex automation enkel att använda.</p>
              </div>
            </div>
            <div className="text-center">
              <div className="rounded-lg bg-white/10 p-8 backdrop-blur-sm">
                <Target className="h-12 w-12 text-blue-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Anpassningsbarhet</h3>
                <p className="text-blue-100">Skräddarsy flöden som passar just din verksamhet.</p>
              </div>
            </div>
            <div className="text-center">
              <div className="rounded-lg bg-white/10 p-8 backdrop-blur-sm">
                <Zap className="h-12 w-12 text-blue-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Effektivitet</h3>
                <p className="text-blue-100">Spara tid och resurser genom att automatisera repetitiva uppgifter.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testa själv Section */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white mb-6">🧪 Testa själv</h2>
            <p className="text-lg text-blue-100 mb-8">
              Vill du se hur det fungerar? Prova vår demo och upplev hur vår AI analyserar säljsamtal i realtid.
            </p>
            <Link to="/demo">
              <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                Prova demon nu
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
