import { ReactNode } from "react";

interface PremiumHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export const PremiumHeader = ({ title, subtitle, actions }: PremiumHeaderProps) => (
  <div className="mb-8">
    <div className="flex items-start justify-between">
      <div className="inline-block">
        <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
          {title}
        </h1>
        <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent rounded-full shadow-lg shadow-primary/50" />
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
    {subtitle && (
      <p className="text-xl text-muted-foreground mt-6 font-light">
        {subtitle}
      </p>
    )}
  </div>
);
