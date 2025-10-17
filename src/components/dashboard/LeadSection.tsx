import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Settings, Sparkles, BookOpen, List, LayoutGrid, Home, Building } from "lucide-react";
import { useLeadSearches } from "@/hooks/useLeadSearches";
import { useLeads, Lead } from "@/hooks/useLeads";
import { LeadDetailModal } from "@/components/lead/LeadDetailModal";
import { LeadSearchList } from "@/components/lead/LeadSearchList";
import { LeadWizard } from "@/components/lead/LeadWizard";
import { LeadStats } from "@/components/lead/LeadStats";
import { KanbanView } from "@/components/lead/KanbanView";
import { LeadsTable } from "@/components/lead/LeadsTable";
export function LeadSection() {
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
  const filteredLeads = leadTypeFilter === 'all' ? leads : leads.filter(lead => lead.lead_type === leadTypeFilter);
  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setShowLeadDetail(true);
  };
  return <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Hitta dina drömkunder</h1>
          <p className="text-lg opacity-90 mb-6">AI-driven prospektering</p>
          <div className="flex gap-3">
            <Button size="lg" variant="secondary" onClick={() => setShowSearchForm(true)}>
              <Sparkles className="h-5 w-5 mr-2" />
              Ny sökning
            </Button>
            <Button size="lg" variant="outline" className="border-primary/30 text-primary-foreground hover:bg-primary/20">
              <BookOpen className="h-5 w-5 mr-2" />
              Visa guiden
            </Button>
          </div>
        </div>
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]" />
      </div>

      {/* Stats Cards */}
      <LeadStats stats={stats} />

      {/* Active Searches */}
      {searches.length > 0 && <Card>
          <CardHeader>
            <CardTitle>Aktiva sökningar</CardTitle>
            <CardDescription>Dina pågående lead-sökningar</CardDescription>
          </CardHeader>
          <CardContent>
            <LeadSearchList searches={searches} onPause={pauseSearch} onResume={resumeSearch} onDelete={deleteSearch} />
          </CardContent>
        </Card>}

      {/* Leads Section with Tabs and Views */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Alla Leads</CardTitle>
              <CardDescription>
                {stats.totalLeads} totalt
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant={view === 'table' ? 'default' : 'outline'} size="sm" onClick={() => setView('table')}>
                <List className="h-4 w-4 mr-2" />
                Tabell
              </Button>
              <Button variant={view === 'kanban' ? 'default' : 'outline'} size="sm" onClick={() => setView('kanban')}>
                <LayoutGrid className="h-4 w-4 mr-2" />
                Kanban
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={leadTypeFilter} onValueChange={v => setLeadTypeFilter(v as any)} className="mb-6">
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

          {leadsLoading ? <div className="text-center py-8 text-muted-foreground">
              Laddar leads...
            </div> : filteredLeads.length === 0 ? <div className="text-center py-16">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/10 mb-4">
                <Sparkles className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Inga leads än</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Skapa din första AI-driven sökning och låt systemet hitta perfekta leads åt dig
              </p>
              <Button size="lg" onClick={() => setShowSearchForm(true)}>
                <Plus className="mr-2" />
                Skapa första sökningen
              </Button>
            </div> : view === 'kanban' ? <KanbanView leads={filteredLeads} onViewDetails={handleViewDetails} /> : <LeadsTable leads={filteredLeads} onViewDetails={handleViewDetails} />}
        </CardContent>
      </Card>

      <LeadWizard open={showSearchForm} onOpenChange={setShowSearchForm} onSubmit={async data => {
      await createSearch(data);
      setShowSearchForm(false);
    }} />

      <LeadDetailModal lead={selectedLead} open={showLeadDetail} onOpenChange={setShowLeadDetail} onUpdate={updateLead} />
    </div>;
}