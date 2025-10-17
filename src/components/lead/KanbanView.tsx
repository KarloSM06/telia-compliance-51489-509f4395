import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lead } from "@/hooks/useLeads";
import { LeadCard } from "./LeadCard";

interface KanbanViewProps {
  leads: Lead[];
  onViewDetails: (lead: Lead) => void;
}

export function KanbanView({ leads, onViewDetails }: KanbanViewProps) {
  const columns = [
    { status: 'new', title: 'Nya', color: 'border-t-green-500' },
    { status: 'contacted', title: 'Kontaktade', color: 'border-t-blue-500' },
    { status: 'qualified', title: 'Kvalificerade', color: 'border-t-purple-500' },
    { status: 'converted', title: 'Konverterade', color: 'border-t-orange-500' },
    { status: 'lost', title: 'Förlorade', color: 'border-t-gray-500' },
  ];

  const getLeadsByStatus = (status: string) => {
    return leads.filter(lead => lead.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {columns.map((column) => {
        const columnLeads = getLeadsByStatus(column.status);
        
        return (
          <Card key={column.status} className={`border-t-4 ${column.color}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                {column.title}
                <span className="text-xs font-normal bg-muted px-2 py-1 rounded-full">
                  {columnLeads.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {columnLeads.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">
                  Inga leads
                </p>
              ) : (
                columnLeads.map((lead) => (
                  <LeadCard 
                    key={lead.id} 
                    lead={lead} 
                    onViewDetails={onViewDetails}
                  />
                ))
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
