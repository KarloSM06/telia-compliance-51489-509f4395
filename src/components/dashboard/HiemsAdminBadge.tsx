/**
 * Badge for Hiems Admins (Hiems employees with system-wide access).
 * This is NOT for Organization Admins (see OrganizationAdminBadge).
 */
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

export function HiemsAdminBadge() {
  return (
    <Badge variant="secondary" className="gap-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none">
      <ShieldCheck className="h-3 w-3" />
      Hiems Admin
    </Badge>
  );
}
