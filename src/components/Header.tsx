import { Button } from "@/components/ui/button";
import { Snowflake, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (user) {
      signOut();
    } else {
      navigate("/auth");
    }
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
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Funktioner
            </a>
            {user && (
              <a href="#dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </a>
            )}
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Priser
            </a>
          </nav>
          
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