import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import type { Package } from "@/data/packages";
import { useState, useEffect, useRef } from "react";

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
  const [isZoomed, setIsZoomed] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const Icon = pkg.icon;
  const isImageLeft = imagePosition === 'left';

  useEffect(() => {
    if (isHovering) {
      timeoutRef.current = setTimeout(() => {
        setIsZoomed(true);
      }, 500);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsZoomed(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isHovering]);
  // Combine all points into a single list
  const allPoints = [
    ...(pkg.description ? [pkg.description] : []),
    ...pkg.components,
    ...pkg.valueBullets
  ];

  return (
    <Card 
      className={`flex flex-col lg:flex-row hover:shadow-lg border overflow-hidden bg-card transition-all duration-500 ${
        isZoomed ? 'scale-110 shadow-2xl z-50 relative' : 'scale-100'
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className={`lg:w-2/5 relative overflow-hidden flex-shrink-0 ${isImageLeft ? 'lg:order-1' : 'lg:order-2'}`}>
        {pkg.image ? (
          <img 
            src={pkg.image} 
            alt={pkg.name} 
            className="w-full h-full object-cover object-center" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Icon className="h-32 w-32 text-muted-foreground/30" />
          </div>
        )}
      </div>
      
      <div className={`flex-1 flex flex-col ${isImageLeft ? 'lg:order-2' : 'lg:order-1'}`}>
        <div className="border-b px-8 pt-8 pb-6">
          <CardTitle className="text-2xl lg:text-3xl mb-3 font-bold">
            {pkg.name}
          </CardTitle>
          <p className="text-base text-muted-foreground">
            {pkg.targetAudience}
          </p>
        </div>
        
        <div className="flex-1 px-8 py-6 overflow-y-auto">
          <div className="space-y-4">
            {allPoints.map((point, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="mt-0.5 flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-yellow-500" />
                </div>
                <span className="text-base leading-relaxed text-foreground">
                  {point}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-8 pb-8">
          <Button 
            size="lg" 
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold text-base"
            onClick={onBookDemo}
          >
            Boka kostnadsfri demo
          </Button>
        </div>
      </div>
    </Card>
  );
};