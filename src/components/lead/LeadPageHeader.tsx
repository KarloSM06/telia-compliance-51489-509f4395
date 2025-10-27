import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MessageSquare, ListChecks } from "lucide-react";

interface LeadPageHeaderProps {
  activeTab: 'eniro' | 'linkedin' | 'lists';
  onTabChange: (tab: 'eniro' | 'linkedin' | 'lists') => void;
  stats: {
    totalLeads: number;
    contacted: number;
    conversions: number;
    newLeads: number;
    enrichedLeads: number;
    avgAiScore: number;
  };
}

export function LeadPageHeader({ 
  activeTab,
  onTabChange,
  stats,
}: LeadPageHeaderProps) {
  return (
    <div className="border-b bg-background">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Lead Management</h1>
            <p className="text-muted-foreground">Hantera och spåra dina leads</p>
          </div>
        </div>

        {/* Tabs and Stats Row */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={onTabChange} className="w-auto">
            <TabsList>
              <TabsTrigger value="eniro" className="gap-2">
                <Search className="h-4 w-4" />
                Eniro
              </TabsTrigger>
              <TabsTrigger value="linkedin" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                LinkedIn AI
              </TabsTrigger>
              <TabsTrigger value="lists" className="gap-2">
                <ListChecks className="h-4 w-4" />
                Listor
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Stats */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary">
              Totalt: {stats.totalLeads}
            </Badge>
            <Badge variant="secondary">
              Nya: {stats.newLeads}
            </Badge>
            <Badge variant="secondary">
              Berikade: {stats.enrichedLeads}
            </Badge>
            <Badge variant="secondary">
              Konverteringar: {stats.conversions}
            </Badge>
            {stats.avgAiScore > 0 && (
              <Badge variant="secondary">
                Snitt AI-score: {stats.avgAiScore}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
