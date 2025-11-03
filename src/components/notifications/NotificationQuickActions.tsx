import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Bell, BellRing, MessageSquare, BarChart3 } from 'lucide-react';

interface NotificationQuickActionsProps {
  activeTab: string;
}

export function NotificationQuickActions({ activeTab }: NotificationQuickActionsProps) {
  return (
    <section className="relative py-8 border-y border-primary/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-center gap-6 flex-wrap">
          {/* Desktop Navigation - Minimalist Pill Design */}
          <div className="hidden lg:flex">
            <TabsList className="h-12 bg-muted/50 border border-border/50 p-1 gap-1">
              <TabsTrigger 
                value="analytics" 
                className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-full px-6"
              >
                <BarChart3 className="h-4 w-4" />
                Analys
              </TabsTrigger>
              <TabsTrigger 
                value="templates" 
                className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-full px-6"
              >
                <FileText className="h-4 w-4" />
                Mallar
              </TabsTrigger>
              <TabsTrigger 
                value="reminders" 
                className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-full px-6"
              >
                <Bell className="h-4 w-4" />
                Påminnelser
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-full px-6"
              >
                <BellRing className="h-4 w-4" />
                Ägarnotiser
              </TabsTrigger>
              <TabsTrigger 
                value="sms-provider" 
                className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-full px-6"
              >
                <MessageSquare className="h-4 w-4" />
                SMS-leverantör
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
      </div>
    </section>
  );
}
