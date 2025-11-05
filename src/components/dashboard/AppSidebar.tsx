import { Home, LayoutDashboard, Settings, LogOut, Phone, Users, Target, Star, Calendar, Bell, MessageSquare, Mail, Brain, Search, Briefcase, Zap, ShieldCheck } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSidebar, SidebarLink } from "@/components/ui/animated-sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useSidebarPermissions } from "@/hooks/useSidebarPermissions";
import { useUserRole } from "@/hooks/useUserRole";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

// Map route paths to icons
const iconMap: Record<string, any> = {
  "/dashboard": Home,
  "/dashboard/admin": ShieldCheck,
  "/dashboard/lead": Search,
  "/dashboard/talent": Briefcase,
  "/dashboard/calendar": Calendar,
  "/dashboard/openrouter": Zap,
  "/dashboard/telephony": Phone,
  "/dashboard/email": Mail,
  "/dashboard/reviews": Star,
  "/dashboard/notifications": Bell,
  "/dashboard/settings": Settings,
};

export function AppSidebar() {
  const { user, signOut } = useAuth();
  const { allowedRoutes, loading: permissionsLoading } = useSidebarPermissions();
  const { isAdmin } = useUserRole();
  const { open } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();

  // Build navigation items from allowed routes
  const navItems = allowedRoutes.map(route => {
    const Icon = iconMap[route.route_path] || LayoutDashboard;
    return {
      label: route.route_title,
      href: route.route_path,
      icon: <Icon className="h-5 w-5 flex-shrink-0" />,
      group: route.route_group,
    };
  });

  // Group navigation items
  const overviewItems = navItems.filter(item => item.group === 'overview');
  const businessToolsItems = navItems.filter(item => item.group === 'business');
  const communicationItems = navItems.filter(item => item.group === 'communication');
  const systemItems = navItems.filter(item => item.group === 'system');

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const groups = [
    { label: 'Översikt', items: overviewItems },
    { label: 'Affärsverktyg', items: businessToolsItems },
    { label: 'Kommunikation', items: communicationItems },
    { label: 'System', items: systemItems },
  ].filter(group => group.items.length > 0);

  return (
    <div className="flex flex-col h-full gap-4">
      {/* User Header */}
      <div className="border-b border-sidebar-border pb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer hover:bg-sidebar-accent/50 rounded-md p-2 -m-2 transition-all">
              <Avatar className="h-10 w-10 ring-2 ring-primary/20 hover:ring-primary/60 transition-all duration-300 flex-shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  {getInitials(user?.email || "")}
                </AvatarFallback>
              </Avatar>
              <motion.div
                animate={{
                  display: open ? "block" : "none",
                  opacity: open ? 1 : 0,
                }}
                className="flex-1 overflow-hidden"
              >
                <p className="text-sm font-semibold truncate text-sidebar-foreground">
                  {user?.email?.split("@")[0] || "Användare"}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  {user?.email}
                </p>
              </motion.div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Mitt konto</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/")}>
              <Home className="mr-2 h-4 w-4" />
              Hem
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Inställningar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logga ut
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {permissionsLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {groups.map((group) => (
              <div key={group.label} className="flex flex-col gap-2">
                <motion.p
                  animate={{
                    display: open ? "block" : "none",
                    opacity: open ? 1 : 0,
                  }}
                  className="text-xs font-medium text-sidebar-foreground/70 px-2"
                >
                  {group.label}
                </motion.p>
                <div className="flex flex-col gap-1">
                  {group.items.map((item) => (
                    <SidebarLink
                      key={item.href}
                      link={item}
                      isActive={location.pathname === item.href}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-sidebar-border pt-4">
        <motion.p
          animate={{
            display: open ? "block" : "none",
            opacity: open ? 1 : 0,
          }}
          className="text-xs text-sidebar-foreground/60 text-center"
        >
          Hiems AI Dashboard
        </motion.p>
      </div>
    </div>
  );
}
