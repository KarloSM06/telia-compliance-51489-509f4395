import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PremiumHeaderProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
  actions?: ReactNode;
}

export function PremiumHeader({ 
  icon, 
  title, 
  subtitle, 
  className,
  actions 
}: PremiumHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 animate-fade-in", className)}>
      <div className="flex items-center gap-4">
        {icon && (
          <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl animate-scale-in">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2 animate-slide-in-right">
          {actions}
        </div>
      )}
    </div>
  );
}