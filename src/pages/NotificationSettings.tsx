import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";
import { toast } from "sonner";
import { Bell, Mail, MessageSquare, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function NotificationSettings() {
  const { settings, isLoading, updateSettings, sendTestNotification } = useNotificationSettings();
  const [isTesting, setIsTesting] = useState(false);

  const [localSettings, setLocalSettings] = useState({
    notification_email: settings?.notification_email || "",
    notification_phone: settings?.notification_phone || "",
    notify_on_new_booking: settings?.notify_on_new_booking ?? true,
    notify_on_booking_cancelled: settings?.notify_on_booking_cancelled ?? true,
    notify_on_booking_updated: settings?.notify_on_booking_updated ?? true,
    notify_on_new_review: settings?.notify_on_new_review ?? true,
    notify_on_message_failed: settings?.notify_on_message_failed ?? true,
    enable_email_notifications: settings?.enable_email_notifications ?? true,
    enable_sms_notifications: settings?.enable_sms_notifications ?? false,
    enable_inapp_notifications: settings?.enable_inapp_notifications ?? true,
    quiet_hours_start: settings?.quiet_hours_start || "",
    quiet_hours_end: settings?.quiet_hours_end || "",
  });

  const handleSave = async () => {
    try {
      await updateSettings(localSettings);
      toast.success("Notifikationsinställningar sparade");
    } catch (error) {
      toast.error("Kunde inte spara inställningar");
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    try {
      await sendTestNotification();
      toast.success("Testnotifikation skickad! Kolla din email/SMS");
    } catch (error) {
      toast.error("Kunde inte skicka testnotifikation");
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto py-8">Laddar...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Notifikationsinställningar</h1>
        <p className="text-muted-foreground">
          Konfigurera hur och när du vill ta emot notifikationer om bokningar och händelser
        </p>
      </div>

      <div className="space-y-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Kontaktuppgifter för notifikationer
            </CardTitle>
            <CardDescription>
              Lägg in email och telefonnummer där du vill ta emot notifikationer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="notification_email">Email för notifikationer</Label>
              <Input
                id="notification_email"
                type="email"
                placeholder="info@företag.se"
                value={localSettings.notification_email}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, notification_email: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="notification_phone">Telefon för SMS-notifikationer</Label>
              <Input
                id="notification_phone"
                type="tel"
                placeholder="+46701234567"
                value={localSettings.notification_phone}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, notification_phone: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Channels */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Notifikationskanaler
            </CardTitle>
            <CardDescription>Välj hur du vill ta emot notifikationer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email-notifikationer</Label>
                <p className="text-sm text-muted-foreground">
                  Ta emot notifikationer via email
                </p>
              </div>
              <Switch
                checked={localSettings.enable_email_notifications}
                onCheckedChange={(checked) =>
                  setLocalSettings({ ...localSettings, enable_email_notifications: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS-notifikationer</Label>
                <p className="text-sm text-muted-foreground">
                  Ta emot notifikationer via SMS
                </p>
              </div>
              <Switch
                checked={localSettings.enable_sms_notifications}
                onCheckedChange={(checked) =>
                  setLocalSettings({ ...localSettings, enable_sms_notifications: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>In-app notifikationer</Label>
                <p className="text-sm text-muted-foreground">
                  Se notifikationer i appen (klockikonen)
                </p>
              </div>
              <Switch
                checked={localSettings.enable_inapp_notifications}
                onCheckedChange={(checked) =>
                  setLocalSettings({ ...localSettings, enable_inapp_notifications: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Event Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Händelser att notifiera om
            </CardTitle>
            <CardDescription>Välj vilka händelser som ska trigga notifikationer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Ny bokning</Label>
                <p className="text-sm text-muted-foreground">När en ny bokning skapas</p>
              </div>
              <Switch
                checked={localSettings.notify_on_new_booking}
                onCheckedChange={(checked) =>
                  setLocalSettings({ ...localSettings, notify_on_new_booking: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Avbokad bokning</Label>
                <p className="text-sm text-muted-foreground">När en bokning avbokas</p>
              </div>
              <Switch
                checked={localSettings.notify_on_booking_cancelled}
                onCheckedChange={(checked) =>
                  setLocalSettings({ ...localSettings, notify_on_booking_cancelled: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Ombokad bokning</Label>
                <p className="text-sm text-muted-foreground">När en bokning ändras</p>
              </div>
              <Switch
                checked={localSettings.notify_on_booking_updated}
                onCheckedChange={(checked) =>
                  setLocalSettings({ ...localSettings, notify_on_booking_updated: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Ny recension</Label>
                <p className="text-sm text-muted-foreground">När ni får en ny recension</p>
              </div>
              <Switch
                checked={localSettings.notify_on_new_review}
                onCheckedChange={(checked) =>
                  setLocalSettings({ ...localSettings, notify_on_new_review: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Misslyckade meddelanden</Label>
                <p className="text-sm text-muted-foreground">
                  När ett meddelande inte kunde skickas
                </p>
              </div>
              <Switch
                checked={localSettings.notify_on_message_failed}
                onCheckedChange={(checked) =>
                  setLocalSettings({ ...localSettings, notify_on_message_failed: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Quiet Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Tyst-läge (SMS)
            </CardTitle>
            <CardDescription>
              Inga SMS skickas under dessa tider (optional)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quiet_hours_start">Från tid</Label>
                <Input
                  id="quiet_hours_start"
                  type="time"
                  value={localSettings.quiet_hours_start}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, quiet_hours_start: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="quiet_hours_end">Till tid</Label>
                <Input
                  id="quiet_hours_end"
                  type="time"
                  value={localSettings.quiet_hours_end}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, quiet_hours_end: e.target.value })
                  }
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              T.ex. 22:00 - 08:00 för att undvika SMS nattetid
            </p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button onClick={handleSave} className="flex-1">
            Spara inställningar
          </Button>
          <Button onClick={handleTest} variant="outline" disabled={isTesting}>
            {isTesting ? "Skickar..." : "Skicka testnotis"}
          </Button>
        </div>
      </div>
    </div>
  );
}
