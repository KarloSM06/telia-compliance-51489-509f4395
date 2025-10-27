import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Building2, MapPin, User, Sparkles, Home, Briefcase } from "lucide-react";
import { Lead } from "@/hooks/useLeads";
import { ContactLinkGroup } from "./ContactLinkGroup";
import { QuickContactButtons } from "./QuickContactButtons";

interface LeadCardProps {
  lead: Lead;
  onViewDetails: (lead: Lead) => void;
  viewMode?: 'organizations' | 'contacts';
}

export function LeadCard({ lead, onViewDetails, viewMode = 'organizations' }: LeadCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'enriched': return 'bg-emerald-500/10 text-emerald-700 border-emerald-200';
      case 'contacted': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'qualified': return 'bg-purple-500/10 text-purple-700 border-purple-200';
      case 'converted': return 'bg-green-500/10 text-green-700 border-green-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-700';
      case 'medium': return 'bg-yellow-500/10 text-yellow-700';
      case 'low': return 'bg-gray-500/10 text-gray-700';
      default: return 'bg-gray-500/10 text-gray-700';
    }
  };

  const personName = lead.full_name || lead.contact_person || 
    (lead.first_name && lead.last_name ? `${lead.first_name} ${lead.last_name}` : 
     lead.first_name || "");

  const personInitials = personName
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || lead.company_name.slice(0, 2).toUpperCase();

  return (
    <Card className="group hover:shadow-lg transition-all hover:-translate-y-1">
      <CardHeader className="pb-3">
        {viewMode === 'contacts' ? (
          // Person-focused layout - Enhanced
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-xl">
                  {personInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl truncate mb-1">{personName || "-"}</CardTitle>
                {lead.job_title && (
                  <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span className="truncate">{lead.job_title}</span>
                  </div>
                )}
                {lead.job_seniority_level && (
                  <div className="text-xs text-muted-foreground capitalize mt-0.5">
                    {lead.job_seniority_level} level
                  </div>
                )}
              </div>
              {lead.ai_score && (
                <Badge variant={lead.ai_score >= 80 ? "default" : "secondary"} className="gap-1 whitespace-nowrap">
                  <Sparkles className="h-3 w-3" />
                  {lead.ai_score}
                </Badge>
              )}
            </div>
            
            {/* Company as secondary info */}
            <div className="flex items-center gap-2 text-sm border-t pt-3">
              <Building2 className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <span className="truncate font-medium">{lead.company_name}</span>
            </div>
          </div>
        ) : (
          // Organization-focused layout (original)
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                  {lead.company_name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg truncate">{lead.company_name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  {lead.location && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="truncate">{lead.location}</span>
                    </div>
                  )}
                  {lead.lead_type === 'brf' && (
                    <Badge variant="outline" className="text-xs gap-1">
                      <Home className="h-3 w-3" />
                      BRF
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {lead.ai_score && (
              <Badge variant="outline" className="gap-1 whitespace-nowrap">
                <Sparkles className="h-3 w-3" />
                {lead.ai_score}%
              </Badge>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge className={getStatusColor(lead.status)}>
            {lead.status === 'new' && 'Ny'}
            {lead.status === 'enriched' && '✨ Berikad'}
            {lead.status === 'contacted' && 'Kontaktad'}
            {lead.status === 'qualified' && 'Kvalificerad'}
            {lead.status === 'converted' && 'Konverterad'}
            {lead.status === 'lost' && 'Förlorad'}
          </Badge>
          <Badge variant="outline" className={getPriorityColor(lead.priority || 'medium')}>
            {lead.priority === 'high' && 'Hög prioritet'}
            {lead.priority === 'medium' && 'Medel prioritet'}
            {lead.priority === 'low' && 'Låg prioritet'}
          </Badge>
        </div>

        {viewMode === 'contacts' ? (
          // Person-focused details - Enhanced
          <>
            {/* Location */}
            {(lead.city || lead.location || lead.region_name) && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate font-medium">
                  {lead.city || lead.location || lead.region_name}
                </span>
              </div>
            )}

            {/* Links Section - Prominent */}
            <div className="pt-2 pb-2 border-t border-b">
              <div className="text-xs font-medium text-muted-foreground mb-2">Länkar</div>
              <ContactLinkGroup
                linkedin={lead.linkedin}
                company_linkedin={lead.company_linkedin}
                website={lead.website}
              />
            </div>

            {/* Skills */}
            {lead.skills && lead.skills.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {lead.skills.slice(0, 4).map((skill, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {lead.skills.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{lead.skills.length - 4}
                  </Badge>
                )}
              </div>
            )}
          </>
        ) : (
          // Organization-focused details (original)
          <>
            {(lead.Adress || lead.Postal_Area) && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">
                  {lead.Adress}{lead.Adress && lead.Postal_Area && ', '}{lead.Postal_Area}
                </span>
              </div>
            )}

            {lead.industry && (
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{lead.industry}</span>
              </div>
            )}
            
            {personName && (
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{personName}</span>
              </div>
            )}
          </>
        )}

        {lead.ai_score && lead.ai_reasoning && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground line-clamp-2">
              {lead.ai_reasoning}
            </p>
          </div>
        )}
        
        <div className="pt-3 space-y-2">
          <QuickContactButtons 
            email={lead.email} 
            phone={lead.phone}
            className="w-full"
          />
          <Button 
            size="sm" 
            onClick={() => onViewDetails(lead)} 
            className="w-full"
            variant="outline"
          >
            Visa detaljer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
