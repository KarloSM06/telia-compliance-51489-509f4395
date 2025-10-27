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
        {/* Premium Hero Section with Integrated Navigation */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 text-white mb-8">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2">Kommunikation</h1>
            <p className="text-lg opacity-90 mb-6">
              Hantera mallar, påminnelser, notifikationer och SMS-inställningar från ett centralt nav
            </p>

            {/* Desktop Navigation - Organic Floating Cards */}
            <div className="hidden lg:block">
              <TabsList className="flex flex-wrap justify-center gap-4 bg-transparent border-0 p-0">
                <TabsTrigger 
                  value="templates" 
                  className="group relative gap-3 px-8 py-4 bg-white/20 text-white/90 backdrop-blur-md border-2 border-white/50 rounded-2xl shadow-lg hover:shadow-2xl hover:bg-white/30 hover:text-white hover:-translate-y-1 hover:scale-105 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:border-white data-[state=active]:shadow-2xl data-[state=active]:scale-110 transition-all duration-300"
                >
                  <FileText className="h-6 w-6 group-data-[state=active]:animate-pulse" />
                  <span className="font-semibold">Mallar</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="reminders" 
                  className="group relative gap-3 px-8 py-4 bg-white/20 text-white/90 backdrop-blur-md border-2 border-white/50 rounded-full shadow-lg hover:shadow-2xl hover:bg-white/30 hover:text-white hover:-translate-y-1 hover:scale-105 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:border-white data-[state=active]:shadow-2xl data-[state=active]:scale-110 transition-all duration-300"
                >
                  <Bell className="h-6 w-6 group-data-[state=active]:animate-pulse" />
                  <span className="font-semibold">Påminnelser</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="notifications" 
                  className="group relative gap-3 px-8 py-4 bg-white/20 text-white/90 backdrop-blur-md border-2 border-white/50 rounded-3xl shadow-lg hover:shadow-2xl hover:bg-white/30 hover:text-white hover:-translate-y-1 hover:scale-105 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:border-white data-[state=active]:shadow-2xl data-[state=active]:scale-110 transition-all duration-300"
                >
                  <BellRing className="h-6 w-6 group-data-[state=active]:animate-pulse" />
                  <span className="font-semibold">Ägarnotiser</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="sms-provider" 
                  className="group relative gap-3 px-8 py-4 bg-white/20 text-white/90 backdrop-blur-md border-2 border-white/50 rounded-2xl shadow-lg hover:shadow-2xl hover:bg-white/30 hover:text-white hover:-translate-y-1 hover:scale-105 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:border-white data-[state=active]:shadow-2xl data-[state=active]:scale-110 transition-all duration-300"
                >
                  <MessageSquare className="h-6 w-6 group-data-[state=active]:animate-pulse" />
                  <span className="font-semibold">SMS-leverantör</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="insights" 
                  className="group relative gap-3 px-8 py-4 bg-white/20 text-white/90 backdrop-blur-md border-2 border-white/50 rounded-full shadow-lg hover:shadow-2xl hover:bg-white/30 hover:text-white hover:-translate-y-1 hover:scale-105 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:border-white data-[state=active]:shadow-2xl data-[state=active]:scale-110 transition-all duration-300"
                >
                  <BarChart className="h-6 w-6 group-data-[state=active]:animate-pulse" />
                  <span className="font-semibold">Insikter</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Mobile Navigation - Integrated into Hero */}
            <div className="lg:hidden flex justify-center animate-scale-in">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="w-full max-w-md bg-primary-foreground/10 backdrop-blur-md border-primary-foreground/20 text-primary-foreground">
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
          </div>
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]" />
        </div>

        <div className="w-full px-4">
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
