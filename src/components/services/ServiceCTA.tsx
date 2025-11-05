import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, MessageCircle, Mail } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";

interface ServiceCTAProps {
  title?: string;
  description?: string;
  primaryText?: string;
  primaryAction?: () => void;
  showSecondary?: boolean;
}

export function ServiceCTA({ 
  title = "Redo att komma igång?",
  description = "Boka ett kostnadsfritt möte så berättar vi mer om hur vi kan hjälpa dig.",
  primaryText = "Boka demo",
  primaryAction,
  showSecondary = true
}: ServiceCTAProps) {
  return (
    <AnimatedSection>
      <Card className="relative overflow-hidden p-12 border-primary/20 bg-gradient-to-br from-primary/5 via-card/50 to-accent/5 backdrop-blur-md">
        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.15),transparent_70%)]" />
        
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-gold text-primary hover:shadow-glow transition-all duration-300 font-semibold text-lg px-8"
              onClick={primaryAction}
            >
              <Calendar className="w-5 h-5 mr-2" />
              {primaryText}
            </Button>
            
            {showSecondary && (
              <Button 
                size="lg"
                variant="outline"
                className="border-primary/30 hover:bg-primary/10 transition-all duration-300 font-semibold text-lg px-8"
                onClick={() => window.location.href = 'mailto:contact@hiems.se'}
              >
                <Mail className="w-5 h-5 mr-2" />
                Kontakta oss
              </Button>
            )}
          </div>

          {/* Contact info */}
          <div className="mt-8 pt-8 border-t border-border/30">
            <p className="text-sm text-muted-foreground mb-2">
              Har du frågor? Vi hjälper dig gärna!
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <a href="tel:0706571532" className="hover:text-primary transition-colors">
                📞 070-657 15 32
              </a>
              <a href="mailto:contact@hiems.se" className="hover:text-primary transition-colors">
                📧 contact@hiems.se
              </a>
            </div>
          </div>
        </div>
      </Card>
    </AnimatedSection>
  );
}