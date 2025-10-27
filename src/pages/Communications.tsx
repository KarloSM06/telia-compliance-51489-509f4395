import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Bell, BellRing, MessageSquare, BarChart } from "lucide-react";
import MessageTemplates from "@/pages/MessageTemplates";
import ReminderSettings from "@/pages/ReminderSettings";
import NotificationSettings from "@/pages/NotificationSettings";
import SMSProviderSettings from "@/pages/SMSProviderSettings";
import MessageInsights from "@/pages/MessageInsights";

export default function Communications() {
  const [activeTab, setActiveTab] = useState("templates");

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl animate-fade-in">
      <div className="mb-8 animate-scale-in">
        <h1 className="text-3xl font-bold mb-2">Kommunikation</h1>
        <p className="text-muted-foreground">
          Hantera mallar, påminnelser, notifikationer och SMS-inställningar
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-5 gap-2 h-auto p-1 animate-slide-in-right">
          <TabsTrigger value="templates" className="gap-2 hover-scale">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Mallar</span>
          </TabsTrigger>
          <TabsTrigger value="reminders" className="gap-2 hover-scale">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Påminnelser</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 hover-scale">
            <BellRing className="h-4 w-4" />
            <span className="hidden sm:inline">Ägarnotiser</span>
          </TabsTrigger>
          <TabsTrigger value="sms-provider" className="gap-2 hover-scale">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">SMS-leverantör</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="gap-2 hover-scale">
            <BarChart className="h-4 w-4" />
            <span className="hidden sm:inline">Insikter</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="animate-enter">
          <MessageTemplates />
        </TabsContent>

        <TabsContent value="reminders" className="animate-enter">
          <ReminderSettings />
        </TabsContent>

        <TabsContent value="notifications" className="animate-enter">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="sms-provider" className="animate-enter">
          <SMSProviderSettings />
        </TabsContent>

        <TabsContent value="insights" className="animate-enter">
          <MessageInsights />
        </TabsContent>
      </Tabs>
    </div>
  );
}