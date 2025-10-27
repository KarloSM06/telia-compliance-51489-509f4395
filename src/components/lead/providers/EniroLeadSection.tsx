import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Sparkles } from "lucide-react";
import { LeadWizard } from "../LeadWizard";
import { LeadDetailModal } from "../LeadDetailModal";
import { LeadSearchList } from "../LeadSearchList";
import { LeadStats } from "../LeadStats";
import { KanbanView } from "../KanbanView";
import { LeadsTable } from "../LeadsTable";
import { useEnrichLead } from "@/hooks/useEnrichLead";
import { useLeadSearches } from "@/hooks/useLeadSearches";
import { useLeads } from "@/hooks/useLeads";
import { toast } from "sonner";
import eniroLogo from "@/assets/eniro-logo.png";

type ViewMode = 'kanban' | 'table';
type LeadFilter = 'all' | 'brf' | 'business';

export function EniroLeadSection() {
  const [showWizard, setShowWizard] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [viewMode] = useState<ViewMode>('kanban');
  const [leadFilter, setLeadFilter] = useState<LeadFilter>('all');

  const { enrichLead, isEnriching } = useEnrichLead();
  const { searches, loading: searchesLoading, createSearch, deleteSearch, pauseSearch, resumeSearch } = useLeadSearches('eniro');
  const { leads, loading: leadsLoading, stats, updateLead, deleteLead } = useLeads('eniro');

  const handleViewDetails = (lead: any) => {
    setSelectedLead(lead);
  };

  const handleBulkEnrich = async (leadIds: string[]) => {
    toast.info(`Berikar ${leadIds.length} leads...`);
    for (const leadId of leadIds) {
      await enrichLead(leadId);
    }
  };

  const handleCreateSearch = async (data: any) => {
    await createSearch({ ...data, provider: 'eniro' });
    setShowWizard(false);
  };

  const filteredLeads = leads.filter(lead => {
    if (leadFilter === 'all') return true;
    return lead.lead_type === leadFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-[#FFD700]/5 to-background animate-fade-in">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#2C3E50] py-12 px-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                <img src={eniroLogo} alt="Eniro" className="h-14 w-14 object-contain" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Leta med Eniro</h1>
                <p className="text-[#2C3E50]/80 text-lg">Traditionell företagsdata och BRF-prospektering</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowWizard(true)}
              size="lg"
              className="bg-[#2C3E50] hover:bg-[#1a252f] text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="mr-2 h-5 w-5" />
              Ny sökning
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Stats */}
        <LeadStats stats={stats} />

        {/* Active Searches */}
        {searches.length > 0 && (
          <Card className="border-2 border-[#FFD700]/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-[#FFD700]/10 to-transparent">
              <CardTitle className="flex items-center gap-2 text-[#2C3E50]">
                <Search className="h-5 w-5 text-[#FFA500]" />
                Aktiva sökningar
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <LeadSearchList
                searches={searches}
                onPause={pauseSearch}
                onResume={resumeSearch}
                onDelete={deleteSearch}
              />
            </CardContent>
          </Card>
        )}

        {/* Leads */}
        <Card className="border-2 border-[#FFD700]/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#FFD700]/10 to-transparent">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-[#2C3E50]">
                <Sparkles className="h-5 w-5 text-[#FFA500]" />
                Leads
              </CardTitle>
              <Tabs value={leadFilter} onValueChange={(v) => setLeadFilter(v as LeadFilter)}>
                <TabsList className="bg-[#FFD700]/20">
                  <TabsTrigger value="all">Alla</TabsTrigger>
                  <TabsTrigger value="brf">BRF</TabsTrigger>
                  <TabsTrigger value="business">Företag</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {leadsLoading ? (
              <div className="text-center py-12 text-muted-foreground">Laddar leads...</div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Inga leads än. Skapa en sökning för att komma igång!</p>
                <Button onClick={() => setShowWizard(true)} variant="outline" className="border-[#FFD700]">
                  <Plus className="mr-2 h-4 w-4" />
                  Skapa sökning
                </Button>
              </div>
            ) : (
              viewMode === 'kanban' ? (
                <KanbanView
                  leads={filteredLeads}
                  onViewDetails={handleViewDetails}
                />
              ) : (
                <LeadsTable
                  leads={filteredLeads}
                  onViewDetails={handleViewDetails}
                />
              )
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <LeadWizard
        open={showWizard}
        onOpenChange={setShowWizard}
        onSubmit={handleCreateSearch}
        isSubmitting={searchesLoading}
      />

      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          open={!!selectedLead}
          onOpenChange={(open) => !open && setSelectedLead(null)}
          onUpdate={updateLead}
        />
      )}
    </div>
  );
}
