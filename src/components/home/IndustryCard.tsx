import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Industry } from "@/data/industries";
interface IndustryCardProps {
  industry: Industry;
  onClick: () => void;
}
export const IndustryCard = ({
  industry,
  onClick
}: IndustryCardProps) => {
  const Icon = industry.icon;
  return <Card className="group h-full flex flex-col overflow-hidden cursor-pointer border-2 border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-transform duration-300 hover:shadow-lg hover:shadow-white/10 hover:-translate-y-1 transform-gpu will-change-transform" style={{ contain: 'layout' }} onClick={onClick}>
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
        {industry.image ? <img src={industry.image} alt={industry.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 transform-gpu opacity-80 group-hover:opacity-90" /> : <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
            <Icon className="h-20 w-20 text-white/40 group-hover:text-white/60 transition-colors duration-300" />
          </div>}
        
        {/* Icon Badge */}
        
      </div>
      
      {/* Content Section */}
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-white [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)] group-hover:text-white transition-colors duration-300">
          {industry.name}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 pt-0">
        <CardDescription className="text-sm leading-relaxed text-gray-300 [text-shadow:_0_1px_3px_rgb(0_0_0_/_30%)]">
          {industry.description}
        </CardDescription>
      </CardContent>
    </Card>;
};