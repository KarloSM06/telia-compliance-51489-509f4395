import { Badge } from "@/components/ui/badge";
import { ShieldCheck, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleBadgeProps {
  role: 'admin' | 'client';
}

export function RoleBadge({ role }: RoleBadgeProps) {
  if (role === 'admin') {
    return (
      <Badge className={cn(
        "gap-1",
        "bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600",
        "text-white border-none",
        "shadow-lg shadow-purple-500/50",
        "hover:shadow-xl hover:shadow-purple-500/70",
        "transition-all duration-300"
      )}>
        <ShieldCheck className="h-3 w-3" />
        Admin
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className={cn(
      "gap-1",
      "border-primary/30",
      "hover:bg-primary/10",
      "transition-colors"
    )}>
      <User className="h-3 w-3" />
      Klient
    </Badge>
  );
}
