import { Sidebar, SidebarBody } from "@/components/ui/animated-sidebar";
import { AppSidebar } from "./AppSidebar";
import { OwnerNotificationBell } from "@/components/OwnerNotificationBell";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Laddar dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <div className="flex min-h-screen w-full bg-background">
        <SidebarBody className="justify-between gap-10">
          <AppSidebar />
        </SidebarBody>
        <div className="flex-1 flex flex-col md:ml-[60px]">
          <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
            <div className="flex-1" />
            <OwnerNotificationBell />
          </header>
          <main className="flex-1 p-6 md:p-8 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </Sidebar>
  );
}
