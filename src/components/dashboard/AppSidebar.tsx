import { Home, LayoutDashboard, Settings, LogOut, Phone, Users, Target, Star, Calendar, Bell, MessageSquare, Mail, Brain, Search, Briefcase, Zap, ShieldCheck, Inbox } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useSidebar, SidebarLink } from "@/components/ui/animated-sidebar";
import { useSidebarPermissions } from "@/hooks/useSidebarPermissions";
import { ProfileSection } from "./ProfileSection";
import { motion } from "framer-motion";

// Map route paths to icons
const iconMap: Record<string, any> = {
  "/dashboard": Home,
  "/dashboard/admin": ShieldCheck,
  "/dashboard/admin/requests": Inbox,
  "/dashboard/lead": Search,
  "/dashboard/talent": Briefcase,
  "/dashboard/calendar": Calendar,
  "/dashboard/openrouter": Zap,
  "/dashboard/telephony": Phone,
  "/dashboard/email": Mail,
  "/dashboard/reviews": Star,
  "/dashboard/notifications": Bell,
  "/dashboard/settings": Settings
};
export function AppSidebar() {
  const {
    allowedRoutes,
    loading: permissionsLoading
  } = useSidebarPermissions();
  const {
    open
  } = useSidebar();
  const location = useLocation();

  // Build navigation items from allowed routes
  const navItems = allowedRoutes.map(route => {
    const Icon = iconMap[route.route_path] || LayoutDashboard;
    return {
      label: route.route_title,
      href: route.route_path,
      icon: <Icon className="h-5 w-5 flex-shrink-0" />,
      group: route.route_group
    };
  });

  // Group navigation items
  const overviewItems = navItems.filter(item => item.group === 'overview');
  const businessToolsItems = navItems.filter(item => item.group === 'business');
  const communicationItems = navItems.filter(item => item.group === 'communication');
  const systemItems = navItems.filter(item => item.group === 'system');
  const groups = [{
    label: 'Översikt',
    items: overviewItems
  }, {
    label: 'Affärsverktyg',
    items: businessToolsItems
  }, {
    label: 'Kommunikation',
    items: communicationItems
  }, {
    label: 'System',
    items: systemItems
  }].filter(group => group.items.length > 0);
  return <div className="flex flex-col h-full gap-4">
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pt-4">
        {permissionsLoading ? <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div> : <div className="flex flex-col gap-6">
            {groups.map(group => <div key={group.label} className="flex flex-col gap-2">
                
                <div className="flex flex-col gap-1">
                  {group.items.map(item => <SidebarLink key={item.href} link={item} isActive={location.pathname === item.href} />)}
                </div>
              </div>)}
          </div>}
      </div>

      {/* Profile Section */}
      <ProfileSection />

      {/* Footer */}
      
    </div>;
}