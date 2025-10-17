import { useState, useEffect, useRef } from "react";
import { format, parseISO } from "date-fns";
import { sv } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { CalendarEvent } from "@/hooks/useCalendarEvents";
import { toast } from "sonner";

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  event?: CalendarEvent | null;
  defaultDate?: Date;
  onSave: (event: Partial<CalendarEvent>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  pendingChanges?: Partial<CalendarEvent>;
}

export const EventModal = ({ open, onClose, event, defaultDate, onSave, onDelete, pendingChanges }: EventModalProps) => {
  // Merge event with pending changes for display
  const currentEvent = event && pendingChanges ? { ...event, ...pendingChanges } : event;
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: currentEvent?.title || '',
    description: currentEvent?.description || '',
    start_time: currentEvent?.start_time || (defaultDate ? format(defaultDate, "yyyy-MM-dd'T'HH:mm") : ''),
    end_time: currentEvent?.end_time || '',
    event_type: currentEvent?.event_type || 'meeting',
    contact_person: currentEvent?.contact_person || '',
    contact_email: currentEvent?.contact_email || '',
    contact_phone: currentEvent?.contact_phone || '',
  });
  const [loading, setLoading] = useState(false);

  // Autofocus title field and update form when event or pending changes update
  useEffect(() => {
    if (open) {
      setTimeout(() => titleInputRef.current?.focus(), 100);
      setFormData({
        title: currentEvent?.title || '',
        description: currentEvent?.description || '',
        start_time: currentEvent?.start_time || (defaultDate ? format(defaultDate, "yyyy-MM-dd'T'HH:mm") : ''),
        end_time: currentEvent?.end_time || '',
        event_type: currentEvent?.event_type || 'meeting',
        contact_person: currentEvent?.contact_person || '',
        contact_email: currentEvent?.contact_email || '',
        contact_phone: currentEvent?.contact_phone || '',
      });
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
      await onSave({
        ...formData,
        source: 'internal',
        status: 'scheduled',
      });
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
      other: 'Annat',
    };
    return labels[type] || type;
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
            <DialogDescription>
              {format(parseISO(formData.start_time), 'EEEE d MMM yyyy, HH:mm', { locale: sv })}
              {formData.end_time && ` - ${format(parseISO(formData.end_time), 'HH:mm', { locale: sv })}`}
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
            <div>
              <Label htmlFor="start_time">Starttid *</Label>
              <Input
                id="start_time"
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="end_time">Sluttid *</Label>
              <Input
                id="end_time"
                type="datetime-local"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="event_type">Typ</Label>
            <Select value={formData.event_type} onValueChange={(value) => setFormData({ ...formData, event_type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting">Möte</SelectItem>
                <SelectItem value="call">Samtal</SelectItem>
                <SelectItem value="demo">Demo</SelectItem>
                <SelectItem value="follow_up">Uppföljning</SelectItem>
                <SelectItem value="other">Annat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="contact_person">Kontaktperson</Label>
              <Input
                id="contact_person"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="contact_email">E-post</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="contact_phone">Telefon</Label>
              <Input
                id="contact_phone"
                type="tel"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
              />
            </div>
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
