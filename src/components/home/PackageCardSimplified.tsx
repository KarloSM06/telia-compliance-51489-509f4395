import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import type { Package } from "@/data/packages";
interface PackageCardSimplifiedProps {
  package: Package;
  onViewDetails: () => void;
  onBookDemo: () => void;
  imagePosition?: 'left' | 'right';
  stickyTop?: number;
}
export const PackageCardSimplified = ({
  package: pkg,
  onViewDetails,
  onBookDemo,
  imagePosition = 'left',
  stickyTop
}: PackageCardSimplifiedProps) => {
  const Icon = pkg.icon;
  const isLeft = imagePosition === 'left';

  // Combine all features into one list
  const allFeatures = [...(pkg.components || []), ...(pkg.valueBullets || [])];
  return <Card 
    className={`group overflow-hidden border-2 border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-1 transform-gpu ${stickyTop !== undefined ? 'sticky' : ''}`}
    style={stickyTop !== undefined ? { top: `${stickyTop}px` } : undefined}
  >
      <CardContent className="p-0">
        <div className={`flex flex-col ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-0`}>
          {/* Bild/Ikon sektion */}
          <div className="relative lg:w-1/3 aspect-[4/3] lg:aspect-auto overflow-hidden bg-white/5">
            {pkg.image ? <img src={pkg.image} alt={pkg.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 transform-gpu opacity-80 group-hover:opacity-90" /> : <div className="absolute inset-0 flex items-center justify-center">
                <Icon className="h-32 w-32 text-white/40 group-hover:text-white/60 transition-colors duration-500" />
              </div>}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          </div>

          {/* Content sektion */}
          <div className="flex-1 p-8 lg:p-10 flex flex-col">
            <div className="flex items-start gap-4 mb-4">
              
              <div className="flex-1">
                <h3 className="text-2xl lg:text-3xl font-bold text-white [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)] group-hover:text-white transition-colors duration-300 mb-2">
                  {pkg.name}
                </h3>
                <p className="text-sm text-gray-300 font-medium [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">
                  {pkg.targetAudience}
                </p>
              </div>
            </div>

            {pkg.tagline && <p className="text-lg text-gray-300 mb-6 font-light [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">
                {pkg.tagline}
              </p>}

            {/* Simplified features - just show 3-4 key ones */}
            <ul className="space-y-2 mb-6 flex-1">
              {allFeatures.slice(0, 4).map((feature, idx) => <li key={idx} className="flex items-start gap-2 text-sm text-gray-300 [text-shadow:_0_1px_3px_rgb(0_0_0_/_30%)]">
                  <CheckCircle className="h-4 w-4 text-white flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>)}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={onViewDetails} variant="outline" className="flex-1 group/btn bg-white/10 border-2 border-white/20 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-sm">
                Läs mer
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
              <Button onClick={onBookDemo} className="flex-1 bg-white text-black hover:bg-gray-100 shadow-lg hover:shadow-white/30 transition-all duration-300 font-medium">
                Boka demo
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
};