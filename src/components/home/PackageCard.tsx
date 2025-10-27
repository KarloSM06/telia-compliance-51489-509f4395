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
      
      <div className={`flex-1 flex flex-col ${isImageLeft ? 'lg:order-2' : 'lg:order-1'}`}>
        <div className="border-b border-border/50 px-8 pt-8 pb-4">
          <CardTitle className="text-2xl lg:text-3xl mb-2 leading-tight font-bold">
            {pkg.name}
          </CardTitle>
          <p className="text-sm lg:text-base text-muted-foreground/90 font-medium">
            {pkg.targetAudience}
          </p>
        </div>
        
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 p-8">
          <div className="lg:col-span-1 space-y-4 bg-primary/5 rounded-xl p-6 border-l-4 border-primary">
            <div className="mb-6">
              <h4 className="text-base font-bold uppercase tracking-wider text-primary mb-2">Om paketet</h4>
              <div className="h-1 w-16 bg-primary rounded-full" />
            </div>
            <div className="space-y-3">
              {pkg.description && <div className="flex items-start gap-3 p-3 rounded-lg bg-card/50 hover:bg-card transition-colors group">
                  <div className="mt-1 p-1 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm leading-relaxed text-foreground group-hover:text-foreground transition-colors">
                    {pkg.description}
                  </span>
                </div>}
            </div>
          </div>
          
          <div className="lg:col-span-1 space-y-4 bg-primary/5 rounded-xl p-6 border-l-4 border-primary">
            <div className="mb-6">
              <h4 className="text-base font-bold uppercase tracking-wider text-primary mb-2">Funktioner</h4>
              <div className="h-1 w-16 bg-primary rounded-full" />
            </div>
            <div className="space-y-3">
              {pkg.components.map((component, index) => <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-card/50 hover:bg-card transition-colors group">
                  <div className="mt-1 p-1 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm leading-relaxed text-foreground group-hover:text-foreground transition-colors">
                    {component}
                  </span>
                </div>)}
            </div>
          </div>
          
          <div className="lg:col-span-1 flex flex-col justify-between space-y-4 bg-accent/5 rounded-xl p-6 border-l-4 border-accent">
            <div className="space-y-4">
              <div className="mb-6">
                <h4 className="text-base font-bold uppercase tracking-wider text-accent mb-2">Fördelar</h4>
                <div className="h-1 w-16 bg-accent rounded-full" />
              </div>
              <div className="space-y-3">
                {pkg.valueBullets.map((bullet, index) => <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-card/50 hover:bg-card transition-colors group">
                    <div className="mt-1 p-1 rounded-full bg-accent/20 group-hover:bg-accent/30 transition-colors flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-sm font-medium leading-relaxed text-foreground group-hover:text-foreground transition-colors">
                      {bullet}
                    </span>
                  </div>)}
              </div>
            </div>
            <Button size="lg" className="w-full shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold mt-4" onClick={onBookDemo}>
              Boka kostnadsfri demo
            </Button>
          </div>
        </div>
      </div>
    </Card>;
};