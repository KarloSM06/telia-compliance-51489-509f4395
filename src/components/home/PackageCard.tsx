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
  return <Card className="h-full flex flex-col lg:flex-row hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-2 hover:border-primary/20 overflow-hidden bg-white/5 backdrop-blur-sm border-white/10">
      {pkg.image && (
        <div className="lg:w-1/2 h-64 lg:h-auto relative overflow-hidden">
          <img 
            src={pkg.image} 
            alt={pkg.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex-1 flex flex-col">
        <CardHeader>
          <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
            <Icon className="h-14 w-14 text-primary" />
          </div>
          <CardTitle className="text-2xl mb-2 text-white">{pkg.name}</CardTitle>
          <CardDescription className="text-base text-white/70">{pkg.targetAudience}</CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1">
          <div className="space-y-3 mb-6">
            {pkg.valueBullets.map((bullet, index) => <div key={index} className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/80">{bullet}</span>
              </div>)}
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full bg-gradient-gold text-primary hover:shadow-glow" onClick={onBookDemo}>
            Boka demo
          </Button>
        </CardFooter>
      </div>
    </Card>;
};