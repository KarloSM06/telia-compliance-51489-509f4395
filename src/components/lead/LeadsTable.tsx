import { useState } from "react";
import { Lead } from "@/hooks/useLeads";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Mail, Phone } from "lucide-react";
import { format } from "date-fns";

interface LeadsTableProps {
  leads: Lead[];
  onViewDetails: (lead: Lead) => void;
}

const statusColors = {
  new: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  contacted: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
  qualified: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
  converted: "bg-green-500/10 text-green-700 dark:text-green-300",
  rejected: "bg-red-500/10 text-red-700 dark:text-red-300",
};

const statusLabels = {
  new: "Ny",
  contacted: "Kontaktad",
  qualified: "Kvalificerad",
  converted: "Konverterad",
  rejected: "Avvisad",
};

export function LeadsTable({ leads, onViewDetails }: LeadsTableProps) {
  if (leads.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Inga leads att visa än</p>
        <p className="text-sm mt-2">Skapa en lead-sökning för att komma igång</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Företag</TableHead>
            <TableHead>Kontakt</TableHead>
            <TableHead>Bransch</TableHead>
            <TableHead>Plats</TableHead>
            <TableHead>AI Score</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Skapad</TableHead>
            <TableHead className="text-right">Åtgärder</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id} className="cursor-pointer hover:bg-muted/50">
              <TableCell className="font-medium">{lead.company_name}</TableCell>
              <TableCell>
                <div className="text-sm">
                  {lead.contact_person && <div>{lead.contact_person}</div>}
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
                </div>
              </TableCell>
              <TableCell>{lead.industry || "-"}</TableCell>
              <TableCell>{lead.location || "-"}</TableCell>
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}