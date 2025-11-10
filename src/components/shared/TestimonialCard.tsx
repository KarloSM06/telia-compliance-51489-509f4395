import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  image?: string;
  className?: string;
}

export const TestimonialCard = ({ 
  quote, 
  author, 
  role, 
  company, 
  image,
  className = "" 
}: TestimonialCardProps) => {
  return (
    <Card className={`border-2 border-white/10 bg-white/5 backdrop-blur-sm rounded-2xl p-8 ${className}`}>
      <CardContent className="space-y-6 p-0">
        <Quote className="w-10 h-10 text-primary/50" />
        <p className="text-xl md:text-2xl text-foreground leading-relaxed">
          {quote}
        </p>
        <div className="flex items-center gap-4">
          {image && (
            <img 
              src={image} 
              alt={author}
              className="w-14 h-14 rounded-full object-cover"
              loading="lazy"
            />
          )}
          <div>
            <p className="font-bold text-foreground">{author}</p>
            <p className="text-sm text-muted-foreground">
              {role} på {company}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
