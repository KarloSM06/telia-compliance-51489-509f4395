import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export const FeatureCard = ({ icon: Icon, title, description, className = "" }: FeatureCardProps) => {
  return (
    <Card className={`border-2 border-white/10 bg-white/5 backdrop-blur-sm rounded-2xl hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105 ${className}`}>
      <CardHeader>
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};
