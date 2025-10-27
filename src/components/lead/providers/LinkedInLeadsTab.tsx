import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadChatInterface } from "@/components/lead/chat/LeadChatInterface";
import { MessageSquare, Sparkles } from "lucide-react";

export const LinkedInLeadsTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/20">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">LinkedIn AI Assistent</CardTitle>
              <CardDescription className="text-white/90">
                Beskriv dina ideala kunder - AI:n hittar dem åt dig
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-muted/30 border-b p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary mt-0.5" />
              <div className="text-sm space-y-1">
                <p className="font-medium">Så här använder du LinkedIn AI-chatten:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Beskriv dina ideala leads (bransch, storlek, plats, etc.)</li>
                  <li>AI:n söker och skapar kvalificerade leads automatiskt</li>
                  <li>Alla leads hamnar i Eniro-fliken där du kan hantera dem</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="h-[calc(100vh-400px)]">
            <LeadChatInterface />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
