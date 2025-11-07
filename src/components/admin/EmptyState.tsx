import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className={cn(
        "rounded-full p-6",
        "bg-gradient-to-br from-primary/20 to-primary/5",
        "border-2 border-primary/20"
      )}>
        <Users className="h-12 w-12 text-primary" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Inga användare hittades</h3>
        <p className="text-muted-foreground">
          Justera dina filter eller vänta på nya registreringar
        </p>
      </div>
    </div>
  );
}
