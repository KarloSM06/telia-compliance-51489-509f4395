import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, List, LayoutGrid } from "lucide-react";
import eniroLogo from "@/assets/eniro-logo.png";
import linkedinLogo from "@/assets/linkedin-logo.png";
import anthropicLogo from "@/assets/anthropic-logo.png";

interface LeadPageHeaderProps {
  provider: 'eniro' | 'linkedin';
  onProviderChange: (provider: 'eniro' | 'linkedin') => void;
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
  provider,
  onProviderChange,
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
            <h1 className="text-2xl font-bold">Lead Management & AI Prospektering</h1>
            <p className="text-sm text-muted-foreground">
              Hitta och hantera leads från flera källor med AI-assistans
            </p>
          </div>
          <div className="flex gap-2 items-center">
            {/* Provider Selector */}
            <div className="flex gap-1 border rounded-lg p-1 bg-muted/50">
              <Button
                variant={provider === 'eniro' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onProviderChange('eniro')}
                className="gap-2"
              >
                <img src={eniroLogo} alt="Eniro" className="h-4 w-4 rounded" />
                Eniro
              </Button>
              <Button
                variant={provider === 'linkedin' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onProviderChange('linkedin')}
                className="gap-2"
              >
                <div className="flex items-center gap-1">
                  <img src={linkedinLogo} alt="LinkedIn" className="h-4 w-4 rounded" />
                  <span className="text-xs text-muted-foreground">×</span>
                  <img src={anthropicLogo} alt="AI" className="h-4 w-4 rounded" />
                </div>
                AI Chat
              </Button>
            </div>

            {/* View Selector - only for Eniro */}
            {provider === 'eniro' && onViewChange && (
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

            {/* New Search Button - only for Eniro */}
            {provider === 'eniro' && onNewSearch && (
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
