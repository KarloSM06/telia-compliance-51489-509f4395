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
  return <Card className="group h-full overflow-hidden border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:bg-card/90 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1">
      <div className={`flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} h-full`}>
        {/* Image Section - 40% */}
        <div className="relative md:w-[40%] aspect-[4/3] md:aspect-auto overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent z-10" />
          {category.image ? <>
              <img src={category.image} alt={category.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-70 z-10" />
            </> : <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/20 to-primary/5">
              <Icon className="h-32 w-32 text-primary/40 group-hover:text-primary/60 transition-colors duration-300" />
            </div>}
          
          {/* Icon overlay in corner */}
          
        </div>

        {/* Content Section - 60% */}
        <div className="md:w-[60%] flex flex-col bg-gradient-to-br from-card/5 to-transparent">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl md:text-3xl font-bold group-hover:text-primary transition-colors duration-300">
              {category.title}
            </CardTitle>
            <CardDescription className="text-base md:text-lg mt-3 leading-relaxed">
              {category.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 space-y-4">
            {/* Tools grid */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-primary mb-4 uppercase tracking-wide">Verktyg & Plattformar</h4>
              <div className="grid grid-cols-1 gap-2">
                {category.items.map((item, idx) => <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-primary/10 border border-border/50 hover:border-primary/30 transition-all duration-300 group/item">
                    {item.logo ? <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-background rounded-lg shadow-sm group-hover/item:shadow-md transition-shadow">
                        <img src={item.logo} alt={item.name} className="w-7 h-7 object-contain group-hover/item:scale-110 transition-transform" />
                      </div> : <CheckCircle className="flex-shrink-0 h-5 w-5 text-primary group-hover/item:scale-110 transition-transform" />}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm group-hover/item:text-primary transition-colors">{item.name}</p>
                      {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                    </div>
                  </div>)}
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>;
};