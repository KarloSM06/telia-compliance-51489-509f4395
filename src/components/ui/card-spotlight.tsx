"use client";

import { cn } from "@/lib/utils";

export const CardSpotlight = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "group/spotlight p-10 rounded-2xl border-2 border-white/10 bg-white/5 backdrop-blur-sm text-primary shadow-elegant transition-all duration-300 hover:border-white/20 hover:bg-white/10 relative",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
