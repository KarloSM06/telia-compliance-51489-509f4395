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
  
  return <Card className="h-[500px] flex flex-col lg:flex-row hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/30 overflow-hidden bg-gradient-to-br from-white/5 to-white/10">
      <div className={`lg:w-2/5 relative overflow-hidden bg-muted/20 flex-shrink-0 ${isImageLeft ? 'lg:order-1' : 'lg:order-2'}`}>
        {pkg.image ? (
          <img 
            src={pkg.image} 
            alt={pkg.name}
            className="w-full h-full object-cover object-center hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <Icon className="h-32 w-32 text-primary/30" />
          </div>
        )}
      </div>
      
      <div className={`flex-1 flex flex-row items-center ${isImageLeft ? 'lg:order-2' : 'lg:order-1'}`}>
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 p-6 lg:p-8">
          <div className="lg:col-span-1">
            <div className="mb-3 p-2 bg-primary/10 rounded-lg w-fit">
              <Icon className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl lg:text-3xl mb-2 leading-tight">{pkg.name}</CardTitle>
            <p className="text-sm lg:text-base text-muted-foreground mb-2">{pkg.targetAudience}</p>
            {pkg.description && (
              <p className="text-xs lg:text-sm leading-relaxed text-foreground/70 line-clamp-4">
                {pkg.description}
              </p>
            )}
          </div>
          
          <div className="lg:col-span-1">
            <h4 className="text-base font-semibold mb-3">Nyckelfunktioner</h4>
            <div className="space-y-2">
              {pkg.components.map((component, index) => <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-xs lg:text-sm leading-snug">{component}</span>
                </div>)}
            </div>
          </div>
          
          <div className="lg:col-span-1 flex flex-col justify-between">
            <div>
              <h4 className="text-base font-semibold mb-3">Fördelar</h4>
              <div className="space-y-2 mb-4">
                {pkg.valueBullets.map((bullet, index) => <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-xs lg:text-sm font-medium leading-snug">{bullet}</span>
                  </div>)}
              </div>
            </div>
            <Button size="default" className="w-full text-sm py-5 bg-gradient-to-r from-primary to-primary/80 hover:shadow-xl hover:scale-105 transition-all" onClick={onBookDemo}>
              Boka demo
            </Button>
          </div>
        </div>
      </div>
    </Card>;
};