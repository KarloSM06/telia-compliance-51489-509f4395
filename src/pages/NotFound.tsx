import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header1 } from "@/components/ui/header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header1 />
      <main className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center space-y-6 px-4">
          <h1 className="text-8xl font-bold text-primary">404</h1>
          <h2 className="text-3xl font-semibold">Sidan hittades inte</h2>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Tyvärr kunde vi inte hitta sidan du letar efter.
          </p>
          <Button asChild size="lg" className="bg-gradient-gold text-primary font-bold shadow-button hover:shadow-glow">
            <a href="/">
              <Home className="w-5 h-5 mr-2" />
              Tillbaka till startsidan
            </a>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
