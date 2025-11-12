"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div
          className={cn(
            `
            [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
            [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-400)_15%,var(--blue-400)_20%,var(--violet-300)_25%,var(--blue-500)_30%)]
            [background-image:var(--white-gradient),var(--aurora)]
            [background-size:600%,_500%]
            [background-position:50%_50%,50%_50%]
            md:blur-[5px]
            after:content-[""] after:fixed after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] 
            after:[background-size:400%,_300%] 
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-overlay
            pointer-events-none
            absolute -inset-[100px] opacity-50 will-change-[background-position]`,

            showRadialGradient &&
              `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
          )}
          style={{ willChange: 'background-position' }}
        ></div>
      </div>
      
      <div
        className={cn(
          "relative flex flex-col items-center justify-start bg-transparent text-gray-900 transition-bg",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </main>
  );
};
