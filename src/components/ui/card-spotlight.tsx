"use client";

import { cn } from "@/lib/utils";
import { LiquidGlass } from "./liquid-glass";

export const CardSpotlight = ({
  children,
  className,
  onClick,
  ...props
}: {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <LiquidGlass
      variant="card"
      intensity="strong"
      rippleEffect={true}
      flowOnHover={true}
      onClick={onClick}
      className={cn(
        "group/spotlight p-10 text-primary shadow-elegant relative",
        className
      )}
    >
      <div {...props}>
        {children}
      </div>
    </LiquidGlass>
  );
};
