import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useLeads, Lead } from "@/hooks/useLeads";
import { LeadChatInterface } from "@/components/lead/chat/LeadChatInterface";
import { LeadDetailModal } from "@/components/lead/LeadDetailModal";
import { Building, MapPin, Users, Mail, Phone } from "lucide-react";

export const LinkedInLeadsTab = () => {
  const { leads, loading, updateLead } = useLeads();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadDetail, setShowLeadDetail] = useState(false);

  // Filter LinkedIn leads
  const linkedinLeads = leads.filter(lead => lead.provider === 'claude-linkedin');

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setShowLeadDetail(true);
  };

  return (
    <div className="grid grid-cols-2 gap-6 h-[calc(100vh-300px)]">
      {/* Left: Lead List */}
      <Card className="flex flex-col">
        <CardHeader className="border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            LinkedIn Leads
            <Badge variant="secondary" className="ml-auto bg-white/20 text-white">
              {linkedinLeads.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Laddar leads...
              </div>
            ) : linkedinLeads.length === 0 ? (
              <div className="text-center py-16 px-4">
                <Building className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h3 className="font-semibold mb-2">Inga LinkedIn-leads än</h3>
                <p className="text-sm text-muted-foreground">
                  Använd AI-chatten för att söka efter leads
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {linkedinLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-4 hover:bg-blue-50 dark:hover:bg-blue-950/20 cursor-pointer transition-colors"
                    onClick={() => handleViewDetails(lead)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm">{lead.company_name}</h4>
                      <Badge
                        variant={
                          lead.status === 'new' ? 'default' :
                          lead.status === 'contacted' ? 'secondary' :
                          lead.status === 'qualified' ? 'outline' : 'default'
                        }
                        className="text-xs"
                      >
                        {lead.status}
                      </Badge>
                    </div>
                    
                    {lead.contact_person && (
                      <p className="text-sm text-muted-foreground mb-1">
                        {lead.contact_person}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-2">
                      {lead.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {lead.location}
                        </span>
                      )}
                      {lead.employee_count && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {lead.employee_count} anställda
                        </span>
                      )}
                    </div>

                    {lead.ai_score && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-orange-600 h-1.5 rounded-full"
                            style={{ width: `${lead.ai_score}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{lead.ai_score}%</span>
                      </div>
                    )}

                    <div className="flex gap-2 mt-2">
                      {lead.email && (
                        <Badge variant="outline" className="text-xs">
                          <Mail className="h-3 w-3 mr-1" />
                          Email
                        </Badge>
                      )}
                      {lead.phone && (
                        <Badge variant="outline" className="text-xs">
                          <Phone className="h-3 w-3 mr-1" />
                          Telefon
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Right: Chat Interface */}
      <LeadChatInterface />

      <LeadDetailModal 
        lead={selectedLead} 
        open={showLeadDetail} 
        onOpenChange={setShowLeadDetail} 
        onUpdate={updateLead} 
      />
    </div>
  );
};
