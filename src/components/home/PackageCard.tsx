import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
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

  // Combine all points into a single list
  const allPoints = [...(pkg.description ? [pkg.description] : []), ...pkg.components, ...pkg.valueBullets];
  
  const isPopular = pkg.id === 'growth-sales'; // Mark specific packages as popular
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
    >
      <Card className="flex flex-col lg:flex-row overflow-hidden border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:bg-card/90 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 group rounded-3xl relative">
        {/* Popular Badge */}
        {isPopular && (
          <div className="absolute top-4 right-4 z-10 rounded-3xl bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
            Populärast
          </div>
        )}
        
        {/* Image Section */}
        <div className={`lg:w-2/5 relative overflow-hidden flex-shrink-0 ${isImageLeft ? 'lg:order-1' : 'lg:order-2'}`}>
        {pkg.image ? <>
            <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/20 to-transparent transition-opacity duration-500 group-hover:opacity-70" />
            
            {/* Icon Overlay */}
            
          </> : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <Icon className="h-32 w-32 text-primary/30" />
          </div>}
      </div>
      
      {/* Content Section */}
      <div className={`flex-1 flex flex-col ${isImageLeft ? 'lg:order-2' : 'lg:order-1'}`}>
        <CardContent className="flex-1 p-8 space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <h3 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              {pkg.name}
            </h3>
            <p className="text-lg text-muted-foreground font-light">
              {pkg.targetAudience}
            </p>
          </div>
          
          {/* Features List */}
          <div className="space-y-3">
            {allPoints.map((point, index) => <div key={index} className="flex items-start gap-3 group/item">
                <div className="mt-1 flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-primary group-hover/item:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-base leading-relaxed text-foreground/90">
                  {point}
                </span>
              </div>)}
          </div>

          {/* CTA Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              size="lg" 
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold text-lg shadow-lg hover:shadow-primary/50 transition-all duration-300 rounded-3xl" 
              onClick={onBookDemo}
            >
              Boka kostnadsfri demo
            </Button>
          </motion.div>
        </CardContent>
      </div>
      </Card>
    </motion.div>
  );
};