import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Plus, Settings } from "lucide-react";
import { useLeadSearches } from "@/hooks/useLeadSearches";
import { useLeads, Lead } from "@/hooks/useLeads";
import { LeadSearchForm } from "@/components/lead/LeadSearchForm";
import { LeadsTable } from "@/components/lead/LeadsTable";
import { LeadDetailModal } from "@/components/lead/LeadDetailModal";
import { LeadSearchList } from "@/components/lead/LeadSearchList";

export function LeadSection() {
  const { searches, loading: searchesLoading, createSearch, pauseSearch, resumeSearch, deleteSearch } = useLeadSearches();
  const { leads, stats, loading: leadsLoading, updateLead } = useLeads();
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadDetail, setShowLeadDetail] = useState(false);

  const statCards = [
    {
      title: "Totalt Leads",
      value: stats.totalLeads,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Nya",
      value: stats.newLeads,
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Kontaktade",
      value: stats.contacted,
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Konverteringar",
      value: stats.conversions,
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
  ];

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setShowLeadDetail(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Prospektering (Lead)</h2>
          <p className="text-muted-foreground">Hitta och hantera leads med AI</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowSearchForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ny lead-sökning
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Inställningar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {searches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Aktiva sökningar</CardTitle>
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

      <Card>
        <CardHeader>
          <CardTitle>Alla Leads</CardTitle>
          <CardDescription>
            {stats.totalLeads} totalt
          </CardDescription>
        </CardHeader>
        <CardContent>
          {leadsLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Laddar leads...
            </div>
          ) : (
            <LeadsTable leads={leads} onViewDetails={handleViewDetails} />
          )}
        </CardContent>
      </Card>

      <LeadSearchForm
        open={showSearchForm}
        onOpenChange={setShowSearchForm}
        onSubmit={async (data) => {
          await createSearch(data);
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
}