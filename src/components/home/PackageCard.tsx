import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "@/data/packages";
import { useState } from "react";

interface PackageCardProps {
  package: Package;
  onDemo: () => void;
  onBuild: () => void;
}

export const PackageCard = ({ package: pkg, onDemo, onBuild }: PackageCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = pkg.icon;

  return (
    <Card 
      className="h-full transition-all duration-300 hover:shadow-elegant hover:scale-[1.02] border-2"
      style={{ borderColor: isHovered ? pkg.color : 'transparent' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div 
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${pkg.color}20` }}
          >
            <Icon className="h-8 w-8" style={{ color: pkg.color }} />
          </div>
        </div>
        <CardTitle className="text-xl">{pkg.name}</CardTitle>
        <CardDescription className="text-sm">{pkg.targetAudience}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground italic">{pkg.tagline}</p>
        
        <div className="space-y-2">
          {pkg.valueBullets.map((bullet, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">{bullet}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 space-y-2">
          <Button 
            onClick={onDemo} 
            className="w-full"
            variant="default"
          >
            Se demo
          </Button>
          <Button 
            onClick={onBuild} 
            className="w-full"
            variant="outline"
          >
            Bygg ditt paket
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
