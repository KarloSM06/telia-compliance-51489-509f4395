import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Building2, MapPin, User, Mail, Phone, Sparkles, Home } from "lucide-react";
import { Lead } from "@/hooks/useLeads";

interface LeadCardProps {
  lead: Lead;
  onViewDetails: (lead: Lead) => void;
}

export function LeadCard({ lead, onViewDetails }: LeadCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'contacted': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'qualified': return 'bg-purple-500/10 text-purple-700 border-purple-200';
      case 'converted': return 'bg-orange-500/10 text-orange-700 border-orange-200';
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

  return (
    <Card className="group hover:shadow-lg transition-all hover:-translate-y-1">
      <CardHeader className="pb-3">
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
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge className={getStatusColor(lead.status)}>
            {lead.status === 'new' && 'Ny'}
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

        {lead.industry && (
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="truncate">{lead.industry}</span>
          </div>
        )}
        
        {lead.contact_person && (
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="truncate">{lead.contact_person}</span>
          </div>
        )}

        {lead.ai_score && lead.ai_reasoning && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground line-clamp-2">
              {lead.ai_reasoning}
            </p>
          </div>
        )}
        
        <div className="pt-3 flex gap-2">
          {lead.email && (
            <Button size="sm" variant="outline" className="flex-1">
              <Mail className="h-3 w-3 mr-1" />
              Email
            </Button>
          )}
          {lead.phone && (
            <Button size="sm" variant="outline" className="flex-1">
              <Phone className="h-3 w-3 mr-1" />
              Ring
            </Button>
          )}
          <Button size="sm" onClick={() => onViewDetails(lead)} className="flex-1">
            Detaljer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
