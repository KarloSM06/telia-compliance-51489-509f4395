import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Shield, ArrowRight, CheckCircle, Zap, Target, Lightbulb, Sparkles } from "lucide-react";
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
              <span className="text-sm font-medium text-white">AI-driven automation för moderna företag</span>
            </div>
            
            <h1 className="text-5xl font-display font-bold tracking-tight text-white sm:text-7xl mb-8 leading-tight">
              Skräddarsydda AI-lösningar för{" "}
              <span className="bg-gradient-gold bg-clip-text text-transparent">
                framtidens företag
              </span>
            </h1>
            
            <p className="text-xl leading-relaxed mb-6 font-light text-white/90">Vi bygger skräddarsydda intelligenta lösningar som gör ditt företag snabbare, smartare och framförallt mer lönsamt</p>
            <p className="text-lg leading-relaxed text-white/80 max-w-3xl mx-auto">   realtid för att upptäcka regelbrott, ge utvecklingsrekommendationer och säkerställa efterlevnad – allt enligt era egna riktlinjer.</p>
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
              <h3 className="text-xl font-display font-bold text-white mb-3">Automatiserade säljsamtalsanalyser</h3>
              <p className="text-white/70 leading-relaxed">Upptäck regelbrott och få utvecklingsrekommendationer direkt i realtid.</p>
            </div>
            <div className="group relative rounded-2xl bg-white/5 p-8 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-300 hover:shadow-glow animate-fade-in delay-100">
              <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity"></div>
              <Zap className="h-12 w-12 text-accent mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-display font-bold text-white mb-3">Skräddarsydda automationsflöden</h3>
              <p className="text-white/70 leading-relaxed">Bygg flöden som passar just ditt företags behov – utan att du behöver vara en teknisk expert.</p>
            </div>
            <div className="group relative rounded-2xl bg-white/5 p-8 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-300 hover:shadow-glow animate-fade-in delay-200">
              <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity"></div>
              <Target className="h-12 w-12 text-accent mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-display font-bold text-white mb-3">AI-driven insikt och kontroll</h3>
              <p className="text-white/70 leading-relaxed">Få insikter som hjälper dig att fatta bättre beslut och hålla koll på verksamheten.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-display font-bold text-white mb-4">Köp rgedan ida
          </h2>
            <div className="w-20 h-1 bg-gradient-gold mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-white/80">Våra färdiga AI-verktyg skräddarsys och levereras på högst två veckor – så ni snabbt kan börja effektivisera och växa er verksamhet. </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-6xl mx-auto">
            {/* Krono Card */}
            <Card className="group relative overflow-hidden border-2 border-white/10 bg-gradient-card backdrop-blur-sm hover:border-accent/50 transition-all duration-500 hover:shadow-glow animate-scale-in">
              <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <CardHeader className="relative">
                <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/5 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Phone className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-3xl font-display mb-2">Krono</CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  AI-driven receptionist som hanterar era samtal 24/7
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-foreground/80 leading-relaxed">Automatisk samtalsmottagning dygnet runt</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-foreground/80 leading-relaxed">Intelligent samtalshantering och routing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-foreground/80 leading-relaxed">Missa aldrig ett viktigt samtal</span>
                  </li>
                </ul>
                <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-button group-hover:shadow-glow transition-all duration-300 font-semibold text-base h-14" onClick={handleKronoClick}>
                  Gå till Krono
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>

            {/* Hermes Card */}
            <Card className="group relative overflow-hidden border-2 border-accent/30 bg-gradient-card backdrop-blur-sm hover:border-accent transition-all duration-500 hover:shadow-glow animate-scale-in delay-200">
              <div className="absolute inset-0 bg-gradient-gold opacity-5 group-hover:opacity-20 transition-opacity duration-500"></div>
              <div className="absolute top-4 right-4 px-3 py-1 bg-accent/20 rounded-full border border-accent/50">
                <span className="text-xs font-semibold text-accent">POPULÄR</span>
              </div>
              <CardHeader className="relative">
                <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-accent/10 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Shield className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="text-3xl font-display mb-2">Hermes</CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  AI-kvalitetsgranskning av säljsamtal
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-foreground/80 leading-relaxed">100% automatisk compliance-kontroll</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-foreground/80 leading-relaxed">Öka försäljningen med AI-coach</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-foreground/80 leading-relaxed">Spara tid och skydda ert varumärke</span>
                  </li>
                </ul>
                <Button size="lg" className="w-full bg-gradient-gold text-accent-foreground hover:opacity-90 shadow-button group-hover:shadow-glow transition-all duration-300 font-semibold text-base h-14" onClick={handleHermesClick}>
                  Välj Hermes
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
                    <Lightbulb className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-3">Enkelhet</h3>
                  <p className="text-white/70 leading-relaxed">Vi gör komplex automation enkel att använda.</p>
                </div>
              </div>
            </div>
            <div className="group text-center animate-fade-in delay-100">
              <div className="relative rounded-2xl bg-white/5 p-10 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6 group-hover:scale-110 transition-transform">
                    <Target className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-3">Anpassningsbarhet</h3>
                  <p className="text-white/70 leading-relaxed">Skräddarsy flöden som passar just din verksamhet.</p>
                </div>
              </div>
            </div>
            <div className="group text-center animate-fade-in delay-200">
              <div className="relative rounded-2xl bg-white/5 p-10 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6 group-hover:scale-110 transition-transform">
                    <Zap className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-3">Effektivitet</h3>
                  <p className="text-white/70 leading-relaxed">Spara tid och resurser genom att automatisera repetitiva uppgifter.</p>
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
            <div className="relative rounded-3xl bg-gradient-primary p-12 md:p-16 overflow-hidden shadow-elegant">
              <div className="absolute inset-0 bg-gradient-gold opacity-10"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
              <div className="relative text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 mb-6 backdrop-blur-sm border border-white/20">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-white">Kostnadsfri demonstration</span>
                </div>
                <h2 className="text-4xl font-display font-bold text-white mb-6">Testa själv</h2>
                <p className="text-xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto">
                  Vill du se hur det fungerar? Prova vår demo och upplev hur vår AI analyserar säljsamtal i realtid.
                </p>
                <Link to="/demo">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-button hover:shadow-glow transition-all duration-300 font-semibold text-base px-10 h-14 group">
                    Prova demon nu
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>;
};