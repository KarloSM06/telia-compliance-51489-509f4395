import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadChatInterface } from "@/components/lead/chat/LeadChatInterface";
import { Sparkles } from "lucide-react";
import anthropicLogo from "@/assets/anthropic-ai-logo-new.png";
import linkedinLogo from "@/assets/linkedin-icon.webp";

export const LinkedInChatTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b-4 border-[#D97642]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img src={linkedinLogo} alt="LinkedIn" className="h-7 w-7 object-contain" />
              <span className="text-muted-foreground">×</span>
              <img src={anthropicLogo} alt="Anthropic AI" className="h-6 w-6 object-contain" />
            </div>
            <div>
              <CardTitle className="text-xl">LinkedIn × Anthropic AI</CardTitle>
              <CardDescription>
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
                  <li>Alla leads hamnar i fliken "Listor" där du kan hantera dem</li>
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
