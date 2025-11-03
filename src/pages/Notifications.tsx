import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Bell, BellRing, MessageSquare, BarChart3 } from "lucide-react";
import { PremiumHeader } from "@/components/ui/premium-header";
import MessageTemplates from "@/pages/MessageTemplates";
import ReminderSettings from "@/pages/ReminderSettings";
import NotificationSettings from "@/pages/NotificationSettings";
import SMSProviderSettings from "@/pages/SMSProviderSettings";
import NotificationAnalytics from "@/pages/NotificationAnalytics";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
export default function Notifications() {
  const [activeTab, setActiveTab] = useState("analytics");
  return <div className="min-h-screen">
      {/* Header Section */}
      <div className="container mx-auto px-6 lg:px-8 pt-8 pb-6">
        <PremiumHeader 
          icon={<Bell className="h-6 w-6 text-primary" />}
          title="Notifikationer" 
          subtitle="Hantera och analysera dina notifikationer"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-0">

        {/* Desktop Navigation - Minimalist Pill Design */}
        <div className="hidden lg:block bg-background border-b border-border">
          <div className="container mx-auto px-6 lg:px-8">
            <TabsList className="h-14 bg-transparent border-0 p-0 gap-1">
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

        {/* Mobile Navigation */}
        <div className="lg:hidden bg-background border-b border-border py-4">
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