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
  return <Card className="h-full flex flex-col hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-2 hover:border-primary/20">
      <CardHeader>
        <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
          <Icon className="h-14 w-14 text-primary" />
        </div>
        <CardTitle className="text-2xl mb-2">{pkg.name}</CardTitle>
        <CardDescription className="text-base">{pkg.targetAudience}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1">
        <div className="space-y-3 mb-6">
          {pkg.valueBullets.map((bullet, index) => <div key={index} className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">{bullet}</span>
            </div>)}
        </div>
        
        
      </CardContent>
      
      <CardFooter className="flex flex-col gap-2">
        <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg" onClick={onBookDemo}>
          Boka demo
        </Button>
      </CardFooter>
    </Card>;
};