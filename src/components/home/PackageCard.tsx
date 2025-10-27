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
  return <Card className="h-full flex flex-col lg:flex-row hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-2 hover:border-primary/20 overflow-hidden">
      {pkg.image && (
        <div className="lg:w-1/2 relative overflow-hidden">
          <img 
            src={pkg.image} 
            alt={pkg.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      
      <div className="flex-1 flex flex-col">
        <CardHeader className="p-8">
          <div className="mb-6 p-4 bg-primary/10 rounded-lg w-fit">
            <Icon className="h-20 w-20 text-primary" />
          </div>
          <CardTitle className="text-4xl mb-4">{pkg.name}</CardTitle>
          <CardDescription className="text-lg">{pkg.targetAudience}</CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 p-8 pt-0">
        <div className="space-y-4 mb-8">
          {pkg.valueBullets.map((bullet, index) => <div key={index} className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-base">{bullet}</span>
            </div>)}
        </div>
        
        
        </CardContent>
        
        <CardFooter className="flex flex-col gap-2 p-8 pt-0">
          <Button size="lg" className="w-full bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg" onClick={onBookDemo}>
            Boka demo
          </Button>
        </CardFooter>
      </div>
    </Card>;
};