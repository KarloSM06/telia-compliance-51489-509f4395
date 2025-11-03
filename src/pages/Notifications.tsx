import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Bell, BellRing, MessageSquare, BarChart3 } from "lucide-react";
import MessageTemplates from "@/pages/MessageTemplates";
import ReminderSettings from "@/pages/ReminderSettings";
import NotificationSettings from "@/pages/NotificationSettings";
import SMSProviderSettings from "@/pages/SMSProviderSettings";
import NotificationAnalytics from "@/pages/NotificationAnalytics";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NotificationQuickActions } from "@/components/notifications/NotificationQuickActions";

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("analytics");
  return <div className="min-h-screen">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-0">

        {/* Desktop Navigation in Quick Actions */}
        <NotificationQuickActions activeTab={activeTab} />

        {/* Mobile Navigation */}
        <div className="lg:hidden sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border py-4">
          <div className="container mx-auto px-6 lg:px-8 animate-scale-in">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full max-w-md bg-card border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="analytics">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analys
                </div>
              </SelectItem>
              <SelectItem value="templates">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Mallar
                </div>
              </SelectItem>
              <SelectItem value="reminders">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Påminnelser
                </div>
              </SelectItem>
              <SelectItem value="notifications">
                <div className="flex items-center gap-2">
                  <BellRing className="h-4 w-4" />
                  Ägarnotiser
                </div>
              </SelectItem>
              <SelectItem value="sms-provider">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  SMS-leverantör
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          </div>
        </div>

        <div className="w-full">
          <TabsContent value="analytics" className="animate-fade-in mt-0">
            <NotificationAnalytics />
          </TabsContent>

          <TabsContent value="templates" className="animate-fade-in mt-0">
            <MessageTemplates />
          </TabsContent>

          <TabsContent value="reminders" className="animate-fade-in mt-0">
            <ReminderSettings />
          </TabsContent>

          <TabsContent value="notifications" className="animate-fade-in mt-0">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="sms-provider" className="animate-fade-in mt-0">
            <SMSProviderSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>;
}