import { useState } from "react";
import { Lead } from "@/hooks/useLeads";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Sparkles, Loader2, Building2, MapPin, Briefcase } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { useEnrichLead } from "@/hooks/useEnrichLead";
import { ContactLinkGroup } from "./ContactLinkGroup";
import { QuickContactButtons } from "./QuickContactButtons";
import { translateSeniorityLevel, formatJobTitle } from "@/lib/utils";

interface LeadsTableProps {
  leads: Lead[];
  onViewDetails: (lead: Lead) => void;
  onBulkEnrich?: () => void;
  isBulkEnriching?: boolean;
  bulkProgress?: { current: number; total: number };
  viewMode?: 'organizations' | 'contacts';
}

const statusColors = {
  new: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  enriched: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  contacted: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
  qualified: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
  converted: "bg-green-500/10 text-green-700 dark:text-green-300",
  rejected: "bg-red-500/10 text-red-700 dark:text-red-300",
};

const statusLabels = {
  new: "Ny",
  enriched: "Berikad",
  contacted: "Kontaktad",
  qualified: "Kvalificerad",
  converted: "Konverterad",
  rejected: "Avvisad",
};

export function LeadsTable({ leads, onViewDetails, onBulkEnrich, isBulkEnriching, bulkProgress, viewMode = 'organizations' }: LeadsTableProps) {
  const { enrichLead, isEnriching, enrichingLeadId } = useEnrichLead();

  const newLeadsCount = leads.filter(l => l.status === 'new').length;

  const handleEnrich = async (leadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await enrichLead(leadId);
  };

  if (leads.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Inga leads att visa än</p>
        <p className="text-sm mt-2">Skapa en lead-sökning för att komma igång</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {newLeadsCount > 0 && onBulkEnrich && (
        <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
          <div>
            <p className="font-medium">Berika alla nya leads med AI</p>
            <p className="text-sm text-muted-foreground">
              {newLeadsCount} nya leads är redo att berikas
              {isBulkEnriching && bulkProgress && ` (${bulkProgress.current}/${bulkProgress.total})`}
            </p>
          </div>
          <Button 
            onClick={onBulkEnrich}
            disabled={isBulkEnriching}
            size="lg"
            className="gap-2"
          >
            {isBulkEnriching ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Berikar {bulkProgress?.current}/{bulkProgress?.total}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Berika alla ({newLeadsCount})
              </>
            )}
          </Button>
        </div>
      )}

      <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            {viewMode === 'contacts' ? (
              <>
                <TableHead className="w-[280px]">Person</TableHead>
                <TableHead className="w-[220px]">Roll & Företag</TableHead>
                <TableHead className="w-[200px]">Kontaktinformation</TableHead>
                <TableHead className="w-[200px]">Länkar</TableHead>
                <TableHead className="w-[140px]">Status & Actions</TableHead>
              </>
            ) : (
              <>
                <TableHead>Företag</TableHead>
                <TableHead>Kontaktperson</TableHead>
                <TableHead>Jobbtitel</TableHead>
                <TableHead>Plats</TableHead>
                <TableHead>Kontakt</TableHead>
                <TableHead>AI Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>AI-berikning</TableHead>
                <TableHead>Skapad</TableHead>
                <TableHead className="text-right">Åtgärder</TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => {
            const isEnrichingThis = isEnriching && enrichingLeadId === lead.id;
            
            return (
              <TableRow 
                key={lead.id} 
                className={`cursor-pointer hover:bg-muted/50 transition-colors ${isEnrichingThis ? 'bg-emerald-50 dark:bg-emerald-950/20 border-l-4 border-l-emerald-500' : ''}`}
                onClick={() => onViewDetails(lead)}
              >
                {viewMode === 'contacts' ? (
                  <>
                    {/* Person Column - Enhanced */}
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 flex-shrink-0">
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-base">
                            {(lead.full_name || lead.first_name || lead.contact_person || 'U')
                              .split(' ')
                              .map(n => n[0])
                              .slice(0, 2)
                              .join('')
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-base truncate">
                            {lead.full_name || lead.contact_person || 
                             (lead.first_name && lead.last_name ? `${lead.first_name} ${lead.last_name}` : 
                              lead.first_name || "-")}
                          </div>
                          {lead.ai_score && (
                            <Badge 
                              variant={lead.ai_score >= 80 ? "default" : "secondary"}
                              className="mt-1"
                            >
                              <Sparkles className="h-3 w-3 mr-1" />
                              {lead.ai_score}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Roll & Företag Column - New */}
                    <TableCell className="py-4">
                      <div className="space-y-2">
                        <div>
                          <div className="font-medium text-sm flex items-center gap-1.5">
                            <Briefcase className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                            <span className="truncate">{formatJobTitle(lead.job_title)}</span>
                          </div>
                          {lead.job_seniority_level && (
                            <div className="text-xs text-muted-foreground ml-5">
                              {translateSeniorityLevel(lead.job_seniority_level)}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Building2 className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                          <span className="truncate text-muted-foreground">{lead.company_name}</span>
                        </div>
                        {(lead.city || lead.location || lead.region_name) && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">
                              {lead.city || lead.location || lead.region_name}
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Kontaktinformation Column - Enhanced */}
                    <TableCell className="py-4">
                      <QuickContactButtons 
                        email={lead.email} 
                        phone={lead.phone} 
                        size="sm"
                      />
                    </TableCell>

                    {/* Länkar Column - New */}
                    <TableCell className="py-4">
                      <ContactLinkGroup
                        linkedin={lead.linkedin}
                        company_linkedin={lead.company_linkedin}
                        website={lead.website}
                      />
                    </TableCell>

                    {/* Status & Actions Column - Consolidated */}
                    <TableCell className="py-4">
                      <div className="space-y-2">
                        <Badge className={statusColors[lead.status]}>
                          {statusLabels[lead.status]}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDetails(lead);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="text-xs">Detaljer</span>
                        </Button>
                      </div>
                    </TableCell>
                  </>
                ) : (
                  <>
                    {/* Organization-focused view */}
                    <TableCell className="font-medium">{lead.company_name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {lead.full_name || lead.contact_person || 
                         (lead.first_name && lead.last_name ? `${lead.first_name} ${lead.last_name}` : 
                          lead.first_name || "-")}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatJobTitle(lead.job_title)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {lead.city || lead.location || lead.region_name || "-"}
                    </TableCell>
                    <TableCell>
                      <ContactLinkGroup
                        linkedin={lead.linkedin}
                        company_linkedin={lead.company_linkedin}
                        website={lead.website}
                      />
                    </TableCell>
                  </>
                )}
                <TableCell>
                  {lead.ai_score ? (
                    <Badge variant={lead.ai_score >= 80 ? "default" : "secondary"}>
                      {lead.ai_score}
                    </Badge>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[lead.status]}>
                    {statusLabels[lead.status]}
                  </Badge>
                </TableCell>
                {viewMode !== 'contacts' && (
                  <TableCell>
                    {lead.status === 'new' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleEnrich(lead.id, e)}
                        disabled={isEnrichingThis}
                        className="gap-1"
                      >
                        {isEnrichingThis ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Berikar...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3 w-3" />
                            Berika
                          </>
                        )}
                      </Button>
                    ) : (
                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm">
                        <Sparkles className="h-3 w-3" />
                        Berikad
                      </div>
                    )}
                  </TableCell>
                )}
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(lead.created_at), "yyyy-MM-dd")}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(lead)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}