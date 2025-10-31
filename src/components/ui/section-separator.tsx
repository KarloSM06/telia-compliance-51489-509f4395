import { cn } from "@/lib/utils";

interface SectionSeparatorProps {
  className?: string;
  text?: string;
}

export function SectionSeparator({ className, text }: SectionSeparatorProps) {
  if (text) {
    return (
      <div className={cn("relative py-4", className)}>
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {text}
          </span>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn("h-px bg-gradient-to-r from-transparent via-border to-transparent my-6", className)} />
  );
}