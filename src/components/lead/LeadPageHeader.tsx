import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, List, LayoutGrid, Building, Users } from "lucide-react";

interface LeadPageHeaderProps {
  listType: 'organizations' | 'contacts';
  onListTypeChange: (type: 'organizations' | 'contacts') => void;
  view?: 'table' | 'kanban';
  onViewChange?: (view: 'table' | 'kanban') => void;
  stats: {
    totalLeads: number;
    newLeads: number;
    enrichedLeads: number;
  };
  onNewSearch?: () => void;
}

export function LeadPageHeader({
  listType,
  onListTypeChange,
  view,
  onViewChange,
  stats,
  onNewSearch,
}: LeadPageHeaderProps) {
  return (
    <div className="border-b bg-background">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Lead Management</h1>
            <p className="text-sm text-muted-foreground">
              Hantera organisationer och kontaktpersoner
            </p>
          </div>
          <div className="flex gap-2 items-center">
            {/* List Type Selector */}
            <div className="flex gap-1 border rounded-lg p-1 bg-muted/50">
              <Button
                variant={listType === 'organizations' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onListTypeChange('organizations')}
                className="gap-2"
              >
                <Building className="h-4 w-4" />
                Organisationer
              </Button>
              <Button
                variant={listType === 'contacts' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onListTypeChange('contacts')}
                className="gap-2"
              >
                <Users className="h-4 w-4" />
                Kontaktpersoner
              </Button>
            </div>

            {/* View Selector */}
            {onViewChange && (
              <div className="flex gap-1 border rounded-lg p-1 bg-muted/50">
                <Button
                  variant={view === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewChange('table')}
                  className="gap-2"
                >
                  <List className="h-4 w-4" />
                  Tabell
                </Button>
                <Button
                  variant={view === 'kanban' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewChange('kanban')}
                  className="gap-2"
                >
                  <LayoutGrid className="h-4 w-4" />
                  Kanban
                </Button>
              </div>
            )}

            {/* Stats Badges */}
            <Badge variant="secondary">
              Totalt: {stats.totalLeads}
            </Badge>
            <Badge variant="secondary">
              Nya: {stats.newLeads}
            </Badge>
            {stats.enrichedLeads > 0 && (
              <Badge className="bg-emerald-500 hover:bg-emerald-600">
                AI-berikade: {stats.enrichedLeads}
              </Badge>
            )}

            {/* New Search Button */}
            {onNewSearch && (
              <Button onClick={onNewSearch} className="bg-yellow-600 hover:bg-yellow-700">
                <Plus className="h-4 w-4 mr-2" />
                Ny sökning
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
