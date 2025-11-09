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
        "group/spotlight p-10 rounded-md relative",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
