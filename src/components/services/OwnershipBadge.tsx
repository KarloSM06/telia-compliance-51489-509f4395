import { Shield, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface OwnershipBadgeProps {
  variant?: "default" | "compact";
  className?: string;
}

export function OwnershipBadge({ variant = "default", className }: OwnershipBadgeProps) {
  if (variant === "compact") {
    return (
      <div className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full",
        "bg-gradient-to-r from-green-500/10 to-emerald-500/10",
        "border border-green-500/20",
        className
      )}>
        <Shield className="w-4 h-4 text-green-500" />
        <span className="text-sm font-semibold text-green-500">Du äger lösningen</span>
      </div>
    );
  }

  return (
    <div className={cn(
      "p-6 rounded-2xl border border-green-500/20",
      "bg-gradient-to-br from-green-500/5 to-emerald-500/5",
      "backdrop-blur-sm",
      className
    )}>
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
          <Shield className="w-6 h-6 text-green-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2 text-foreground">
            Full äganderätt & kontroll
          </h3>
          <p className="text-muted-foreground mb-4">
            När vi bygger din lösning äger du allt – koden, datan och hela systemet. Ingen inlåsning, total frihet.
          </p>
          <ul className="space-y-2">
            {[
              "Du äger all källkod",
              "Full kontroll över din data",
              "Ingen månatlig licensavgift",
              "Fritt att välja egen hosting",
              "Vi supporterar dig även efter lansering"
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}