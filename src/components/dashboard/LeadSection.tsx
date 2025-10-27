import { useState } from "react";
import { LeadPageHeader } from "@/components/lead/LeadPageHeader";
import { useLeads } from "@/hooks/useLeads";
import { EniroSearchTab } from "@/components/lead/tabs/EniroSearchTab";
import { LinkedInChatTab } from "@/components/lead/tabs/LinkedInChatTab";
import { LeadsListTab } from "@/components/lead/tabs/LeadsListTab";

type TabType = 'eniro' | 'linkedin' | 'lists';

export function LeadSection() {
  const [activeTab, setActiveTab] = useState<TabType>('eniro');
  const { stats } = useLeads();

  return (
    <div className="h-screen flex flex-col">
      {/* Global Header with Tabs */}
      <LeadPageHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        stats={stats}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-4">
          {activeTab === 'eniro' && <EniroSearchTab />}
          {activeTab === 'linkedin' && <LinkedInChatTab />}
          {activeTab === 'lists' && <LeadsListTab />}
        </div>
      </div>
    </div>
  );
}