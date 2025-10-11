import { Button } from "@/components/ui/button";
import { Snowflake, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);

  const handleAuthClick = () => {
    if (user) {
      signOut();
    } else {
      navigate("/auth");
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Tack för din anmälan!",
      description: "Du kommer snart få vårt nyhetsbrev.",
    });
    setEmail("");
    setIsNewsletterOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <Snowflake className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">Hiems</span>
            </button>
          </div>
          
          {!user && (
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/om-oss" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Om oss
              </a>
              <a href="/regelverk" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Regelverk
              </a>
              <Dialog open={isNewsletterOpen} onOpenChange={setIsNewsletterOpen}>
                <DialogTrigger asChild>
                  <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Nyhetsbrev
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Gå med i Hiems nyhetsbrev – helt gratis!</DialogTitle>
                    <DialogDescription>
                      Få de senaste tipsen, insikterna och verktygen inom AI-driven automation direkt i din inkorg – utan kostnad. Lär dig hur du kan effektivisera ditt företag, spara tid och öka lönsamheten.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newsletter-email">Ange din e-postadress och börja prenumerera helt gratis idag!</Label>
                      <Input
                        id="newsletter-email"
                        type="email"
                        placeholder="E-postadress"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Gå med gratis
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </nav>
          )}
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                  Dashboard
                </Button>
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
                <Button variant="ghost" onClick={handleAuthClick}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logga ut
                </Button>
              </>
            ) : (
              <Button variant="ghost" onClick={handleAuthClick}>
                Logga in
              </Button>
            )}
            <Button variant="default">
              Boka demo
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};