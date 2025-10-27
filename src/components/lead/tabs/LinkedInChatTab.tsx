import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadChatInterface } from "@/components/lead/chat/LeadChatInterface";
import { Sparkles } from "lucide-react";
import anthropicLogo from "@/assets/anthropic-ai-logo-new.png";
import linkedinLogo from "@/assets/linkedin-icon.webp";
export const LinkedInChatTab = () => {
  return <div className="h-full flex flex-col min-h-0">
      <Card className="flex-1 flex flex-col min-h-0">
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
                Få färdiga leads med kontaktuppgifter direkt i din lista
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0 min-h-0">
          
          <div className="flex-1 min-h-0">
            <LeadChatInterface />
          </div>
        </CardContent>
      </Card>
    </div>;
};