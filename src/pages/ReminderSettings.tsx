import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useReminderSettings } from "@/hooks/useReminderSettings";
import { useState, useEffect } from "react";
import { Mail, MessageSquare, Bell, CheckCircle2, Clock, Star } from "lucide-react";
import { TimelineStep } from "@/components/communications/TimelineStep";

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

  if (isLoading) {
    return <div className="flex items-center justify-center py-12">Laddar inställningar...</div>;
  }

  return (
    <div className="space-y-8 w-full pb-12">
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

      <div className="flex justify-end pt-6">
        <Button onClick={handleSave} size="lg" className="min-w-[200px]">
          Spara inställningar
        </Button>
      </div>
    </div>
  );
}
