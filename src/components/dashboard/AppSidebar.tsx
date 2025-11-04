import { Home, LayoutDashboard, Settings, LogOut, Phone, Users, Target, Star, Calendar, Bell, MessageSquare, Mail, Brain, Search, Briefcase, Zap, ShieldCheck } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
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
  const { state } = useSidebar();
  const navigate = useNavigate();
  const isCollapsed = state === "collapsed";

  // Build navigation items from allowed routes
  const navItems = allowedRoutes.map(route => ({
    title: route.route_title,
    url: route.route_path,
    icon: iconMap[route.route_path] || LayoutDashboard,
    group: route.route_group,
  }));

  // Group navigation items
  const overviewItems = navItems.filter(item => item.group === 'overview');
  const businessToolsItems = navItems.filter(item => item.group === 'business');
  const communicationItems = navItems.filter(item => item.group === 'communication');
  const systemItems = navItems.filter(item => item.group === 'system');

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer hover:bg-sidebar-accent/50 rounded-md p-2 -m-2 transition-all">
              <Avatar className="h-10 w-10 ring-2 ring-yellow-500/20 hover:ring-yellow-500/60 transition-all duration-300">
                <AvatarFallback className="bg-yellow-500 text-primary font-semibold">
                  {getInitials(user?.email || "")}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-semibold truncate text-sidebar-foreground">
                    {user?.email?.split("@")[0] || "Användare"}
                  </p>
                  <p className="text-xs text-sidebar-foreground/60 truncate">
                    {user?.email}
                  </p>
                </div>
              )}
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
      </SidebarHeader>

      <SidebarContent>
        {permissionsLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {overviewItems.length > 0 && (
              <SidebarGroup>
                <SidebarGroupLabel>Översikt</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {overviewItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild tooltip={item.title}>
                          <NavLink
                            to={item.url}
                            className={({ isActive }) =>
                              `flex items-center gap-3 transition-all ${
                                isActive
                                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                  : "hover:bg-sidebar-accent/50"
                              }`
                            }
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}

            {businessToolsItems.length > 0 && (
              <SidebarGroup>
                <SidebarGroupLabel>Affärsverktyg</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {businessToolsItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild tooltip={item.title}>
                          <NavLink
                            to={item.url}
                            className={({ isActive }) =>
                              `flex items-center gap-3 transition-all ${
                                isActive
                                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                  : "hover:bg-sidebar-accent/50"
                              }`
                            }
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}

            {communicationItems.length > 0 && (
              <SidebarGroup>
                <SidebarGroupLabel>Kommunikation</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {communicationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild tooltip={item.title}>
                          <NavLink
                            to={item.url}
                            className={({ isActive }) =>
                              `flex items-center gap-3 transition-all ${
                                isActive
                                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                  : "hover:bg-sidebar-accent/50"
                              }`
                            }
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}

            {systemItems.length > 0 && (
              <SidebarGroup>
                <SidebarGroupLabel>System</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {systemItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild tooltip={item.title}>
                          <NavLink
                            to={item.url}
                            className={({ isActive }) =>
                              `flex items-center gap-3 transition-all ${
                                isActive
                                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                  : "hover:bg-sidebar-accent/50"
                              }`
                            }
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <p className="text-xs text-sidebar-foreground/60">Hiems AI Dashboard</p>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
