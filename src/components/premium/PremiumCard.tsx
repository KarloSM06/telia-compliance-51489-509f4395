import { cn } from "@/lib/utils";

interface PremiumCardProps {
  children: React.ReactNode;
  hover?: boolean;
  className?: string;
}

export const PremiumCard = ({ children, hover = true, className = "" }: PremiumCardProps) => (
  <div
    className={cn(
      "p-6 border border-primary/10 rounded-lg",
      "bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md",
      hover && "hover:border-primary/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20",
      "transition-all duration-500",
      className
    )}
  >
    {children}
  </div>
);
