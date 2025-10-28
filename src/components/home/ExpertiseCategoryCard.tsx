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

  return (
    <Card className="group h-full overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 hover:shadow-2xl">
      <div className={`flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} h-full`}>
        {/* Image Section - 40% */}
        <div className="relative md:w-[40%] aspect-[4/3] md:aspect-auto overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
          {category.image ? (
            <>
              <img 
                src={category.image} 
                alt={category.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-60" />
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <Icon className="h-32 w-32 text-primary/40" />
            </div>
          )}
          
          {/* Icon overlay */}
          <div className={`absolute ${isLeft ? 'right-4' : 'left-4'} top-4 p-3 rounded-lg bg-gradient-to-br ${category.color} opacity-90`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Content Section - 60% */}
        <div className="md:w-[60%] flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl group-hover:text-primary transition-colors duration-300">
              {category.title}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {category.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 space-y-4">
            {/* Tools grid */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">Verktyg & Plattformar:</h4>
              <div className="grid grid-cols-1 gap-3">
                {category.items.map((item, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors duration-200"
                  >
                    {item.logo ? (
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-background rounded">
                        <img 
                          src={item.logo} 
                          alt={item.name}
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                    ) : (
                      <CheckCircle className="flex-shrink-0 h-5 w-5 text-primary" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{item.name}</p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};
