import { useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useLeadSearches } from "@/hooks/useLeadSearches";
import { Lead } from "@/hooks/useLeads";
import { ListChecks, Loader2 } from "lucide-react";

interface LeadListSelectorProps {
  leads: Lead[];
  selectedSearchId: string | null;
  onSelectSearch: (searchId: string | null) => void;
}

export const LeadListSelector = ({ leads, selectedSearchId, onSelectSearch }: LeadListSelectorProps) => {
  const { searches, loading } = useLeadSearches();

  // Calculate lead count per search
  const searchLeadCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach(lead => {
      if (lead.search_id) {
        counts[lead.search_id] = (counts[lead.search_id] || 0) + 1;
      }
    });
    return counts;
  }, [leads]);

  const ungroupedCount = leads.filter(lead => !lead.search_id).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'paused':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'completed':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      default:
        return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktiv';
      case 'paused':
        return 'Pausad';
      case 'completed':
        return 'Klar';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Laddar listor...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <ListChecks className="h-5 w-5 text-muted-foreground" />
      <Select
        value={selectedSearchId || "all"}
        onValueChange={(value) => onSelectSearch(value === "all" ? null : value)}
      >
        <SelectTrigger className="w-[300px] bg-background">
          <SelectValue placeholder="Välj lista" />
        </SelectTrigger>
        <SelectContent className="bg-background z-50">
          <SelectItem value="all">
            <div className="flex items-center justify-between gap-3 w-full">
              <span className="font-medium">🌐 Alla leads</span>
              <Badge variant="secondary" className="ml-auto">
                {leads.length}
              </Badge>
            </div>
          </SelectItem>
          
          {ungroupedCount > 0 && (
            <SelectItem value="ungrouped">
              <div className="flex items-center justify-between gap-3 w-full">
                <span className="text-muted-foreground">📋 Ogrupperade</span>
                <Badge variant="outline" className="ml-auto">
                  {ungroupedCount}
                </Badge>
              </div>
            </SelectItem>
          )}

          {searches.length > 0 && searches.map((search) => {
            const count = searchLeadCounts[search.id] || 0;
            return (
              <SelectItem key={search.id} value={search.id}>
                <div className="flex items-center justify-between gap-3 w-full">
                  <div className="flex items-center gap-2">
                    <span>📋 {search.search_name}</span>
                    <Badge 
                      variant="secondary" 
                      className={getStatusColor(search.status)}
                    >
                      {getStatusText(search.status)}
                    </Badge>
                  </div>
                  <Badge variant="secondary" className="ml-auto">
                    {count}
                  </Badge>
                </div>
              </SelectItem>
            );
          })}

          {searches.length === 0 && ungroupedCount === 0 && (
            <div className="px-2 py-4 text-sm text-center text-muted-foreground">
              Inga sökningar än
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
