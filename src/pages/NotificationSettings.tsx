import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";
import { Bell, Mail, Phone, Clock, Users, CheckCircle2, Send, RefreshCw, Zap } from "lucide-react";
import { NotificationRecipientForm } from "@/components/NotificationRecipientForm";
import { SettingRow } from "@/components/communications/SettingRow";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { PremiumTelephonyStatCard } from "@/components/telephony/PremiumTelephonyStatCard";
import hiemsLogoSnowflake from "@/assets/hiems-logo-snowflake.png";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function NotificationSettings() {
  const { settings, isLoading, updateSettings, isUpdating, sendTestNotification, isTesting } = useNotificationSettings();
  const { user } = useAuth();
  const [testStatus, setTestStatus] = useState<string | null>(null);

  // Fetch recipients count
  const { data: recipients } = useQuery({
    queryKey: ['notification-recipients', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('notification_recipients')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
  
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

  // Calculate stats
  const stats = useMemo(() => {
    const activeChannels = [
      localSettings.enable_email_notifications,
      localSettings.enable_sms_notifications,
      localSettings.enable_inapp_notifications
    ].filter(Boolean).length;

    const quietHoursActive = !!(localSettings.quiet_hours_start && localSettings.quiet_hours_end);

    const activeEvents = [
      localSettings.notify_on_new_booking,
      localSettings.notify_on_booking_cancelled,
      localSettings.notify_on_booking_updated,
      localSettings.notify_on_new_review,
      localSettings.notify_on_message_failed
    ].filter(Boolean).length;

    return {
      activeChannels,
      quietHoursActive,
      recipientsCount: recipients?.length || 0,
      activeEvents
    };
  }, [localSettings, recipients]);

  if (isLoading) {
    return <div className="flex items-center justify-center py-12">Laddar inställningar...</div>;
  }

  return (
    <div className="space-y-0 w-full">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
        {/* Radial gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.1),transparent_50%)]" />
        
        {/* Snowflakes */}
        <div className="absolute -top-32 -right-32 w-[700px] h-[700px] opacity-5 pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_60s_linear_infinite]" />
        </div>
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] opacity-[0.03] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_45s_linear_infinite_reverse]" />
        </div>
        <div className="absolute -bottom-20 right-1/4 w-[400px] h-[400px] opacity-[0.04] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_80s_linear_infinite]" />
        </div>
        <div className="absolute top-10 left-1/3 w-[300px] h-[300px] opacity-[0.02] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_100s_linear_infinite_reverse]" />
        </div>
        <div className="absolute bottom-1/3 right-10 w-[250px] h-[250px] opacity-[0.03] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_70s_linear_infinite]" />
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-block">
                <span className="text-sm font-semibold tracking-wider text-primary uppercase">Realtidsövervakning</span>
                <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50 mt-2" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
                Ägarnotiser
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                Hantera hur och när du får notifikationer om bokningar och händelser
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Quick Actions Bar */}
      <section className="relative py-6 border-y border-primary/10 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-muted-foreground">Live</span>
              </div>
              <Badge variant="secondary">{stats.activeChannels} kanaler aktiva</Badge>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleTest} 
                variant="outline" 
                size="sm" 
                disabled={isTesting}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                {isTesting ? "Skickar..." : "Skicka test"}
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={isUpdating}
                size="sm"
                className="gap-2"
              >
                {isUpdating ? "Sparar..." : "Spara inställningar"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Overview */}
        <AnimatedSection delay={100}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <PremiumTelephonyStatCard
              title="Aktiva kanaler"
              value={stats.activeChannels}
              icon={Bell}
              subtitle="I användning"
              color="text-blue-600"
              animate
            />
            <PremiumTelephonyStatCard
              title="Tyst period"
              value={stats.quietHoursActive ? 'Aktiv' : 'Inaktiv'}
              icon={Clock}
              subtitle={stats.quietHoursActive ? 'Konfigurerad' : 'Ej konfigurerad'}
              color="text-purple-600"
            />
            <PremiumTelephonyStatCard
              title="Mottagare"
              value={stats.recipientsCount}
              icon={Users}
              subtitle="Registrerade"
              color="text-green-600"
            />
            <PremiumTelephonyStatCard
              title="Händelser"
              value={`${stats.activeEvents}/5`}
              icon={Zap}
              subtitle="Bevakade"
              color="text-orange-600"
            />
          </div>
        </AnimatedSection>
        {/* Two Column Layout */}
        <AnimatedSection delay={200}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Contact & Channels */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card className="border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-xl hover:border-primary/30 transition-all duration-500">
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
              <Card className="border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-xl hover:border-primary/30 transition-all duration-500">
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
              <Card className="border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-xl hover:border-primary/30 transition-all duration-500">
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
              <Card className="border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-xl hover:border-primary/30 transition-all duration-500">
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
        </AnimatedSection>

        {/* Additional Recipients */}
        <AnimatedSection delay={300}>
          <Card className="border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-xl hover:border-primary/30 transition-all duration-500">
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
        </AnimatedSection>

        {testStatus && (
          <AnimatedSection delay={400}>
            <div className="flex items-center justify-center p-4 border border-primary/10 rounded-lg bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md">
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
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
