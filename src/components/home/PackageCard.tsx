import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import type { Package } from "@/data/packages";
interface PackageCardProps {
  package: Package;
  onBookDemo: () => void;
  imagePosition?: 'left' | 'right';
}
export const PackageCard = ({
  package: pkg,
  onBookDemo,
  imagePosition = 'left'
}: PackageCardProps) => {
  const Icon = pkg.icon;
  const isImageLeft = imagePosition === 'left';
  
  return <Card className="h-auto min-h-[550px] flex flex-col lg:flex-row hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/30 overflow-hidden bg-gradient-to-br from-white/5 to-white/10">
      <div className={`lg:w-2/5 relative overflow-hidden bg-muted/20 flex-shrink-0 min-h-[300px] lg:min-h-full ${isImageLeft ? 'lg:order-1' : 'lg:order-2'}`}>
        {pkg.image ? (
          <>
            <img 
              src={pkg.image} 
              alt={pkg.name}
              className="w-full h-full object-cover object-center hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/90 rounded-full mb-4">
                <Icon className="h-5 w-5 text-white" />
                <span className="text-sm font-semibold text-white">{pkg.tagline}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <Icon className="h-32 w-32 text-primary/30" />
          </div>
        )}
      </div>
      
      <div className={`flex-1 flex flex-col ${isImageLeft ? 'lg:order-2' : 'lg:order-1'}`}>
        <CardHeader className="pb-4 pt-8 px-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <CardTitle className="text-3xl lg:text-4xl mb-3 leading-tight tracking-tight">{pkg.name}</CardTitle>
              <p className="text-base text-muted-foreground font-medium">{pkg.targetAudience}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-xl flex-shrink-0">
              <Icon className="h-10 w-10 text-primary" />
            </div>
          </div>
          
          {pkg.description && (
            <p className="text-sm lg:text-base leading-relaxed text-foreground/80 border-l-4 border-primary/30 pl-4 py-2">
              {pkg.description}
            </p>
          )}
        </CardHeader>
        
        <CardContent className="flex-1 px-8 pb-6 space-y-6">{/* Nyckelfunktioner Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Nyckelfunktioner</h4>
              <div className="h-px flex-1 bg-gradient-to-l from-primary/50 to-transparent" />
            </div>
            <div className="grid grid-cols-1 gap-2">
              {pkg.components.map((component, index) => <div key={index} className="group flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/5 hover:border-primary/20">
                  <div className="p-1.5 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm leading-relaxed pt-0.5">{component}</span>
                </div>)}
            </div>
          </div>

          {/* Fördelar Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-accent/50 to-transparent" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-accent">Fördelar för ditt företag</h4>
              <div className="h-px flex-1 bg-gradient-to-l from-accent/50 to-transparent" />
            </div>
            <div className="space-y-3">
              {pkg.valueBullets.map((bullet, index) => <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-accent/5 border border-accent/10">
                  <div className="p-1 rounded-full bg-accent/20">
                    <CheckCircle className="h-5 w-5 text-accent" />
                  </div>
                  <span className="text-sm font-semibold">{bullet}</span>
                </div>)}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="px-8 pb-8 pt-4">
          <div className="w-full space-y-3">
            <Button 
              size="lg" 
              className="w-full text-base font-semibold py-6 bg-gradient-to-r from-primary via-primary to-accent hover:shadow-2xl hover:scale-[1.02] transition-all group" 
              onClick={onBookDemo}
            >
              <span>Boka kostnadsfri demo</span>
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              30 minuter • Ingen bindningstid • Skräddarsydd genomgång
            </p>
          </div>
        </CardFooter>
      </div>
    </Card>;
};