import { ReactNode } from "react";
import hiemsLogo from "@/assets/hiems-logo-snowflake.png";

interface PremiumHeroProps {
  title: string;
  subtitle: string;
  icon?: ReactNode;
}

export const PremiumHero = ({ title, subtitle, icon }: PremiumHeroProps) => {
  return (
    <div className="relative pt-12 pb-12 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
      {/* Radial gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.1),transparent_50%)]" />
      
      {/* Snowflake backgrounds */}
      <div className="absolute -top-20 -right-20 w-[400px] h-[400px] opacity-5 pointer-events-none">
        <img 
          src={hiemsLogo} 
          alt="" 
          className="w-full h-full object-contain animate-[spin_60s_linear_infinite]"
        />
      </div>
      
      <div className="absolute -top-10 -left-10 w-[250px] h-[250px] opacity-[0.03] pointer-events-none">
        <img 
          src={hiemsLogo} 
          alt="" 
          className="w-full h-full object-contain animate-[spin_40s_linear_infinite_reverse]"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center gap-6">
          {icon && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-2">
              {title}
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-secondary to-secondary/50 rounded-full mb-4" />
            <p className="text-lg text-muted-foreground">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
