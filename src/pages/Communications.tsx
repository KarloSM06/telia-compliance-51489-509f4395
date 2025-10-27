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
      {/* Premium Hero Section with Integrated Navigation */}
      <div className="relative bg-gradient-hero text-primary-foreground overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-[url('/images/tools-background.jpg')] opacity-5 bg-cover bg-center" />
        <div className="relative container mx-auto px-6 py-12">
          <div className="max-w-3xl mb-8">
            <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4 animate-fade-in">
              Kommunikation
            </h1>
            <p className="text-lg text-primary-foreground/80 animate-fade-in">
              Hantera mallar, påminnelser, notifikationer och SMS-inställningar från ett centralt nav
            </p>
          </div>

          {/* Integrated Navigation */}
          <div className="flex justify-center">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-5xl">
              {/* Desktop Navigation */}
              <TabsList className="hidden lg:inline-flex h-auto p-1.5 bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/20 shadow-elegant animate-scale-in">
                <TabsTrigger value="templates" className="gap-2 data-[state=active]:bg-primary-foreground data-[state=active]:text-primary">
                  <FileText className="h-4 w-4" />
                  Mallar
                </TabsTrigger>
                <TabsTrigger value="reminders" className="gap-2 data-[state=active]:bg-primary-foreground data-[state=active]:text-primary">
                  <Bell className="h-4 w-4" />
                  Påminnelser
                </TabsTrigger>
                <TabsTrigger value="notifications" className="gap-2 data-[state=active]:bg-primary-foreground data-[state=active]:text-primary">
                  <BellRing className="h-4 w-4" />
                  Ägarnotiser
                </TabsTrigger>
                <TabsTrigger value="sms-provider" className="gap-2 data-[state=active]:bg-primary-foreground data-[state=active]:text-primary">
                  <MessageSquare className="h-4 w-4" />
                  SMS-leverantör
                </TabsTrigger>
                <TabsTrigger value="insights" className="gap-2 data-[state=active]:bg-primary-foreground data-[state=active]:text-primary">
                  <BarChart className="h-4 w-4" />
                  Insikter
                </TabsTrigger>
              </TabsList>

              {/* Mobile Navigation */}
              <div className="lg:hidden animate-scale-in">
                <Select value={activeTab} onValueChange={setActiveTab}>
                  <SelectTrigger className="w-full bg-primary-foreground/10 backdrop-blur-md border-primary-foreground/20 text-primary-foreground">
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
            </Tabs>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
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
        </Tabs>
      </div>
    </div>
  );
}
