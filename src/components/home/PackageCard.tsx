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
        
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 px-8 pb-8 pt-4">
          {/* Om paketet */}
          <div className="bg-card/50 border-2 border-primary/20 rounded-xl p-6 space-y-4">
            <h4 className="text-lg font-bold text-primary border-b-2 border-primary/30 pb-3">
              Om paketet
            </h4>
            <div className="space-y-4">
              {pkg.description && (
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-primary" strokeWidth={3} />
                    </div>
                  </div>
                  <p className="text-base leading-relaxed text-foreground font-semibold">
                    {pkg.description}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Funktioner */}
          <div className="bg-card/50 border-2 border-primary/20 rounded-xl p-6 space-y-4">
            <h4 className="text-lg font-bold text-primary border-b-2 border-primary/30 pb-3">
              Funktioner
            </h4>
            <div className="space-y-4">
              {pkg.components.map((component, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-primary" strokeWidth={3} />
                    </div>
                  </div>
                  <p className="text-base leading-relaxed text-foreground font-semibold">
                    {component}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Fördelar */}
          <div className="bg-card/50 border-2 border-accent/20 rounded-xl p-6 space-y-4 flex flex-col">
            <div className="flex-1">
              <h4 className="text-lg font-bold text-accent border-b-2 border-accent/30 pb-3 mb-4">
                Fördelar
              </h4>
              <div className="space-y-4">
                {pkg.valueBullets.map((bullet, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0">
                      <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-accent" strokeWidth={3} />
                      </div>
                    </div>
                    <p className="text-base leading-relaxed text-foreground font-bold">
                      {bullet}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <Button 
              size="lg" 
              className="w-full mt-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold text-base" 
              onClick={onBookDemo}
            >
              Boka kostnadsfri demo
            </Button>
          </div>
        </div>
      </div>
    </Card>;
};