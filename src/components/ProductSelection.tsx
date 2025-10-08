import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Shield, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ProductSelection = () => {
  const navigate = useNavigate();

  const handleKronoClick = () => {
    window.location.href = "https://chronodesk.se";
  };

  const handleHermesClick = () => {
    navigate("/hermes");
  };

  return (
    <section className="relative overflow-hidden bg-gradient-hero py-20">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
            Välkommen till Hiems
          </h1>
          <p className="text-lg leading-8 text-blue-100">
            Välj den AI-lösning som passar ditt behov
          </p>
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
  );
};
