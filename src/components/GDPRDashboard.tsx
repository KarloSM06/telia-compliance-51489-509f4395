import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Shield, Download, Trash2, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GDPRDashboardProps {
  userId: string;
  email: string;
  gdprConsent: boolean;
  gdprConsentDate: string | null;
  dataRetentionDays: number;
}

export const GDPRDashboard = ({ 
  userId, 
  email, 
  gdprConsent, 
  gdprConsentDate,
  dataRetentionDays: initialRetentionDays 
}: GDPRDashboardProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [retentionDays, setRetentionDays] = useState(initialRetentionDays.toString());

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // Fetch all user data
      const [callsRes, analysisRes, logsRes] = await Promise.all([
        supabase.from('calls').select('*').eq('user_id', userId),
        supabase.from('user_analysis').select('*').eq('user_id', userId),
        supabase.from('data_access_log').select('*').eq('user_id', userId)
      ]);

      const exportData = {
        user: { email, gdprConsent, gdprConsentDate, dataRetentionDays: retentionDays },
        calls: callsRes.data || [],
        analysis: analysisRes.data || [],
        accessLogs: logsRes.data || []
      };

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hiems-data-export-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Log the export
      await supabase.from('data_access_log').insert({
        user_id: userId,
        action: 'DATA_EXPORTED',
        resource_type: 'USER_DATA'
      });

      toast({
        title: "Data exporterad",
        description: "Din data har laddats ner som en JSON-fil.",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Fel",
        description: "Kunde inte exportera data. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAllData = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase.functions.invoke('delete-user-data');
      
      if (error) throw error;

      toast({
        title: "Data raderad",
        description: "All din data har raderats permanent.",
      });

      // Sign out the user
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting data:', error);
      toast({
        title: "Fel",
        description: "Kunde inte radera data. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateRetention = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ data_retention_days: parseInt(retentionDays) })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Inställningar uppdaterade",
        description: "Din datalagring har uppdaterats.",
      });
    } catch (error) {
      console.error('Error updating retention:', error);
      toast({
        title: "Fel",
        description: "Kunde inte uppdatera inställningar.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>GDPR & Dataskydd</CardTitle>
          </div>
          <CardDescription>
            Hantera dina personuppgifter och sekretessinställningar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Consent Status */}
          <div className="space-y-2">
            <h3 className="font-medium">Samtyckesstatus</h3>
            <div className="text-sm text-muted-foreground">
              <p>Email: {email}</p>
              <p>GDPR-samtycke: {gdprConsent ? 'Godkänt' : 'Ej godkänt'}</p>
              {gdprConsentDate && (
                <p>Datum för samtycke: {new Date(gdprConsentDate).toLocaleDateString('sv-SE')}</p>
              )}
            </div>
          </div>

          {/* Data Retention */}
          <div className="space-y-2">
            <Label htmlFor="retention">Datalagring</Label>
            <div className="flex gap-2">
              <Select value={retentionDays} onValueChange={setRetentionDays}>
                <SelectTrigger id="retention" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 dagar</SelectItem>
                  <SelectItem value="90">90 dagar</SelectItem>
                  <SelectItem value="180">180 dagar</SelectItem>
                  <SelectItem value="365">365 dagar</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleUpdateRetention} variant="secondary">
                <Calendar className="h-4 w-4 mr-2" />
                Uppdatera
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Dina samtalsdata raderas automatiskt efter vald period
            </p>
          </div>

          {/* Export Data */}
          <div className="space-y-2">
            <h3 className="font-medium">Exportera din data</h3>
            <p className="text-sm text-muted-foreground">
              Ladda ner all din lagrade data i JSON-format
            </p>
            <Button 
              onClick={handleExportData} 
              disabled={isExporting}
              variant="outline"
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exporterar...' : 'Exportera data'}
            </Button>
          </div>

          {/* Delete All Data */}
          <div className="space-y-2">
            <h3 className="font-medium text-destructive">Radera all data</h3>
            <p className="text-sm text-muted-foreground">
              Detta raderar permanent all din data inklusive samtal, analyser och ditt konto
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? 'Raderar...' : 'Radera all min data'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Är du helt säker?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Detta kommer permanent radera alla dina data inklusive:
                    <ul className="list-disc list-inside mt-2">
                      <li>Alla inspelade samtal och ljudfiler</li>
                      <li>Samtalsanalyser och rapporter</li>
                      <li>Användardata och inställningar</li>
                      <li>Ditt användarkonto</li>
                    </ul>
                    <p className="mt-2 font-semibold">
                      Denna åtgärd kan inte ångras.
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Avbryt</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAllData}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Ja, radera allt
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
