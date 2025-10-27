import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";
import { Bell, Mail, Phone, Clock, Users, CheckCircle2, Send } from "lucide-react";
import { NotificationRecipientForm } from "@/components/NotificationRecipientForm";
import { SettingRow } from "@/components/communications/SettingRow";
import { Badge } from "@/components/ui/badge";

export default function NotificationSettings() {
  const { settings, isLoading, updateSettings, isUpdating, sendTestNotification, isTesting } = useNotificationSettings();
  const [testStatus, setTestStatus] = useState<string | null>(null);
  
  // Initialize with default values to prevent loading state issues
  const [localSettings, setLocalSettings] = useState({
    notification_email: "",
    notification_phone: "",
    enable_email_notifications: true,
    enable_sms_notifications: false,
    enable_inapp_notifications: true,
    notify_on_new_booking: true,
    notify_on_booking_cancelled: true,
    notify_on_booking_updated: true,
    notify_on_new_review: true,
    notify_on_message_failed: true,
    quiet_hours_start: "",
    quiet_hours_end: "",
  });

  useEffect(() => {
    if (settings) {
      setLocalSettings({
        notification_email: settings.notification_email || "",
        notification_phone: settings.notification_phone || "",
        enable_email_notifications: settings.enable_email_notifications ?? true,
        enable_sms_notifications: settings.enable_sms_notifications ?? false,
        enable_inapp_notifications: settings.enable_inapp_notifications ?? true,
        notify_on_new_booking: settings.notify_on_new_booking ?? true,
        notify_on_booking_cancelled: settings.notify_on_booking_cancelled ?? true,
        notify_on_booking_updated: settings.notify_on_booking_updated ?? true,
        notify_on_new_review: settings.notify_on_new_review ?? true,
        notify_on_message_failed: settings.notify_on_message_failed ?? true,
        quiet_hours_start: settings.quiet_hours_start || "",
        quiet_hours_end: settings.quiet_hours_end || "",
      });
    }
  }, [settings]);

  const handleSave = async () => {
    await updateSettings(localSettings);
  };

  const handleTest = async () => {
    setTestStatus(null);
    try {
      await sendTestNotification();
      setTestStatus("success");
    } catch (error) {
      setTestStatus("error");
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-12">Laddar inställningar...</div>;
  }

  return (
    <div className="space-y-6 w-full px-6 pb-12">
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Contact & Channels */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Kontaktinformation
              </CardTitle>
              <CardDescription>
                Var ska notifikationerna skickas?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  E-postadress
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={localSettings.notification_email || ''}
                  onChange={(e) => setLocalSettings({ ...localSettings, notification_email: e.target.value })}
                  placeholder="din@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Telefonnummer
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={localSettings.notification_phone || ''}
                  onChange={(e) => setLocalSettings({ ...localSettings, notification_phone: e.target.value })}
                  placeholder="+46XXXXXXXXX"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Channels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifikationskanaler
              </CardTitle>
              <CardDescription>
                Välj hur du vill bli meddelad
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <SettingRow
                icon={Mail}
                label="E-post notifikationer"
                description="Få notifikationer via e-post"
                checked={localSettings.enable_email_notifications}
                onCheckedChange={(checked) => setLocalSettings({ ...localSettings, enable_email_notifications: checked })}
              />
              <SettingRow
                icon={Phone}
                label="SMS notifikationer"
                description="Få notifikationer via SMS"
                checked={localSettings.enable_sms_notifications}
                onCheckedChange={(checked) => setLocalSettings({ ...localSettings, enable_sms_notifications: checked })}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Events & Quiet Hours */}
        <div className="space-y-6">
          {/* Event Types */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Händelsetyper
              </CardTitle>
              <CardDescription>
                När ska du få notifikationer?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <SettingRow
                label="Ny bokning"
                description="När en ny bokning skapas"
                checked={localSettings.notify_on_new_booking}
                onCheckedChange={(checked) => setLocalSettings({ ...localSettings, notify_on_new_booking: checked })}
              />
              <SettingRow
                label="Avbokning"
                description="När en bokning avbokas"
                checked={localSettings.notify_on_booking_cancelled}
                onCheckedChange={(checked) => setLocalSettings({ ...localSettings, notify_on_booking_cancelled: checked })}
              />
              <SettingRow
                label="Ombokning"
                description="När en bokning ändras"
                checked={localSettings.notify_on_booking_updated}
                onCheckedChange={(checked) => setLocalSettings({ ...localSettings, notify_on_booking_updated: checked })}
              />
            </CardContent>
          </Card>

          {/* Quiet Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Tyst period
              </CardTitle>
              <CardDescription>
                Inga notifikationer under dessa timmar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quiet_start">Från</Label>
                  <Input
                    id="quiet_start"
                    type="time"
                    value={localSettings.quiet_hours_start || ''}
                    onChange={(e) => setLocalSettings({ ...localSettings, quiet_hours_start: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiet_end">Till</Label>
                  <Input
                    id="quiet_end"
                    type="time"
                    value={localSettings.quiet_hours_end || ''}
                    onChange={(e) => setLocalSettings({ ...localSettings, quiet_hours_end: e.target.value })}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                T.ex. 22:00 - 08:00 för nattetid
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Recipients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Ytterligare mottagare
          </CardTitle>
          <CardDescription>
            Lägg till kollegor som ska få notifikationer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationRecipientForm />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-end">
        {testStatus && (
          <div className="flex-1">
            {testStatus === "success" ? (
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 className="h-5 w-5" />
                <span>Testnotifikation skickad!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-destructive">
                <Badge variant="destructive">Misslyckades</Badge>
              </div>
            )}
          </div>
        )}
        <Button 
          onClick={handleTest} 
          variant="outline" 
          disabled={isTesting}
          className="gap-2"
        >
          <Send className="h-4 w-4" />
          {isTesting ? "Skickar..." : "Skicka test"}
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={isUpdating}
          size="lg"
          className="min-w-[200px]"
        >
          {isUpdating ? "Sparar..." : "Spara inställningar"}
        </Button>
      </div>
    </div>
  );
}
