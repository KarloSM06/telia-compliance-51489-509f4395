import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Trash2, Loader2, Webhook, Sparkles } from "lucide-react";
import { useLeadChat } from "@/hooks/useLeadChat";
import { useLeads } from "@/hooks/useLeads";
import { LeadCard } from "../LeadCard";
import { LeadDetailModal } from "../LeadDetailModal";
import linkedinLogo from "@/assets/linkedin-logo.png";
import claudeLogo from "@/assets/claude-logo.png";
import { toast } from "sonner";

export function ClaudeLinkedInSection() {
  const [message, setMessage] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  
  const { messages, loading, sending, sendMessage, clearChat } = useLeadChat('claude-linkedin');
  const { leads, updateLead, stats } = useLeads('claude-linkedin');

  const handleSendMessage = async () => {
    if (!message.trim() || !webhookUrl.trim()) {
      toast.error('Ange både meddelande och webhook URL');
      return;
    }
    
    await sendMessage(message, webhookUrl);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0077B5]/5 via-background to-[#D97757]/5 animate-fade-in">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#0077B5] to-[#D97757] text-white py-12 px-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 bg-white rounded-2xl flex items-center justify-center shadow-xl gap-2">
              <img src={linkedinLogo} alt="LinkedIn" className="h-9 w-9 object-contain" />
              <img src={claudeLogo} alt="Claude" className="h-9 w-9 object-contain" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Leta med AI & LinkedIn</h1>
              <p className="text-white/90 text-lg">Intelligent prospektering med Claude och LinkedIn-data</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Chat */}
          <Card className="border-2 border-[#0077B5]/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-[#0077B5]/10 to-transparent border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <img src={claudeLogo} alt="Claude" className="h-6 w-6" />
                  AI Assistent
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearChat}
                  disabled={messages.length === 0}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-[600px]">
              {/* Messages */}
              <ScrollArea className="flex-1 p-6">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-[#0077B5]" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12">
                    <Sparkles className="h-12 w-12 mx-auto mb-4 text-[#D97757]" />
                    <p>Börja chatta med AI-assistenten för att hitta leads</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            msg.role === 'user'
                              ? 'bg-gradient-to-r from-[#0077B5] to-[#00A0DC] text-white'
                              : 'bg-gradient-to-r from-[#D97757] to-[#E89B7D] text-white'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Webhook URL Input */}
              <div className="p-4 border-t bg-muted/30">
                <Input
                  placeholder="N8N Webhook URL"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="mb-2"
                />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Skriv ditt meddelande..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="resize-none"
                    rows={2}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={sending || !message.trim() || !webhookUrl.trim()}
                    className="bg-gradient-to-r from-[#0077B5] to-[#D97757] hover:opacity-90"
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right: Leads & Webhook */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="border-[#0077B5]/20">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#0077B5]">{stats.totalLeads}</p>
                    <p className="text-sm text-muted-foreground">Totalt Leads</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-[#D97757]/20">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#D97757]">{stats.newLeads}</p>
                    <p className="text-sm text-muted-foreground">Nya</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-[#0077B5]/20">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#0077B5]">{stats.contacted}</p>
                    <p className="text-sm text-muted-foreground">Kontaktade</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Manual Webhook Trigger */}
            <Card className="border-2 border-[#D97757]/20">
              <CardHeader className="bg-gradient-to-r from-[#D97757]/10 to-transparent">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Webhook className="h-4 w-4 text-[#D97757]" />
                  Manuell Webhook
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground mb-3">
                  Trigga webhook för att köra prospektering manuellt
                </p>
                <Input
                  placeholder="Webhook URL"
                  className="mb-2"
                />
                <Button className="w-full bg-[#D97757] hover:bg-[#c86847]">
                  <Webhook className="h-4 w-4 mr-2" />
                  Kör Prospektering
                </Button>
              </CardContent>
            </Card>

            {/* Leads Results */}
            <Card className="border-2 border-[#0077B5]/20">
              <CardHeader className="bg-gradient-to-r from-[#0077B5]/10 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <img src={linkedinLogo} alt="LinkedIn" className="h-5 w-5" />
                  Genererade Leads
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ScrollArea className="h-[400px]">
                  {leads.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <p>Inga leads än. Chatta med AI för att generera leads.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {leads.map((lead) => (
                        <LeadCard
                          key={lead.id}
                          lead={lead}
                          onViewDetails={setSelectedLead}
                        />
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          open={!!selectedLead}
          onOpenChange={(open) => !open && setSelectedLead(null)}
          onUpdate={updateLead}
        />
      )}
    </div>
  );
}
