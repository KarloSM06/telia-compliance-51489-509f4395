import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpertiseCategory } from "@/data/expertise";
import { CheckCircle } from "lucide-react";
interface ExpertiseCategoryCardProps {
  category: ExpertiseCategory;
  imagePosition?: "left" | "right";
}
export const ExpertiseCategoryCard = ({
  category,
  imagePosition = "left"
}: ExpertiseCategoryCardProps) => {
  const Icon = category.icon;
  const isLeft = imagePosition === "left";
  return <Card className="group h-full overflow-hidden border-2 border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-1">
      <div className={`flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} h-full`}>
        {/* Image Section - 40% */}
        <div className="relative md:w-[40%] aspect-[4/3] md:aspect-auto overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent z-10" />
          {category.image ? <>
              <img src={category.image} alt={category.title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110 opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent z-10" />
            </> : <div className="flex items-center justify-center h-full bg-white/5">
              <Icon className="h-32 w-32 text-white/40 group-hover:text-white/60 transition-colors duration-300" />
            </div>}
          
          {/* Icon overlay in corner */}
          
        </div>

        {/* Content Section - 60% */}
        <div className="md:w-[60%] flex flex-col bg-white/5">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl md:text-3xl font-bold text-white [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)] group-hover:text-white transition-colors duration-300">
              {category.title}
            </CardTitle>
            <CardDescription className="text-base md:text-lg mt-3 leading-relaxed text-gray-300 [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">
              {category.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 space-y-4">
            {/* Tools grid */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">Verktyg & Plattformar</h4>
              <div className="grid grid-cols-1 gap-2">
                {category.items.map((item, idx) => <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 transition-all duration-300 group/item backdrop-blur-sm">
                    {item.logo ? <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white/20 rounded-lg shadow-sm group-hover/item:shadow-md transition-shadow overflow-hidden">
                        <img 
                          src={item.logo} 
                          alt={item.name} 
                          className={`object-contain group-hover/item:scale-110 transition-transform ${
                            item.name === 'Vapi' ? 'w-14 h-14 scale-150' : 'w-7 h-7'
                          }`} 
                        />
                      </div> : <CheckCircle className="flex-shrink-0 h-5 w-5 text-white group-hover/item:scale-110 transition-transform" />}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-white group-hover/item:text-white transition-colors [text-shadow:_0_1px_3px_rgb(0_0_0_/_30%)]">{item.name}</p>
                      {item.description && <p className="text-xs text-gray-300 [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)]">{item.description}</p>}
                    </div>
                  </div>)}
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>;
};