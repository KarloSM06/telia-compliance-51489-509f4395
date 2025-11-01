import { useState, useEffect, useRef } from "react";
import { format, parseISO, parse } from "date-fns";
import { sv } from "date-fns/locale";
import { useUserTimezone } from "@/hooks/useUserTimezone";
import { createDateTimeInZone, formatInTimeZone_, getTimezoneOffset, toTimeZone, toISOStringWithOffset } from "@/lib/timezoneUtils";
import { normalizePhoneNumber } from "@/lib/phoneUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/hooks/useCalendarEvents";
import { toast } from "sonner";

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  event?: CalendarEvent | null;
  defaultDate?: Date;
  onSave: (event: Partial<CalendarEvent>, calendarId?: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  pendingChanges?: Partial<CalendarEvent>;
  calendars?: Array<{ id: string; name: string; color: string; is_default: boolean }>;
  selectedCalendarId?: string;
}

export const EventModal = ({ open, onClose, event, defaultDate, onSave, onDelete, pendingChanges, calendars = [], selectedCalendarId }: EventModalProps) => {
  const { timezone } = useUserTimezone();
  
  // Merge event with pending changes for display
  const currentEvent = event && pendingChanges ? { ...event, ...pendingChanges } : event;
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [calendarId, setCalendarId] = useState<string>(selectedCalendarId || '');
  const [formData, setFormData] = useState({
    title: currentEvent?.title || '',
    description: currentEvent?.description || '',
    start_time: currentEvent?.start_time || (defaultDate ? formatInTimeZone_(defaultDate, "yyyy-MM-dd'T'HH:mm", timezone) : ''),
    end_time: currentEvent?.end_time || '',
    event_type: currentEvent?.event_type || 'meeting',
    contact_person: currentEvent?.contact_person || '',
    contact_email: currentEvent?.contact_email || '',
    contact_phone: currentEvent?.contact_phone || '',
    address: (currentEvent as any)?.address || '',
    notes: (currentEvent as any)?.notes || '',
  });
  const [reminders, setReminders] = useState<number[]>([]); // Minutes before event
  const [loading, setLoading] = useState(false);

  // Autofocus title field and update form when event or pending changes update
  useEffect(() => {
    if (open) {
      setTimeout(() => titleInputRef.current?.focus(), 100);
      
      // Set calendar ID
      if (currentEvent && (currentEvent as any).calendar_id) {
        setCalendarId((currentEvent as any).calendar_id);
      } else if (selectedCalendarId) {
        setCalendarId(selectedCalendarId);
      } else if (calendars.length > 0) {
        const defaultCal = calendars.find(c => c.is_default);
        setCalendarId(defaultCal?.id || calendars[0].id);
      }
      
      setFormData({
        title: currentEvent?.title || '',
        description: currentEvent?.description || '',
        start_time: currentEvent?.start_time || (defaultDate ? formatInTimeZone_(defaultDate, "yyyy-MM-dd'T'HH:mm", timezone) : ''),
        end_time: currentEvent?.end_time || '',
        event_type: currentEvent?.event_type || 'meeting',
        contact_person: currentEvent?.contact_person || '',
        contact_email: currentEvent?.contact_email || '',
        contact_phone: currentEvent?.contact_phone || '',
        address: (currentEvent as any)?.address || '',
        notes: (currentEvent as any)?.notes || '',
      });
      
      // Parse reminders from event
      const eventReminders = (currentEvent as any)?.reminders;
      if (eventReminders) {
        try {
          const parsedReminders = Array.isArray(eventReminders) 
            ? eventReminders.map((r: any) => r.minutes_before || 0)
            : [];
          setReminders(parsedReminders);
        } catch {
          setReminders([]);
        }
      } else {
        setReminders([]);
      }
    }
  }, [open, currentEvent, defaultDate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      
      // Ctrl/Cmd + Enter to save
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit(e as any);
      }
      // Escape to close
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate times
    if (formData.start_time && formData.end_time) {
      const start = new Date(formData.start_time);
      const end = new Date(formData.end_time);
      
      if (end <= start) {
        toast.error('Sluttiden måste vara efter starttiden');
        return;
      }
    }
    
    setLoading(true);
    try {
      // Format reminders
      const formattedReminders = reminders.map(minutes => ({
        minutes_before: minutes,
        method: 'notification'
      }));
      
      await onSave({
        ...formData,
        source: 'internal',
        status: 'scheduled',
        reminders: formattedReminders.length > 0 ? formattedReminders : null,
      } as any, calendarId);
      toast.success(event ? 'Händelse uppdaterad' : 'Händelse skapad');
      onClose();
    } catch (error) {
      toast.error('Något gick fel. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (event?.id && onDelete) {
      setLoading(true);
      try {
        await onDelete(event.id);
        toast.success('Händelse borttagen');
        onClose();
      } catch (error) {
        toast.error('Kunde inte ta bort händelsen');
      } finally {
        setLoading(false);
      }
    }
  };

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      meeting: 'Möte',
      call: 'Samtal',
      demo: 'Demo',
      follow_up: 'Uppföljning',
      personal: 'Personligt',
      work: 'Arbete',
      leisure: 'Fritid',
      other: 'Annat',
    };
    return labels[type] || type;
  };

  const addReminder = () => {
    setReminders([...reminders, 15]); // Default 15 minutes
  };

  const removeReminder = (index: number) => {
    setReminders(reminders.filter((_, i) => i !== index));
  };

  const updateReminder = (index: number, value: number) => {
    const newReminders = [...reminders];
    newReminders[index] = value;
    setReminders(newReminders);
  };

  const getReminderLabel = (minutes: number) => {
    if (minutes < 60) return `${minutes} minuter`;
    if (minutes < 1440) return `${minutes / 60} timmar`;
    return `${minutes / 1440} dagar`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {event ? 'Redigera händelse' : 'Ny händelse'}
            {event && (
              <Badge variant="outline">
                {getEventTypeLabel(currentEvent?.event_type || event.event_type)}
              </Badge>
            )}
            {pendingChanges && (
              <Badge variant="secondary" className="ml-2">
                Osparade ändringar
              </Badge>
            )}
          </DialogTitle>
          {event && formData.start_time && (
            <DialogDescription className="flex items-center gap-2">
              <span>
                {formatInTimeZone_(formData.start_time, 'EEEE d MMM yyyy, HH:mm', timezone)}
                {formData.end_time && ` - ${formatInTimeZone_(formData.end_time, 'HH:mm', timezone)}`}
              </span>
              <Badge variant="secondary" className="text-xs">
                {getTimezoneOffset(formData.start_time, timezone)}
              </Badge>
            </DialogDescription>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Titel *</Label>
            <Input
              ref={titleInputRef}
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="T.ex. Kundmöte med Anna"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Beskrivning</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Datum *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.start_time && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.start_time ? (
                      formatInTimeZone_(formData.start_time, "PPP", timezone)
                    ) : (
                      <span>Välj datum</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.start_time ? toTimeZone(formData.start_time, timezone) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        // Extract current time or default to 09:00
                        const currentTime = formData.start_time 
                          ? formatInTimeZone_(formData.start_time, 'HH:mm', timezone)
                          : '09:00';
                        const [hours, minutes] = currentTime.split(':').map(Number);
                        
                        // Create DateTime in user's timezone
                        const localDateTime = createDateTimeInZone(
                          date.getFullYear(),
                          date.getMonth(),
                          date.getDate(),
                          hours,
                          minutes,
                          timezone
                        );
                        
                        // Update end time to maintain duration
                        if (formData.end_time && formData.start_time) {
                          const startDate = new Date(formData.start_time);
                          const endDate = new Date(formData.end_time);
                          const duration = endDate.getTime() - startDate.getTime();
                          const newEndDateTime = new Date(localDateTime.getTime() + duration);
                          
                          setFormData({ 
                            ...formData, 
                            start_time: toISOStringWithOffset(localDateTime, timezone),
                            end_time: toISOStringWithOffset(newEndDateTime, timezone)
                          });
                        } else {
                          setFormData({ ...formData, start_time: toISOStringWithOffset(localDateTime, timezone) });
                        }
                      }
                    }}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="start_time">Starttid *</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time ? formatInTimeZone_(formData.start_time, 'HH:mm', timezone) : ''}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':').map(Number);
                  const currentDate = formData.start_time 
                    ? toTimeZone(formData.start_time, timezone)
                    : new Date();
                  
                  // Create DateTime in user's timezone
                  const localDateTime = createDateTimeInZone(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    currentDate.getDate(),
                    hours,
                    minutes,
                    timezone
                  );
                  
                  setFormData({ ...formData, start_time: toISOStringWithOffset(localDateTime, timezone) });
                }}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="end_time">Sluttid *</Label>
            <Input
              id="end_time"
              type="time"
              value={formData.end_time ? formatInTimeZone_(formData.end_time, 'HH:mm', timezone) : ''}
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(':').map(Number);
                const currentDate = formData.start_time 
                  ? toTimeZone(formData.start_time, timezone)
                  : new Date();
                
                // Create DateTime in user's timezone
                const localDateTime = createDateTimeInZone(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  currentDate.getDate(),
                  hours,
                  minutes,
                  timezone
                );
                
                setFormData({ ...formData, end_time: toISOStringWithOffset(localDateTime, timezone) });
              }}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="event_type">Kategori</Label>
              <Select value={formData.event_type} onValueChange={(value) => setFormData({ ...formData, event_type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">🤝 Möte</SelectItem>
                  <SelectItem value="call">📞 Samtal</SelectItem>
                  <SelectItem value="demo">💼 Demo</SelectItem>
                  <SelectItem value="follow_up">📋 Uppföljning</SelectItem>
                  <SelectItem value="work">💻 Arbete</SelectItem>
                  <SelectItem value="personal">👤 Personligt</SelectItem>
                  <SelectItem value="leisure">🎉 Fritid</SelectItem>
                  <SelectItem value="other">📌 Annat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {calendars && calendars.length > 0 && (
              <div>
                <Label htmlFor="calendar">Kalender</Label>
                <Select value={calendarId} onValueChange={setCalendarId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Välj kalender" />
                  </SelectTrigger>
                  <SelectContent>
                    {calendars.map(cal => (
                      <SelectItem key={cal.id} value={cal.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: cal.color }}
                          />
                          {cal.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="address">Adress</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="T.ex. Storgatan 1, Stockholm"
            />
          </div>

          <div>
            <Label htmlFor="notes">Anteckningar</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              placeholder="T.ex. Konferensrum A, Zoom-länk, eller andra anteckningar"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="contact_person">Kontaktperson</Label>
              <Input
                id="contact_person"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                placeholder="Namn"
              />
            </div>

            <div>
              <Label htmlFor="contact_email">E-post</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                placeholder="exempel@mail.com"
              />
            </div>

            <div>
              <Label htmlFor="contact_phone">Telefon</Label>
              <Input
                id="contact_phone"
                type="tel"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                onBlur={(e) => {
                  // Normalize phone number when user leaves the field
                  if (e.target.value) {
                    const normalized = normalizePhoneNumber(e.target.value);
                    setFormData({ ...formData, contact_phone: normalized });
                  }
                }}
                placeholder="+46 70 123 45 67"
              />
            </div>
          </div>

          {/* Reminders */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Påminnelser</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={addReminder}
              >
                + Lägg till påminnelse
              </Button>
            </div>
            {reminders.length > 0 && (
              <div className="space-y-2">
                {reminders.map((minutes, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Select 
                      value={minutes.toString()} 
                      onValueChange={(value) => updateReminder(index, parseInt(value))}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 minuter före</SelectItem>
                        <SelectItem value="10">10 minuter före</SelectItem>
                        <SelectItem value="15">15 minuter före</SelectItem>
                        <SelectItem value="30">30 minuter före</SelectItem>
                        <SelectItem value="60">1 timme före</SelectItem>
                        <SelectItem value="120">2 timmar före</SelectItem>
                        <SelectItem value="1440">1 dag före</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeReminder(index)}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4 border-t">
            <div>
              {event && onDelete && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={handleDelete}
                  disabled={loading}
                >
                  Ta bort
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={loading}
              >
                Avbryt
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Sparar...' : (event ? 'Uppdatera' : 'Skapa')}
              </Button>
            </div>
          </div>
          <div className="text-xs text-muted-foreground text-center">
            Tryck <kbd className="px-1.5 py-0.5 rounded bg-muted">Esc</kbd> för att avbryta, <kbd className="px-1.5 py-0.5 rounded bg-muted">Ctrl+Enter</kbd> för att spara
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
