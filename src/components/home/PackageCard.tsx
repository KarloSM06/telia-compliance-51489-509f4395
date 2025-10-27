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
        <div className="lg:w-2/5 relative overflow-hidden min-h-[400px] lg:min-h-[600px]">
          <img 
            src={pkg.image} 
            alt={pkg.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent lg:block hidden" />
        </div>
      )}
      
      <div className="flex-1 flex flex-col">
        <CardHeader className="p-12 lg:p-16">
          <div className="mb-8 p-6 bg-primary/10 rounded-xl w-fit">
            <Icon className="h-24 w-24 text-primary" />
          </div>
          <CardTitle className="text-5xl lg:text-6xl mb-6 leading-tight">{pkg.name}</CardTitle>
          <p className="text-xl lg:text-2xl text-muted-foreground mb-6">{pkg.targetAudience}</p>
          {pkg.description && (
            <p className="text-base lg:text-lg leading-relaxed text-foreground/80 mb-8">
              {pkg.description}
            </p>
          )}
        </CardHeader>
        
        <CardContent className="flex-1 p-12 lg:p-16 pt-0 space-y-8">
          <div>
            <h4 className="text-2xl font-semibold mb-6">Nyckelfunktioner</h4>
            <div className="space-y-4">
              {pkg.components.map((component, index) => <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <span className="text-base lg:text-lg">{component}</span>
                </div>)}
            </div>
          </div>
          
          <div>
            <h4 className="text-2xl font-semibold mb-6">Fördelar</h4>
            <div className="space-y-4">
              {pkg.valueBullets.map((bullet, index) => <div key={index} className="flex items-start gap-4">
                  <CheckCircle className="h-7 w-7 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-lg lg:text-xl font-medium">{bullet}</span>
                </div>)}
            </div>
          </div>
        
        
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4 p-12 lg:p-16 pt-0">
          <Button size="lg" className="w-full text-xl py-8 bg-gradient-to-r from-primary to-primary/80 hover:shadow-2xl hover:scale-105 transition-all" onClick={onBookDemo}>
            Boka demo och diskutera er lösning
          </Button>
        </CardFooter>
      </div>
    </Card>;
};