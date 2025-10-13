import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

export function AdminBadge() {
  return (
    <Badge variant="secondary" className="gap-1 bg-gradient-gold text-primary">
      <Shield className="h-3 w-3" />
      Admin
    </Badge>
  );
}
