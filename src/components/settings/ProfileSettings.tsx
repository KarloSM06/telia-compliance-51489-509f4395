import { PremiumCard, PremiumCardContent, PremiumCardDescription, PremiumCardHeader, PremiumCardTitle } from "@/components/ui/premium-card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Phone, Building2, Globe, MessageCircle, Languages } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserTimezone } from "@/hooks/useUserTimezone";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function ProfileSettings() {
  const { user } = useAuth();
  const { timezone, updateTimezone, loading: timezoneLoading } = useUserTimezone();
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [language, setLanguage] = useState("sv");
  const [defaultTone, setDefaultTone] = useState("friendly");
  const [localTimezone, setLocalTimezone] = useState(timezone);
  const [saving, setSaving] = useState(false);

  // Fetch user preferences from database
  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('preferred_language, default_tone')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching preferences:', error);
        return;
      }

      if (data) {
        if (data.preferred_language) setLanguage(data.preferred_language);
        if (data.default_tone) setDefaultTone(data.default_tone);
      }
    };

    fetchPreferences();
  }, [user]);

  // Update local timezone when it loads from the database
  useEffect(() => {
    if (!timezoneLoading) {
      setLocalTimezone(timezone);
    }
  }, [timezone, timezoneLoading]);

  const handleSaveRegionSettings = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      
      // Update timezone
      await updateTimezone(localTimezone);
      
      // Update language and tone
      const { error } = await supabase
        .from('profiles')
        .update({
          preferred_language: language,
          default_tone: defaultTone,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success("Inställningar har uppdaterats");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Kunde inte spara inställningar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PremiumCard className="hover-scale transition-all">
        <PremiumCardHeader className="animate-scale-in">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <PremiumCardTitle>Personlig Information</PremiumCardTitle>
              <PremiumCardDescription>
                Hantera din profilinformation och kontaktuppgifter
              </PremiumCardDescription>
            </div>
          </div>
        </PremiumCardHeader>
        <PremiumCardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Fullständigt Namn</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ditt namn"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-postadress</Label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-muted"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                E-postadressen kan inte ändras
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefonnummer</Label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+46 70 123 45 67"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Företag</Label>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="company"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Ditt företag"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button>Spara Ändringar</Button>
          </div>
        </PremiumCardContent>
      </PremiumCard>

      <PremiumCard className="hover-scale transition-all" style={{ animationDelay: '100ms' }}>
        <PremiumCardHeader className="animate-scale-in">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <PremiumCardTitle>Språk & Region</PremiumCardTitle>
              <PremiumCardDescription>
                Anpassa språk, tidszon och regionala inställningar
              </PremiumCardDescription>
            </div>
          </div>
        </PremiumCardHeader>
        <PremiumCardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="language" className="flex items-center gap-2">
                <Languages className="h-4 w-4" />
                Språk för meddelanden
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sv">🇸🇪 Svenska</SelectItem>
                  <SelectItem value="en">🇬🇧 English</SelectItem>
                  <SelectItem value="da">🇩🇰 Dansk</SelectItem>
                  <SelectItem value="no">🇳🇴 Norsk</SelectItem>
                  <SelectItem value="fi">🇫🇮 Suomi</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Standardspråk för AI-genererade meddelanden
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tone" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Standardtonläge
              </Label>
              <Select value={defaultTone} onValueChange={setDefaultTone}>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formell</SelectItem>
                  <SelectItem value="friendly">Vänlig</SelectItem>
                  <SelectItem value="casual">Avslappnad</SelectItem>
                  <SelectItem value="professional">Professionell</SelectItem>
                  <SelectItem value="enthusiastic">Entusiastisk</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Standard ton för meddelanden (kan anpassas per mall)
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Tidszon</Label>
            <Select value={localTimezone} onValueChange={setLocalTimezone}>
              <SelectTrigger id="timezone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Europe/Stockholm">Europa/Stockholm (CET/CEST)</SelectItem>
                <SelectItem value="Europe/London">Europa/London (GMT/BST)</SelectItem>
                <SelectItem value="Europe/Paris">Europa/Paris (CET/CEST)</SelectItem>
                <SelectItem value="Europe/Berlin">Europa/Berlin (CET/CEST)</SelectItem>
                <SelectItem value="America/New_York">Amerika/New York (EST/EDT)</SelectItem>
                <SelectItem value="America/Los_Angeles">Amerika/Los Angeles (PST/PDT)</SelectItem>
                <SelectItem value="America/Chicago">Amerika/Chicago (CST/CDT)</SelectItem>
                <SelectItem value="Asia/Tokyo">Asien/Tokyo (JST)</SelectItem>
                <SelectItem value="Asia/Dubai">Asien/Dubai (GST)</SelectItem>
                <SelectItem value="Australia/Sydney">Australien/Sydney (AEDT/AEST)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Din tidszon används för att visa kalenderhändelser och tider korrekt
            </p>
          </div>

          <div className="pt-4">
            <Button onClick={handleSaveRegionSettings} disabled={saving || timezoneLoading}>
              {saving ? "Sparar..." : "Spara Ändringar"}
            </Button>
          </div>
        </PremiumCardContent>
      </PremiumCard>
    </div>
  );
}
