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
  return <Card className="h-[500px] flex flex-col lg:flex-row hover:shadow-2xl transition-all duration-500 border hover:border-primary/40 overflow-hidden bg-gradient-to-br from-card/95 to-card backdrop-blur-sm">
      <div className={`lg:w-2/5 relative overflow-hidden flex-shrink-0 ${isImageLeft ? 'lg:order-1' : 'lg:order-2'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        {pkg.image ? <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700" /> : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10">
            <Icon className="h-32 w-32 text-primary/40" />
          </div>}
      </div>
      
      <div className={`flex-1 flex flex-row items-center ${isImageLeft ? 'lg:order-2' : 'lg:order-1'}`}>
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 p-8 lg:p-10">
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              
            </div>
            <div>
              <CardTitle className="text-2xl lg:text-3xl mb-3 leading-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent font-bold">
                {pkg.name}
              </CardTitle>
              <p className="text-sm lg:text-base text-muted-foreground/90 font-medium mb-3">
                {pkg.targetAudience}
              </p>
            </div>
            {pkg.description && <div className="pt-3 border-t border-border/50">
                <p className="text-xs lg:text-sm leading-relaxed text-muted-foreground line-clamp-4">
                  {pkg.description}
                </p>
              </div>}
          </div>
          
          <div className="lg:col-span-1 space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary/80">Funktioner</h4>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            </div>
            <div className="space-y-2.5">
              {pkg.components.map((component, index) => <div key={index} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-primary/5 transition-colors group">
                  <div className="mt-0.5 p-0.5 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <CheckCircle className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-xs lg:text-sm leading-snug text-foreground/80 group-hover:text-foreground transition-colors">
                    {component}
                  </span>
                </div>)}
            </div>
          </div>
          
          <div className="lg:col-span-1 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-accent/80">Fördelar</h4>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
              </div>
              <div className="space-y-2.5">
                {pkg.valueBullets.map((bullet, index) => <div key={index} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-accent/5 transition-colors group">
                    <div className="mt-0.5 p-0.5 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
                      <CheckCircle className="h-3.5 w-3.5 text-accent" />
                    </div>
                    <span className="text-xs lg:text-sm font-medium leading-snug text-foreground/80 group-hover:text-foreground transition-colors">
                      {bullet}
                    </span>
                  </div>)}
              </div>
            </div>
            <Button size="lg" className="w-full shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 bg-gradient-to-r from-primary via-primary to-accent hover:from-primary/90 hover:via-primary/90 hover:to-accent/90 font-semibold" onClick={onBookDemo}>
              Boka kostnadsfri demo
            </Button>
          </div>
        </div>
      </div>
    </Card>;
};