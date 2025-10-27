import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useOrganization } from "@/hooks/useOrganization";
import { Building2, Save, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const CompanyProfile = () => {
  const { organization, isLoading, createOrganization, updateOrganization, isCreating, isUpdating } = useOrganization();
  const [formData, setFormData] = useState({
    name: organization?.name || '',
  });

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
      <div className="container mx-auto p-6 max-w-4xl">
        <Skeleton className="h-10 w-64 mb-6" />
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Building2 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Företagsprofil</h1>
          <p className="text-muted-foreground">
            Hantera ditt företags information och inställningar
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Företagsinformation</CardTitle>
            <CardDescription>
              Grundläggande information om ditt företag
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Företagsnamn</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ange företagsnamn"
                required
              />
            </div>

            {organization && (
              <>
                <div className="space-y-2">
                  <Label>Plan</Label>
                  <div>
                    <Badge variant="secondary" className="text-sm">
                      {organization.plan_type.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Max antal medlemmar
                  </Label>
                  <div className="text-2xl font-bold">
                    {organization.max_members}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Skapad</Label>
                  <div className="text-sm text-muted-foreground">
                    {new Date(organization.created_at).toLocaleDateString('sv-SE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </>
            )}

            <Button 
              type="submit" 
              disabled={isCreating || isUpdating || !formData.name}
              className="w-full sm:w-auto"
            >
              <Save className="h-4 w-4 mr-2" />
              {organization ? 'Spara ändringar' : 'Skapa företag'}
            </Button>
          </CardContent>
        </Card>

        {!organization && (
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-blue-900">Välkommen!</CardTitle>
              <CardDescription className="text-blue-700">
                Skapa ditt företag för att komma igång med att hantera bokningar, meddelanden och team.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </form>
    </div>
  );
};

export default CompanyProfile;
