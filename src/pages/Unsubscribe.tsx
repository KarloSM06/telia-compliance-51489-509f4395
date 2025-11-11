import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Mail, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [preferences, setPreferences] = useState({
    opt_out_sms: false,
    opt_out_email: false,
  });
  const [customerInfo, setCustomerInfo] = useState<{
    email?: string;
    phone?: string;
  } | null>(null);

  useEffect(() => {
    if (token) {
      fetchPreferences();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_preferences')
        .select('*')
        .eq('unsubscribe_token', token)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setCustomerInfo({
          email: data.email,
          phone: data.phone,
        });
        setPreferences({
          opt_out_sms: data.opt_out_sms,
          opt_out_email: data.opt_out_email,
        });
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast.error('Kunde inte ladda dina inställningar');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!token) {
      toast.error('Ogiltig länk');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('customer_preferences')
        .update(preferences)
        .eq('unsubscribe_token', token);

      if (error) throw error;

      setSuccess(true);
      toast.success('Dina inställningar har uppdaterats');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Kunde inte uppdatera dina inställningar');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Laddar...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <XCircle className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="text-center">Ogiltig länk</CardTitle>
            <CardDescription className="text-center">
              Denna länk är ogiltig eller har gått ut. Vänligen kontakta support för hjälp.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-center">Inställningar uppdaterade</CardTitle>
            <CardDescription className="text-center">
              Dina meddelandeinställningar har uppdaterats framgångsrikt.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              {preferences.opt_out_sms && (
                <p>• Du kommer inte längre att få SMS-påminnelser</p>
              )}
              {preferences.opt_out_email && (
                <p>• Du kommer inte längre att få e-postmeddelanden</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Meddelandeinställningar</CardTitle>
          <CardDescription>
            Hantera hur du vill bli kontaktad
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {customerInfo && (
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-sm font-medium">Dina uppgifter:</p>
              {customerInfo.email && (
                <p className="text-sm text-muted-foreground">
                  E-post: {customerInfo.email}
                </p>
              )}
              {customerInfo.phone && (
                <p className="text-sm text-muted-foreground">
                  Telefon: {customerInfo.phone}
                </p>
              )}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="opt_out_sms"
                checked={preferences.opt_out_sms}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, opt_out_sms: !!checked })
                }
              />
              <div className="space-y-1">
                <Label htmlFor="opt_out_sms" className="flex items-center gap-2 cursor-pointer">
                  <MessageSquare className="h-4 w-4" />
                  Avprenumerera SMS
                </Label>
                <p className="text-xs text-muted-foreground">
                  Du kommer inte längre att få SMS-påminnelser eller meddelanden
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="opt_out_email"
                checked={preferences.opt_out_email}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, opt_out_email: !!checked })
                }
              />
              <div className="space-y-1">
                <Label htmlFor="opt_out_email" className="flex items-center gap-2 cursor-pointer">
                  <Mail className="h-4 w-4" />
                  Avprenumerera e-post
                </Label>
                <p className="text-xs text-muted-foreground">
                  Du kommer inte längre att få e-postmeddelanden från oss
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleUpdate}
            disabled={loading}
            className="w-full"
          >
            Spara inställningar
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Du kan ändra dessa inställningar när som helst genom att klicka på länken i våra meddelanden.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unsubscribe;
