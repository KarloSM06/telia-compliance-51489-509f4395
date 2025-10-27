import { useState } from "react";
import { LeadPageHeader } from "@/components/lead/LeadPageHeader";
import { LeadStats } from "@/components/lead/LeadStats";
import { EniroLeadsContent } from "@/components/lead/eniro/EniroLeadsContent";
import { LinkedInLeadsTab } from "@/components/lead/providers/LinkedInLeadsTab";
import { useLeads } from "@/hooks/useLeads";
import { LeadWizard } from "@/components/lead/LeadWizard";
import { useLeadSearches } from "@/hooks/useLeadSearches";

export function LeadSection() {
  const [provider, setProvider] = useState<'eniro' | 'linkedin'>('eniro');
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [showSearchForm, setShowSearchForm] = useState(false);
  
  const { stats } = useLeads();
  const { createSearch } = useLeadSearches();

  return (
    <div className="h-screen flex flex-col">
      {/* Global Header */}
      <LeadPageHeader
        provider={provider}
        onProviderChange={setProvider}
        view={view}
        onViewChange={setView}
        stats={stats}
        onNewSearch={() => setShowSearchForm(true)}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-4 space-y-6">
          {/* Compact Stats */}
          <LeadStats stats={stats} compact />

          {/* Provider Content */}
          {provider === 'eniro' && <EniroLeadsContent view={view} />}
          {provider === 'linkedin' && <LinkedInLeadsTab />}
        </div>
      </div>

      {/* Search Modal */}
      <LeadWizard 
        open={showSearchForm} 
        onOpenChange={setShowSearchForm} 
        onSubmit={async (data) => {
          await createSearch({ ...data, provider: 'eniro' } as any);
          setShowSearchForm(false);
        }} 
      />
    </div>
  );
}