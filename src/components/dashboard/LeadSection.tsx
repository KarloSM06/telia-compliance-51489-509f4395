import { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EniroLeadsTab } from "@/components/lead/providers/EniroLeadsTab";
import { LinkedInLeadsTab } from "@/components/lead/providers/LinkedInLeadsTab";
import eniroLogo from "@/assets/eniro-logo.png";
import linkedinLogo from "@/assets/linkedin-logo.png";
import anthropicLogo from "@/assets/anthropic-logo.png";
export function LeadSection() {
  const [providerTab, setProviderTab] = useState<'eniro' | 'linkedin'>('eniro');

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Hitta dina drömkunder</h1>
          <p className="text-lg opacity-90 mb-6">AI-driven prospektering med flera källor</p>
        </div>
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]" />
      </div>

      {/* Provider Tabs */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Välj källa</CardTitle>
          <CardDescription>
            Välj mellan Eniro-sökning och LinkedIn AI-assistent
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={providerTab} onValueChange={(v) => setProviderTab(v as any)}>
        <TabsList className="grid w-full grid-cols-2 h-16 mb-6">
          <TabsTrigger value="eniro" className="text-base gap-3 px-6">
            <img src={eniroLogo} alt="Eniro" className="h-8 w-8 rounded-lg" />
            <span className="font-semibold">Eniro Prospektering</span>
          </TabsTrigger>
          <TabsTrigger value="linkedin" className="text-base gap-2 px-6">
            <div className="flex items-center gap-2">
              <img src={linkedinLogo} alt="LinkedIn" className="h-7 w-7 rounded-md" />
              <span className="text-muted-foreground">×</span>
              <img src={anthropicLogo} alt="Anthropic" className="h-7 w-7 rounded-md object-cover scale-[2.5]" />
            </div>
            <span className="font-semibold">AI Assistant</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="eniro" className="mt-0">
          <EniroLeadsTab />
        </TabsContent>

        <TabsContent value="linkedin" className="mt-0">
          <LinkedInLeadsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}