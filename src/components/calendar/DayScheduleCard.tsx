import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

interface DayScheduleCardProps {
  dayName: string;
  dayIndex: number;
  enabled: boolean;
  timeSlots: TimeSlot[];
  onToggle: (enabled: boolean) => void;
  onUpdateSlot: (slotId: string, updates: Partial<TimeSlot>) => void;
  onAddSlot: () => void;
  onRemoveSlot: (slotId: string) => void;
}

export const DayScheduleCard = ({
  dayName,
  enabled,
  timeSlots,
  onToggle,
  onUpdateSlot,
  onAddSlot,
  onRemoveSlot,
}: DayScheduleCardProps) => {
  return (
    <Card className={`p-4 transition-colors ${enabled ? 'bg-card' : 'bg-muted/50'}`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="font-semibold">{dayName}</Label>
          <Switch checked={enabled} onCheckedChange={onToggle} />
        </div>

        {enabled && (
          <div className="space-y-3">
            {timeSlots.map((slot) => (
              <div key={slot.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <Label className="text-xs text-muted-foreground mb-1 block">Från</Label>
                    <Input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => onUpdateSlot(slot.id, { startTime: e.target.value })}
                      className="text-sm w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Label className="text-xs text-muted-foreground mb-1 block">Till</Label>
                    <Input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => onUpdateSlot(slot.id, { endTime: e.target.value })}
                      className="text-sm w-full"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveSlot(slot.id)}
                    className="mt-5 flex-shrink-0"
                    title="Ta bort period"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={onAddSlot}
              className="w-full mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Lägg till period
            </Button>
          </div>
        )}

        {!enabled && (
          <p className="text-sm text-muted-foreground text-center py-2">Inaktiv</p>
        )}
      </div>
    </Card>
  );
};
