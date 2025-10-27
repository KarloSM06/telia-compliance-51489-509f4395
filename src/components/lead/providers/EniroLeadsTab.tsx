import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, List, LayoutGrid, Home, Building } from "lucide-react";
import { useLeadSearches } from "@/hooks/useLeadSearches";
import { useLeads, Lead } from "@/hooks/useLeads";
import { useEnrichLead } from "@/hooks/useEnrichLead";
import { LeadDetailModal } from "@/components/lead/LeadDetailModal";
import { LeadSearchList } from "@/components/lead/LeadSearchList";
import { LeadWizard } from "@/components/lead/LeadWizard";
import { LeadStats } from "@/components/lead/LeadStats";
import { KanbanView } from "@/components/lead/KanbanView";
import { LeadsTable } from "@/components/lead/LeadsTable";
import eniroLogo from "@/assets/eniro-logo.png";

export const EniroLeadsTab = () => {
  const { bulkEnrichLeads, isEnriching: isBulkEnriching, bulkProgress } = useEnrichLead();
  const {
    searches,
    loading: searchesLoading,
    createSearch,
    pauseSearch,
    resumeSearch,
    deleteSearch
  } = useLeadSearches();
  const {
    leads,
    stats,
    loading: leadsLoading,
    updateLead
  } = useLeads();

  const [showSearchForm, setShowSearchForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadDetail, setShowLeadDetail] = useState(false);
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [leadTypeFilter, setLeadTypeFilter] = useState<'all' | 'brf' | 'business'>('all');

  // Filter by provider and lead type
  const eniroLeads = leads.filter(lead => lead.provider === 'eniro' || !lead.provider);
  const filteredLeads = leadTypeFilter === 'all' 
    ? eniroLeads 
    : eniroLeads.filter(lead => lead.lead_type === leadTypeFilter);

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setShowLeadDetail(true);
  };

  const handleBulkEnrich = async () => {
    const newLeads = filteredLeads.filter(lead => lead.status === 'new');
    const newLeadIds = newLeads.map(lead => lead.id);
    await bulkEnrichLeads(newLeadIds);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <LeadStats stats={stats} />

      {/* Active Searches */}
      {searches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Aktiva Eniro-sökningar</CardTitle>
            <CardDescription>Dina pågående lead-sökningar</CardDescription>
          </CardHeader>
          <CardContent>
            <LeadSearchList 
              searches={searches} 
              onPause={pauseSearch} 
              onResume={resumeSearch} 
              onDelete={deleteSearch} 
            />
          </CardContent>
        </Card>
      )}

      {/* Leads Section with Tabs and Views */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={eniroLogo} alt="Eniro" className="h-10 w-10 rounded-lg" />
              <div>
                <CardTitle>Eniro Leads</CardTitle>
                <CardDescription>
                  {filteredLeads.length} leads
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowSearchForm(true)}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ny sökning
              </Button>
              <Button 
                variant={view === 'table' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setView('table')}
              >
                <List className="h-4 w-4 mr-2" />
                Tabell
              </Button>
              <Button 
                variant={view === 'kanban' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setView('kanban')}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Kanban
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={leadTypeFilter} onValueChange={(v) => setLeadTypeFilter(v as any)} className="mb-6">
            <TabsList className="grid w-full grid-cols-3 h-12">
              <TabsTrigger value="all" className="text-sm">
                <Building className="h-4 w-4 mr-2" />
                Alla Leads
              </TabsTrigger>
              <TabsTrigger value="brf" className="text-sm">
                <Home className="h-4 w-4 mr-2" />
                Bostadsrättsföreningar
              </TabsTrigger>
              <TabsTrigger value="business" className="text-sm">
                <Building className="h-4 w-4 mr-2" />
                Företag
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {leadsLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Laddar leads...
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/10 mb-4">
                <Building className="h-10 w-10 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Inga Eniro-leads än</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Skapa din första Eniro-sökning och låt systemet hitta perfekta leads åt dig
              </p>
              <Button size="lg" onClick={() => setShowSearchForm(true)} className="bg-yellow-600 hover:bg-yellow-700">
                <Plus className="mr-2" />
                Skapa första sökningen
              </Button>
            </div>
          ) : view === 'kanban' ? (
            <KanbanView leads={filteredLeads} onViewDetails={handleViewDetails} />
          ) : (
            <LeadsTable 
              leads={filteredLeads} 
              onViewDetails={handleViewDetails}
              onBulkEnrich={handleBulkEnrich}
              isBulkEnriching={isBulkEnriching}
              bulkProgress={bulkProgress}
            />
          )}
        </CardContent>
      </Card>

      <LeadWizard 
        open={showSearchForm} 
        onOpenChange={setShowSearchForm} 
        onSubmit={async (data) => {
          await createSearch({ ...data, provider: 'eniro' } as any);
          setShowSearchForm(false);
        }} 
      />

      <LeadDetailModal 
        lead={selectedLead} 
        open={showLeadDetail} 
        onOpenChange={setShowLeadDetail} 
        onUpdate={updateLead} 
      />
    </div>
  );
};
