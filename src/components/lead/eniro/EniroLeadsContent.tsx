import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Building } from "lucide-react";
import { useLeadSearches } from "@/hooks/useLeadSearches";
import { useLeads, Lead } from "@/hooks/useLeads";
import { useEnrichLead } from "@/hooks/useEnrichLead";
import { LeadDetailModal } from "@/components/lead/LeadDetailModal";
import { LeadSearchList } from "@/components/lead/LeadSearchList";
import { LeadWizard } from "@/components/lead/LeadWizard";
import { KanbanView } from "@/components/lead/KanbanView";
import { LeadsTable } from "@/components/lead/LeadsTable";

interface EniroLeadsContentProps {
  view: 'table' | 'kanban';
  listType: 'organizations' | 'contacts';
}

export const EniroLeadsContent = ({ view, listType }: EniroLeadsContentProps) => {
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
    loading: leadsLoading,
    updateLead
  } = useLeads();

  const [showSearchForm, setShowSearchForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadDetail, setShowLeadDetail] = useState(false);
  const [leadTypeFilter, setLeadTypeFilter] = useState<'all' | 'brf' | 'business'>('all');

  // Filter by list type and lead type
  const allLeads = leads.filter(lead => {
    if (listType === 'contacts') {
      // Only show leads with contact person
      return lead.contact_person && lead.contact_person.trim() !== '';
    }
    return true; // Show all for organizations
  });
  
  const filteredLeads = leadTypeFilter === 'all' 
    ? allLeads 
    : allLeads.filter(lead => lead.lead_type === leadTypeFilter);

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
      {/* Active Searches */}
      {searches.length > 0 && (
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Aktiva Eniro-sökningar</CardTitle>
            <CardDescription>Dina pågående lead-sökningar</CardDescription>
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

      {/* Leads Section with Tabs */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {listType === 'organizations' ? 'Organisationer' : 'Kontaktpersoner'}
              </CardTitle>
              <CardDescription>
                {filteredLeads.length} {listType === 'organizations' ? 'organisationer' : 'kontaktpersoner'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={leadTypeFilter} onValueChange={(v) => setLeadTypeFilter(v as any)} className="mb-6">
            <TabsList className="grid w-full grid-cols-3 h-12">
              <TabsTrigger value="all" className="text-sm gap-2">
                <Building className="h-4 w-4" />
                Alla Leads
              </TabsTrigger>
              <TabsTrigger value="brf" className="text-sm gap-2">
                <Home className="h-4 w-4" />
                Bostadsrättsföreningar
              </TabsTrigger>
              <TabsTrigger value="business" className="text-sm gap-2">
                <Building className="h-4 w-4" />
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
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Building className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {listType === 'organizations' ? 'Inga organisationer än' : 'Inga kontaktpersoner än'}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                {listType === 'organizations' 
                  ? 'Skapa din första sökning för att hitta organisationer'
                  : 'Inga leads med kontaktpersoner hittades. Berika dina leads för att få kontaktinformation.'}
              </p>
              <Button size="lg" onClick={() => setShowSearchForm(true)} className="bg-yellow-600 hover:bg-yellow-700">
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
