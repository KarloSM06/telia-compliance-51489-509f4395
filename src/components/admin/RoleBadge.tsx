import { Badge } from "@/components/ui/badge";
import { ShieldCheck, User } from "lucide-react";

interface RoleBadgeProps {
  role: 'admin' | 'client';
}

export function RoleBadge({ role }: RoleBadgeProps) {
  if (role === 'admin') {
    return (
      <Badge variant="secondary" className="gap-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none">
        <ShieldCheck className="h-3 w-3" />
        Admin
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1">
      <User className="h-3 w-3" />
      Klient
    </Badge>
  );
}
