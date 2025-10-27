import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Bell, BellRing, MessageSquare, BarChart } from "lucide-react";
import MessageTemplates from "@/pages/MessageTemplates";
import ReminderSettings from "@/pages/ReminderSettings";
import NotificationSettings from "@/pages/NotificationSettings";
import SMSProviderSettings from "@/pages/SMSProviderSettings";
import MessageInsights from "@/pages/MessageInsights";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Communications() {
  const [activeTab, setActiveTab] = useState("templates");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        {/* Premium Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 text-white mb-8">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2">Kommunikation</h1>
            <p className="text-lg opacity-90 mb-6">
              Styr all kundkommunikation från en plats
            </p>
          </div>
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]" />
        </div>

        {/* Desktop Navigation - Minimalist Pill Design */}
        <div className="hidden lg:block mb-8">
          <TabsList className="flex flex-wrap justify-center gap-3 bg-transparent border-0 p-0">
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
            
            <TabsTrigger 
              value="insights" 
              className="group relative gap-2 px-6 py-3 bg-card text-foreground border border-border rounded-full shadow-sm hover:shadow-md hover:bg-accent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-md transition-all duration-200"
            >
              <BarChart className="h-5 w-5" />
              <span className="font-medium">Insikter</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex justify-center mb-8 animate-scale-in">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full max-w-md bg-card border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
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
              <SelectItem value="insights">
                <div className="flex items-center gap-2">
                  <BarChart className="h-4 w-4" />
                  Insikter
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full px-1">
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

          <TabsContent value="insights" className="animate-fade-in mt-0">
            <MessageInsights />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
