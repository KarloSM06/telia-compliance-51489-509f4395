import { Home, Package, LayoutDashboard, Settings, BarChart3, LogOut, Phone, UtensilsCrossed, Users, Target, Award, Star, Calendar, Bell, FileText, MessageSquare, BarChart, Building2 } from "lucide-react";
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
import { useUserProducts } from "@/hooks/useUserProducts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
  { title: "Kalender", url: "/dashboard/calendar", icon: Calendar },
  { title: "Recensioner", url: "/dashboard/reviews", icon: Star },
  { title: "Kommunikation", url: "/dashboard/communications", icon: MessageSquare },
  { title: "Företag", url: "/dashboard/company", icon: Building2 },
  { title: "Produkter / Paket", url: "/dashboard/packages", icon: Package },
  { title: "Custom Dashboard", url: "/dashboard/custom", icon: LayoutDashboard },
  { title: "Inställningar", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const { user, signOut } = useAuth();
  const { products } = useUserProducts();
  const { state } = useSidebar();
  const navigate = useNavigate();
  const isCollapsed = state === "collapsed";

  const productNavigationItems = [
    { title: "AI Receptionist", url: "/dashboard/krono", icon: Phone, productId: "krono" },
    { title: "Restaurang & Café", url: "/dashboard/gastro", icon: UtensilsCrossed, productId: "gastro" },
    { title: "AI Rekrytering", url: "/dashboard/talent", icon: Users, productId: "talent" },
    { title: "AI Prospektering", url: "/dashboard/lead", icon: Target, productId: "lead" },
    { title: "AI Compliance", url: "/dashboard/thor", icon: Award, productId: "thor" },
    { title: "AI Omdömen", url: "/dashboard/eko", icon: Star, productId: "eko" },
  ].filter(item => products.includes(item.productId));

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
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
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

        {productNavigationItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Mina Produkter</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {productNavigationItems.map((item) => (
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
