import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LayoutGrid, Table as TableIcon, Building2, User } from "lucide-react";
import { Lead, useLeads } from "@/hooks/useLeads";
import { LeadsTable } from "@/components/lead/LeadsTable";
import { KanbanView } from "@/components/lead/KanbanView";
import { LeadDetailModal } from "@/components/lead/LeadDetailModal";

type ListType = 'organizations' | 'contacts';
type LeadType = 'all' | 'brf' | 'business';

export const LeadsListTab = () => {
  const [listType, setListType] = useState<ListType>('organizations');
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [leadType, setLeadType] = useState<LeadType>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { leads, updateLead } = useLeads();

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDetailModal(true);
  };

  // Filter leads based on listType
  const filteredByListType = listType === 'contacts' 
    ? leads.filter(lead => lead.contact_person && lead.contact_person.trim() !== '')
    : leads;

  // Filter by lead type
  const filteredLeads = leadType === 'all' 
    ? filteredByListType 
    : filteredByListType.filter(lead => lead.lead_type === leadType);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card className="border-b">
        <div className="p-4 space-y-4">
          {/* List Type and View Toggle */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant={listType === 'organizations' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setListType('organizations')}
                className="gap-2"
              >
                <Building2 className="h-4 w-4" />
                Organisationer
              </Button>
              <Button
                variant={listType === 'contacts' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setListType('contacts')}
                className="gap-2"
              >
                <User className="h-4 w-4" />
                Kontaktpersoner
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={view === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('table')}
              >
                <TableIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={view === 'kanban' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('kanban')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Lead Type Tabs */}
          <Tabs value={leadType} onValueChange={(v) => setLeadType(v as LeadType)} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="all">
                Alla
                <Badge variant="secondary" className="ml-2">
                  {filteredByListType.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="business">
                Företag
                <Badge variant="secondary" className="ml-2">
                  {filteredByListType.filter(l => l.lead_type === 'business').length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="brf">
                BRF
                <Badge variant="secondary" className="ml-2">
                  {filteredByListType.filter(l => l.lead_type === 'brf').length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </Card>

      {/* Content */}
      {filteredLeads.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="space-y-3">
            <div className="text-muted-foreground">
              {leads.length === 0 ? (
                <>
                  <p className="text-lg font-medium">Inga leads än</p>
                  <p className="text-sm mt-2">
                    Skapa leads genom att använda Eniro-sökning eller LinkedIn AI-chatten
                  </p>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium">Inga leads matchar filtren</p>
                  <p className="text-sm mt-2">
                    Prova att ändra dina filterinställningar
                  </p>
                </>
              )}
            </div>
          </div>
        </Card>
      ) : (
        <div>
          {view === 'table' ? (
            <LeadsTable leads={filteredLeads} onViewDetails={handleViewDetails} />
          ) : (
            <KanbanView leads={filteredLeads} onViewDetails={handleViewDetails} />
          )}
        </div>
      )}

      {/* Detail Modal */}
      <LeadDetailModal
        lead={selectedLead}
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        onUpdate={updateLead}
      />
    </div>
  );
};
