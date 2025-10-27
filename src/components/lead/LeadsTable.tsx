import { useState } from "react";
import { Lead } from "@/hooks/useLeads";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Mail, Phone, Sparkles, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useEnrichLead } from "@/hooks/useEnrichLead";

interface LeadsTableProps {
  leads: Lead[];
  onViewDetails: (lead: Lead) => void;
  onBulkEnrich?: () => void;
  isBulkEnriching?: boolean;
  bulkProgress?: { current: number; total: number };
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

export function LeadsTable({ leads, onViewDetails, onBulkEnrich, isBulkEnriching, bulkProgress }: LeadsTableProps) {
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => {
            const isEnrichingThis = isEnriching && enrichingLeadId === lead.id;
            
            return (
              <TableRow 
                key={lead.id} 
                className={`cursor-pointer hover:bg-muted/50 ${isEnrichingThis ? 'bg-emerald-50 dark:bg-emerald-950/20 border-l-4 border-l-emerald-500' : ''}`}
              >
                <TableCell className="font-medium">{lead.company_name}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {lead.full_name || lead.contact_person || 
                     (lead.first_name && lead.last_name ? `${lead.first_name} ${lead.last_name}` : 
                      lead.first_name || "-")}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {lead.job_title || "-"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {lead.city || lead.location || lead.region_name || "-"}
                </TableCell>
                <TableCell>
                  <div className="text-sm space-y-1">
                    {lead.email && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {lead.email}
                      </div>
                    )}
                    {lead.phone && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </div>
                    )}
                    {lead.linkedin && (
                      <a 
                        href={lead.linkedin.startsWith('http') ? lead.linkedin : `https://${lead.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>
                </TableCell>
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