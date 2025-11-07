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
        <h3 className="text-xl font-semibold">Inga AI-konsultationer hittades</h3>
        <p className="text-muted-foreground">
          Justera dina filter eller vänta på nya konsultationer
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Om du förväntar dig att se data, kontrollera att ditt konto har admin-behörighet
        </p>
      </div>
    </div>
  );
}
