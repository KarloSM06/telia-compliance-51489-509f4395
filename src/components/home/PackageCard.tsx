import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import type { Package } from "@/data/packages";
interface PackageCardProps {
  package: Package;
  onBookDemo: () => void;
}
export const PackageCard = ({
  package: pkg,
  onBookDemo
}: PackageCardProps) => {
  const Icon = pkg.icon;
  return <Card className="h-full flex flex-col lg:flex-row hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/30 overflow-hidden bg-gradient-to-br from-white/5 to-white/10">
      {pkg.image && (
        <div className="lg:w-1/3 relative overflow-hidden min-h-[300px] lg:min-h-[400px]">
          <img 
            src={pkg.image} 
            alt={pkg.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent lg:block hidden" />
        </div>
      )}
      
      <div className="flex-1 flex flex-row items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 p-8 lg:p-10">
          <div className="lg:col-span-1">
            <div className="mb-4 p-3 bg-primary/10 rounded-xl w-fit">
              <Icon className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl lg:text-4xl mb-3 leading-tight">{pkg.name}</CardTitle>
            <p className="text-base lg:text-lg text-muted-foreground mb-3">{pkg.targetAudience}</p>
            {pkg.description && (
              <p className="text-sm lg:text-base leading-relaxed text-foreground/80">
                {pkg.description}
              </p>
            )}
          </div>
          
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold mb-4">Nyckelfunktioner</h4>
            <div className="space-y-3">
              {pkg.components.map((component, index) => <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm lg:text-base">{component}</span>
                </div>)}
            </div>
          </div>
          
          <div className="lg:col-span-1 flex flex-col justify-between">
            <div>
              <h4 className="text-lg font-semibold mb-4">Fördelar</h4>
              <div className="space-y-3 mb-6">
                {pkg.valueBullets.map((bullet, index) => <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-sm lg:text-base font-medium">{bullet}</span>
                  </div>)}
              </div>
            </div>
            <Button size="lg" className="w-full text-base py-6 bg-gradient-to-r from-primary to-primary/80 hover:shadow-2xl hover:scale-105 transition-all" onClick={onBookDemo}>
              Boka demo
            </Button>
          </div>
        </div>
      </div>
        
        
    </Card>;
};