import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PremiumCard, PremiumCardContent, PremiumCardHeader, PremiumCardTitle, PremiumCardDescription } from "@/components/ui/premium-card";
import { PremiumHeader } from "@/components/ui/premium-header";
import { PremiumStatCard } from "@/components/ui/premium-stat-card";
import { SectionSeparator } from "@/components/ui/section-separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrganization } from "@/hooks/useOrganization";
import { Building2, Save, Users, DollarSign, TrendingUp, Calendar, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ROISettings } from "@/components/settings/ROISettings";

const CompanyProfile = () => {
  const [searchParams] = useSearchParams();
  const { organization, isLoading, createOrganization, updateOrganization, isCreating, isUpdating } = useOrganization();
  const [formData, setFormData] = useState({
    name: organization?.name || '',
  });
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "company");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (organization) {
      updateOrganization({ name: formData.name });
    } else {
      createOrganization(formData.name);
    }
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
        <div className="relative z-10 container mx-auto p-6 max-w-6xl">
          <Skeleton className="h-12 w-80 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      
      <div className="relative z-10 container mx-auto p-6 max-w-6xl space-y-8">
        <PremiumHeader
          icon={<Building2 className="h-8 w-8 text-primary" />}
          title="Företagsprofil"
          subtitle="Hantera företagsinformation, ROI-inställningar och teammedlemmar"
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-flex bg-muted/50 backdrop-blur-sm">
            <TabsTrigger value="company" className="gap-2">
              <Building2 className="h-4 w-4" />
              <span>Företag</span>
            </TabsTrigger>
            <TabsTrigger value="roi" className="gap-2">
              <DollarSign className="h-4 w-4" />
              <span>ROI-inställningar</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="company" className="space-y-6 animate-enter">
            {/* Company Statistics */}
            {organization && (
              <>
                <div className="grid gap-4 md:grid-cols-3 animate-fade-in">
                  <PremiumStatCard
                    title="Antal Medlemmar"
                    value={organization.max_members}
                    icon={<Users className="h-5 w-5" />}
                  />
                  <PremiumStatCard
                    title="Plan"
                    value={organization.plan_type.toUpperCase()}
                    icon={<TrendingUp className="h-5 w-5" />}
                  />
                  <PremiumStatCard
                    title="Medlem Sedan"
                    value={new Date(organization.created_at).toLocaleDateString('sv-SE', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                    icon={<Calendar className="h-5 w-5" />}
                  />
                </div>

                <SectionSeparator />
              </>
            )}

            {/* Company Information Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <PremiumCard className="animate-scale-in">
                <PremiumCardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <PremiumCardTitle>Företagsinformation</PremiumCardTitle>
                      <PremiumCardDescription>
                        Grundläggande information om ditt företag
                      </PremiumCardDescription>
                    </div>
                  </div>
                </PremiumCardHeader>
                <PremiumCardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Företagsnamn</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ange företagsnamn"
                        required
                        className="text-lg"
                      />
                    </div>

                    {organization && (
                      <>
                        <SectionSeparator />
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Plan</Label>
                            <div>
                              <Badge variant="secondary" className="text-sm px-3 py-1">
                                {organization.plan_type.toUpperCase()}
                              </Badge>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="h-4 w-4" />
                              Max antal medlemmar
                            </Label>
                            <div className="text-2xl font-bold">
                              {organization.max_members}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Skapad</Label>
                          <div className="text-sm">
                            {new Date(organization.created_at).toLocaleDateString('sv-SE', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isCreating || isUpdating || !formData.name}
                    className="w-full sm:w-auto"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {organization ? 'Spara ändringar' : 'Skapa företag'}
                  </Button>
                </PremiumCardContent>
              </PremiumCard>

              {!organization && (
                <PremiumCard className="border-blue-200 bg-gradient-to-br from-blue-50/50 to-blue-100/30 animate-scale-in" style={{ animationDelay: '100ms' }}>
                  <PremiumCardHeader>
                    <PremiumCardTitle className="text-blue-900">Välkommen!</PremiumCardTitle>
                    <PremiumCardDescription className="text-blue-700">
                      Skapa ditt företag för att komma igång med att hantera bokningar, meddelanden och team.
                    </PremiumCardDescription>
                  </PremiumCardHeader>
                </PremiumCard>
              )}
            </form>
          </TabsContent>

          <TabsContent value="roi" className="animate-enter">
            <ROISettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CompanyProfile;
