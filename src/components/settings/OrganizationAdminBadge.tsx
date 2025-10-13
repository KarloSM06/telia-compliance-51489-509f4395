/**
 * Badge for Organization Admins (customers with admin rights in their organization).
 * This is NOT the same as Hiems Admin Badge.
 */
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

export function OrganizationAdminBadge() {
  return (
    <Badge variant="outline" className="gap-1 border-primary/20">
      <Users className="h-3 w-3" />
      Organization Admin
    </Badge>
  );
}
