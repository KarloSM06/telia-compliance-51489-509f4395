import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import type { Package } from "@/data/packages";
interface PackageCardSimplifiedProps {
  package: Package;
  onViewDetails: () => void;
  onBookDemo: () => void;
  imagePosition?: 'left' | 'right';
}
export const PackageCardSimplified = ({
  package: pkg,
  onViewDetails,
  onBookDemo,
  imagePosition = 'left'
}: PackageCardSimplifiedProps) => {
  const Icon = pkg.icon;
  const isLeft = imagePosition === 'left';

  // Combine all features into one list
  const allFeatures = [...(pkg.components || []), ...(pkg.valueBullets || [])];
  return <Card className={`group overflow-hidden border border-primary/20 bg-gradient-to-br from-card/20 via-card/10 to-card/5 backdrop-blur-xl hover:backdrop-blur-2xl hover:bg-card/30 hover:border-primary/40 transition-all duration-700 hover:shadow-[0_20px_70px_-15px] hover:shadow-primary/30 transform-gpu`}>
      <CardContent className="p-0">
        <div className={`flex flex-col ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-0`}>
          {/* Bild/Ikon sektion */}
          <div className="relative lg:w-1/3 aspect-[4/3] lg:aspect-auto overflow-hidden bg-gradient-to-br from-primary/10 via-primary/15 to-primary/5 backdrop-blur-sm">
            {pkg.image ? <img src={pkg.image} alt={pkg.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 transform-gpu opacity-80 group-hover:opacity-100" /> : <div className="absolute inset-0 flex items-center justify-center">
                <Icon className="h-32 w-32 text-primary/30 group-hover:text-primary/50 transition-colors duration-500" />
              </div>}
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-background/10 to-transparent" />
          </div>

          {/* Content sektion */}
          <div className="flex-1 p-8 lg:p-10 flex flex-col bg-gradient-to-br from-background/5 to-transparent">
            <div className="flex items-start gap-4 mb-4">
              
              <div className="flex-1">
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-2">
                  {pkg.name}
                </h3>
                <p className="text-sm text-muted-foreground font-medium">
                  {pkg.targetAudience}
                </p>
              </div>
            </div>

            {pkg.tagline && <p className="text-lg text-foreground/80 mb-6 font-light">
                {pkg.tagline}
              </p>}

            {/* Simplified features - just show 3-4 key ones */}
            <ul className="space-y-2 mb-6 flex-1">
              {allFeatures.slice(0, 4).map((feature, idx) => <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>)}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={onViewDetails} variant="outline" className="flex-1 group/btn border-primary/20 hover:border-primary/40 hover:bg-primary/5">
                Läs mer
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
              <Button onClick={onBookDemo} className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-primary/50 transition-all duration-300">
                Boka demo
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
};