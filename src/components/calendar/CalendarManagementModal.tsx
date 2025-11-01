import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { Calendar } from "@/hooks/useCalendars";
import { toast } from "sonner";

interface CalendarManagementModalProps {
  open: boolean;
  onClose: () => void;
  calendars: Calendar[];
  onCreateCalendar: (calendar: Partial<Calendar>) => Promise<any>;
  onUpdateCalendar: (id: string, updates: Partial<Calendar>) => Promise<any>;
  onDeleteCalendar: (id: string) => Promise<void>;
}

const PRESET_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
];

export const CalendarManagementModal = ({ 
  open, 
  onClose, 
  calendars,
  onCreateCalendar,
  onUpdateCalendar,
  onDeleteCalendar
}: CalendarManagementModalProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3b82f6',
    is_default: false,
  });

  const handleStartCreate = () => {
    setIsCreating(true);
    setFormData({
      name: '',
      description: '',
      color: '#3b82f6',
      is_default: false,
    });
  };

  const handleStartEdit = (calendar: Calendar) => {
    setEditingId(calendar.id);
    setFormData({
      name: calendar.name,
      description: calendar.description || '',
      color: calendar.color,
      is_default: calendar.is_default,
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Kalendernamn krävs");
      return;
    }

    try {
      if (isCreating) {
        await onCreateCalendar(formData);
        setIsCreating(false);
      } else if (editingId) {
        await onUpdateCalendar(editingId, formData);
        setEditingId(null);
      }
      setFormData({
        name: '',
        description: '',
        color: '#3b82f6',
        is_default: false,
      });
    } catch (error) {
      // Error already handled in hooks
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      color: '#3b82f6',
      is_default: false,
    });
  };

  const handleDelete = async (id: string, calendar: Calendar) => {
    if (calendar.is_default) {
      toast.error("Kan inte ta bort standardkalendern");
      return;
    }

    if (window.confirm(`Är du säker på att du vill ta bort kalendern "${calendar.name}"? Händelser i kalendern kommer att flyttas till standardkalendern.`)) {
      await onDeleteCalendar(id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Hantera kalendrar</DialogTitle>
          <DialogDescription>
            Skapa, redigera och ta bort dina kalendrar. En kalender måste vara standard.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Existing calendars */}
          <div className="space-y-2">
            {calendars.map(calendar => (
              <div 
                key={calendar.id} 
                className="p-4 border rounded-lg space-y-3"
              >
                {editingId === calendar.id ? (
                  // Edit mode
                  <div className="space-y-3">
                    <div>
                      <Label>Namn</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Kalendernamn"
                      />
                    </div>
                    <div>
                      <Label>Beskrivning</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Beskrivning (valfritt)"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>Färg</Label>
                      <div className="flex gap-2 flex-wrap mt-2">
                        {PRESET_COLORS.map(color => (
                          <button
                            key={color}
                            type="button"
                            className={`w-8 h-8 rounded-full border-2 ${formData.color === color ? 'border-foreground' : 'border-transparent'}`}
                            style={{ backgroundColor: color }}
                            onClick={() => setFormData({ ...formData, color })}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={formData.is_default}
                          onCheckedChange={(checked) => setFormData({ ...formData, is_default: checked })}
                        />
                        <Label>Standardkalender</Label>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSave}>
                          <Check className="h-4 w-4 mr-1" />
                          Spara
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>
                          <X className="h-4 w-4 mr-1" />
                          Avbryt
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: calendar.color }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{calendar.name}</span>
                          {calendar.is_default && (
                            <Badge variant="secondary" className="text-xs">
                              Standard
                            </Badge>
                          )}
                        </div>
                        {calendar.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {calendar.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStartEdit(calendar)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      {!calendar.is_default && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDelete(calendar.id, calendar)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Create new calendar */}
          {isCreating ? (
            <div className="p-4 border rounded-lg border-dashed space-y-3">
              <div>
                <Label>Namn</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="T.ex. Arbete, Personligt, Projekt"
                  autoFocus
                />
              </div>
              <div>
                <Label>Beskrivning</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Beskrivning (valfritt)"
                  rows={2}
                />
              </div>
              <div>
                <Label>Färg</Label>
                <div className="flex gap-2 flex-wrap mt-2">
                  {PRESET_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${formData.color === color ? 'border-foreground' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({ ...formData, color })}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_default}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_default: checked })}
                  />
                  <Label>Standardkalender</Label>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave}>
                    <Check className="h-4 w-4 mr-1" />
                    Skapa
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-1" />
                    Avbryt
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleStartCreate}
            >
              <Plus className="h-4 w-4 mr-2" />
              Lägg till kalender
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
