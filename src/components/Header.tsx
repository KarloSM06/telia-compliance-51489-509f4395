import { Button } from "@/components/ui/button";
import { Snowflake } from "lucide-react";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <Snowflake className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">Hiems</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Funktioner
            </a>
            <a href="#dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Priser
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost">
              Logga in
            </Button>
            <Button variant="default">
              Boka demo
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};