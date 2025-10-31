import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AnalyticsLayoutProps {
  children: ReactNode;
  onExport?: () => void;
  onRefresh?: () => void;
}

export const AnalyticsLayout = ({ children, onExport, onRefresh }: AnalyticsLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Premium Header with Hero Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/85">
        {/* Animated background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(67,97,238,0.15),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(250,204,21,0.1),transparent_50%)]" />
        
        {/* Glass morphism overlay */}
        <div className="absolute inset-0 backdrop-blur-[100px]" />
        
        {/* Content */}
        <div className="relative z-10 px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {/* Title Section */}
              <div className="space-y-3">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-secondary via-secondary/90 to-secondary/70 bg-clip-text text-transparent tracking-tight">
                  Analytics Dashboard
                </h1>
                <p className="text-lg text-primary-foreground/80 max-w-2xl">
                  Realtidsövervakning av dina affärsresultat och ROI-utveckling
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {onRefresh && (
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={onRefresh}
                    className={cn(
                      "bg-white/10 border-white/20 text-white hover:bg-white/20",
                      "backdrop-blur-sm transition-all duration-500",
                      "hover:scale-105 hover:shadow-glow"
                    )}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Uppdatera
                  </Button>
                )}
                {onExport && (
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={onExport}
                    className={cn(
                      "bg-white/10 border-white/20 text-white hover:bg-white/20",
                      "backdrop-blur-sm transition-all duration-500",
                      "hover:scale-105 hover:shadow-glow"
                    )}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="lg"
                  asChild
                  className={cn(
                    "bg-secondary/20 border-secondary/40 text-white hover:bg-secondary/30",
                    "backdrop-blur-sm transition-all duration-500",
                    "hover:scale-105 hover:shadow-button"
                  )}
                >
                  <Link to="/dashboard/settings?tab=roi">
                    <Settings className="h-4 w-4 mr-2" />
                    Inställningar
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative -mt-8">
        {children}
      </div>
    </div>
  );
};
