import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { LeadWizard } from "@/components/lead/LeadWizard";
import { LeadSearchList } from "@/components/lead/LeadSearchList";
import { useLeadSearches } from "@/hooks/useLeadSearches";
import eniroLogo from "@/assets/eniro-logo-new.png";

export const EniroSearchTab = () => {
  const [showWizard, setShowWizard] = useState(false);
  const { searches, createSearch, pauseSearch, resumeSearch, deleteSearch } = useLeadSearches();

  const handleSubmit = async (data: any) => {
    await createSearch({ ...data, provider: 'eniro' });
    setShowWizard(false);
  };

  return (
    <div className="space-y-6">
      {/* Create Search Section */}
      <Card>
        <CardHeader className="border-b bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={eniroLogo} alt="Eniro" className="h-8 w-8 object-contain" />
              <div>
                <CardTitle className="text-xl">Eniro Lead Search</CardTitle>
                <CardDescription className="text-gray-800">
                  Sök efter företag och BRF:er i Eniro-databasen
                </CardDescription>
              </div>
            </div>
            <Button 
              onClick={() => setShowWizard(true)}
              size="lg"
              variant="secondary"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Ny sökning
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-muted/30 border rounded-lg p-4">
            <div className="space-y-2 text-sm">
              <p className="font-medium">Så här använder du Eniro-sökning:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Välj om du vill söka efter företag eller BRF:er</li>
                <li>Ange sökkriterier (bransch, plats, storlek, etc.)</li>
                <li>Systemet hittar och skapar automatiskt kvalificerade leads</li>
                <li>Alla leads hamnar i fliken "Listor" där du kan hantera dem</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Searches */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Aktiva sökningar</h3>
        <LeadSearchList
          searches={searches}
          onPause={pauseSearch}
          onResume={resumeSearch}
          onDelete={deleteSearch}
        />
      </div>

      {/* Wizard Modal */}
      <LeadWizard
        open={showWizard}
        onOpenChange={setShowWizard}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
