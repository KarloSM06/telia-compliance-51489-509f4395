import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useReminderSettings } from "@/hooks/useReminderSettings";
import { useState, useEffect, useMemo } from "react";
import { Mail, MessageSquare, Bell, CheckCircle2, Clock, Star, Zap, Timer } from "lucide-react";
import { TimelineStep } from "@/components/communications/TimelineStep";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { PremiumTelephonyStatCard } from "@/components/telephony/PremiumTelephonyStatCard";
import { Card } from "@/components/ui/card";
import hiemsLogoSnowflake from "@/assets/hiems-logo-snowflake.png";

export default function ReminderSettings() {
  const { settings, updateSettings, isLoading } = useReminderSettings();
  
  type FormDataType = {
    booking_confirmation_enabled: boolean;
    booking_confirmation_channel: string[];
    reminder_1_enabled: boolean;
    reminder_1_hours_before: number;
    reminder_1_channel: string[];
    reminder_2_enabled: boolean;
    reminder_2_hours_before: number;
    reminder_2_channel: string[];
    review_request_enabled: boolean;
    review_request_hours_after: number;
    review_request_channel: string[];
  };
  
  const [formData, setFormData] = useState<FormDataType>(settings);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSave = () => {
    updateSettings(formData);
  };

  // Calculate stats from form data
  const stats = useMemo(() => {
    const enabledCount = [
      formData.booking_confirmation_enabled,
      formData.reminder_1_enabled,
      formData.reminder_2_enabled,
      formData.review_request_enabled
    ].filter(Boolean).length;

    const avgHoursBefore = formData.reminder_1_enabled && formData.reminder_2_enabled
      ? Math.round((formData.reminder_1_hours_before + formData.reminder_2_hours_before) / 2)
      : formData.reminder_1_enabled ? formData.reminder_1_hours_before
      : formData.reminder_2_enabled ? formData.reminder_2_hours_before
      : 0;

    // Count most used channel
    const allChannels = [
      ...formData.booking_confirmation_channel,
      ...formData.reminder_1_channel,
      ...formData.reminder_2_channel,
      ...formData.review_request_channel
    ];
    const emailCount = allChannels.filter(c => c === 'email').length;
    const smsCount = allChannels.filter(c => c === 'sms').length;
    const topChannel = emailCount >= smsCount ? 'E-post' : 'SMS';

    return { enabledCount, avgHoursBefore, topChannel };
  }, [formData]);

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
                <span className="text-sm font-semibold tracking-wider text-primary uppercase">Tidsstyrning</span>
                <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50 mt-2" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
                Påminnelser
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                Konfigurera automatiska påminnelser för bokningar och recensioner
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Overview */}
        <AnimatedSection delay={100}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <PremiumTelephonyStatCard
              title="Aktiverade påminnelser"
              value={`${stats.enabledCount}/4`}
              icon={Bell}
              subtitle="I användning"
              color="text-green-600"
              animate
            />
            <PremiumTelephonyStatCard
              title="Genomsnitt timing"
              value={`${stats.avgHoursBefore}h`}
              icon={Timer}
              subtitle="Före bokning"
              color="text-blue-600"
            />
            <PremiumTelephonyStatCard
              title="Föredragen kanal"
              value={stats.topChannel}
              icon={stats.topChannel === 'E-post' ? Mail : MessageSquare}
              subtitle="Mest använd"
              color="text-purple-600"
            />
            <PremiumTelephonyStatCard
              title="Automatisering"
              value="Aktiv"
              icon={Zap}
              subtitle="Påslagen"
              color="text-orange-600"
            />
          </div>
        </AnimatedSection>

        {/* Timeline Steps Card */}
        <AnimatedSection delay={200}>
          <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-xl hover:border-primary/30 transition-all duration-500">
            <div className="space-y-6">
        {/* Booking Confirmation */}
        <TimelineStep
          icon={CheckCircle2}
          title="Bokningsbekräftelse"
          description="Skickas direkt när en bokning skapas"
          enabled={formData.booking_confirmation_enabled}
          onToggle={(checked) => 
            setFormData({ ...formData, booking_confirmation_enabled: checked })
          }
        >
          <div className="space-y-3 pt-2">
            <Label className="text-sm font-medium">Kanaler</Label>
            <div className="flex gap-4">
              <Label htmlFor="conf-email" className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  id="conf-email"
                  checked={formData.booking_confirmation_channel.includes('email')}
                  onCheckedChange={(checked) => {
                    if (checked === 'indeterminate') return;
                    const channels = checked
                      ? [...formData.booking_confirmation_channel, 'email']
                      : formData.booking_confirmation_channel.filter(c => c !== 'email');
                    setFormData({ ...formData, booking_confirmation_channel: channels });
                  }}
                />
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  E-post
                </span>
              </Label>
              <Label htmlFor="conf-sms" className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  id="conf-sms"
                  checked={formData.booking_confirmation_channel.includes('sms')}
                  onCheckedChange={(checked) => {
                    if (checked === 'indeterminate') return;
                    const channels = checked
                      ? [...formData.booking_confirmation_channel, 'sms']
                      : formData.booking_confirmation_channel.filter(c => c !== 'sms');
                    setFormData({ ...formData, booking_confirmation_channel: channels });
                  }}
                />
                <span className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  SMS
                </span>
              </Label>
            </div>
          </div>
        </TimelineStep>

        {/* First Reminder */}
        <TimelineStep
          icon={Bell}
          title="Första påminnelsen"
          description="Påminnelse före bokningens starttid"
          enabled={formData.reminder_1_enabled}
          onToggle={(checked) => 
            setFormData({ ...formData, reminder_1_enabled: checked })
          }
        >
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="reminder-1-hours">Timmar före bokning</Label>
              <Input
                id="reminder-1-hours"
                type="number"
                value={formData.reminder_1_hours_before}
                onChange={(e) => 
                  setFormData({ ...formData, reminder_1_hours_before: parseInt(e.target.value) })
                }
                min={1}
                max={168}
                className="max-w-xs"
              />
              <p className="text-xs text-muted-foreground">
                Standard: 48 timmar (2 dagar)
              </p>
            </div>
            
            <div className="space-y-3">
              <Label className="text-sm font-medium">Kanaler</Label>
              <div className="flex gap-4">
                <Label htmlFor="r1-email" className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    id="r1-email"
                    checked={formData.reminder_1_channel.includes('email')}
                    onCheckedChange={(checked) => {
                      if (checked === 'indeterminate') return;
                      const channels = checked
                        ? [...formData.reminder_1_channel, 'email']
                        : formData.reminder_1_channel.filter(c => c !== 'email');
                      setFormData({ ...formData, reminder_1_channel: channels });
                    }}
                  />
                  <span className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    E-post
                  </span>
                </Label>
                <Label htmlFor="r1-sms" className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    id="r1-sms"
                    checked={formData.reminder_1_channel.includes('sms')}
                    onCheckedChange={(checked) => {
                      if (checked === 'indeterminate') return;
                      const channels = checked
                        ? [...formData.reminder_1_channel, 'sms']
                        : formData.reminder_1_channel.filter(c => c !== 'sms');
                      setFormData({ ...formData, reminder_1_channel: channels });
                    }}
                  />
                  <span className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    SMS
                  </span>
                </Label>
              </div>
            </div>
          </div>
        </TimelineStep>

        {/* Second Reminder */}
        <TimelineStep
          icon={Clock}
          title="Andra påminnelsen"
          description="Påminnelse strax före bokningens starttid"
          enabled={formData.reminder_2_enabled}
          onToggle={(checked) => 
            setFormData({ ...formData, reminder_2_enabled: checked })
          }
        >
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="reminder-2-hours">Timmar före bokning</Label>
              <Input
                id="reminder-2-hours"
                type="number"
                value={formData.reminder_2_hours_before}
                onChange={(e) => 
                  setFormData({ ...formData, reminder_2_hours_before: parseInt(e.target.value) })
                }
                min={1}
                max={24}
                className="max-w-xs"
              />
              <p className="text-xs text-muted-foreground">
                Standard: 2 timmar
              </p>
            </div>
            
            <div className="space-y-3">
              <Label className="text-sm font-medium">Kanaler</Label>
              <div className="flex gap-4">
                <Label htmlFor="r2-email" className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    id="r2-email"
                    checked={formData.reminder_2_channel.includes('email')}
                    onCheckedChange={(checked) => {
                      if (checked === 'indeterminate') return;
                      const channels = checked
                        ? [...formData.reminder_2_channel, 'email']
                        : formData.reminder_2_channel.filter(c => c !== 'email');
                      setFormData({ ...formData, reminder_2_channel: channels });
                    }}
                  />
                  <span className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    E-post
                  </span>
                </Label>
                <Label htmlFor="r2-sms" className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    id="r2-sms"
                    checked={formData.reminder_2_channel.includes('sms')}
                    onCheckedChange={(checked) => {
                      if (checked === 'indeterminate') return;
                      const channels = checked
                        ? [...formData.reminder_2_channel, 'sms']
                        : formData.reminder_2_channel.filter(c => c !== 'sms');
                      setFormData({ ...formData, reminder_2_channel: channels });
                    }}
                  />
                  <span className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    SMS
                  </span>
                </Label>
              </div>
            </div>
          </div>
        </TimelineStep>

        {/* Review Request */}
        <TimelineStep
          icon={Star}
          title="Recension"
          description="Be om feedback efter mötet"
          enabled={formData.review_request_enabled}
          onToggle={(checked) => 
            setFormData({ ...formData, review_request_enabled: checked })
          }
          isLast
        >
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="review-hours">Timmar efter mötet</Label>
              <Input
                id="review-hours"
                type="number"
                value={formData.review_request_hours_after}
                onChange={(e) => 
                  setFormData({ ...formData, review_request_hours_after: parseInt(e.target.value) })
                }
                min={1}
                max={72}
                className="max-w-xs"
              />
              <p className="text-xs text-muted-foreground">
                Standard: 2 timmar efter mötet
              </p>
            </div>
            
            <div className="space-y-3">
              <Label className="text-sm font-medium">Kanaler</Label>
              <div className="flex gap-4">
                <Label htmlFor="review-email" className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    id="review-email"
                    checked={formData.review_request_channel.includes('email')}
                    onCheckedChange={(checked) => {
                      if (checked === 'indeterminate') return;
                      const channels = checked
                        ? [...formData.review_request_channel, 'email']
                        : formData.review_request_channel.filter(c => c !== 'email');
                      setFormData({ ...formData, review_request_channel: channels });
                    }}
                  />
                  <span className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    E-post
                  </span>
                </Label>
                <Label htmlFor="review-sms" className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    id="review-sms"
                    checked={formData.review_request_channel.includes('sms')}
                    onCheckedChange={(checked) => {
                      if (checked === 'indeterminate') return;
                      const channels = checked
                        ? [...formData.review_request_channel, 'sms']
                        : formData.review_request_channel.filter(c => c !== 'sms');
                      setFormData({ ...formData, review_request_channel: channels });
                    }}
                  />
                  <span className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    SMS
                  </span>
                </Label>
              </div>
            </div>
          </div>
        </TimelineStep>
            </div>
          </Card>
        </AnimatedSection>

        <div className="flex justify-end pt-6">
          <Button onClick={handleSave} size="lg" className="min-w-[200px]">
            Spara inställningar
          </Button>
        </div>
      </div>
    </div>
  );
}
