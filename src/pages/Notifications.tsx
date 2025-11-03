import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Bell, BellRing, MessageSquare, BarChart3 } from "lucide-react";
import MessageTemplates from "@/pages/MessageTemplates";
import ReminderSettings from "@/pages/ReminderSettings";
import NotificationSettings from "@/pages/NotificationSettings";
import SMSProviderSettings from "@/pages/SMSProviderSettings";
import NotificationAnalytics from "@/pages/NotificationAnalytics";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("analytics");

  return (
    <div className="min-h-screen">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-0">

        {/* Desktop Navigation - Minimalist Pill Design */}
        <div className="hidden lg:block sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border py-4">
          <div className="container mx-auto px-6 lg:px-8">
            <TabsList className="flex flex-wrap justify-center gap-3 bg-transparent border-0 p-0">
            <TabsTrigger 
              value="analytics" 
              className="group relative gap-2 px-6 py-3 bg-card text-foreground border border-border rounded-full shadow-sm hover:shadow-md hover:bg-accent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-md transition-all duration-200"
            >
              <BarChart3 className="h-5 w-5" />
              <span className="font-medium">Analys</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="templates" 
              className="group relative gap-2 px-6 py-3 bg-card text-foreground border border-border rounded-full shadow-sm hover:shadow-md hover:bg-accent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-md transition-all duration-200"
            >
              <FileText className="h-5 w-5" />
              <span className="font-medium">Mallar</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="reminders" 
              className="group relative gap-2 px-6 py-3 bg-card text-foreground border border-border rounded-full shadow-sm hover:shadow-md hover:bg-accent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-md transition-all duration-200"
            >
              <Bell className="h-5 w-5" />
              <span className="font-medium">Påminnelser</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="notifications" 
              className="group relative gap-2 px-6 py-3 bg-card text-foreground border border-border rounded-full shadow-sm hover:shadow-md hover:bg-accent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-md transition-all duration-200"
            >
              <BellRing className="h-5 w-5" />
              <span className="font-medium">Ägarnotiser</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="sms-provider" 
              className="group relative gap-2 px-6 py-3 bg-card text-foreground border border-border rounded-full shadow-sm hover:shadow-md hover:bg-accent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-md transition-all duration-200"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="font-medium">SMS-leverantör</span>
            </TabsTrigger>
          </TabsList>
          </div>
        </div>

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
    </div>
  );
}
