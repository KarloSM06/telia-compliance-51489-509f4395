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
          <div className="space-y-2">
            {timeSlots.map((slot) => (
              <div key={slot.id} className="flex gap-2 items-center">
                <div className="flex-1 space-y-1">
                  <Input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => onUpdateSlot(slot.id, { startTime: e.target.value })}
                    className="text-sm"
                  />
                </div>
                <span className="text-muted-foreground">-</span>
                <div className="flex-1 space-y-1">
                  <Input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => onUpdateSlot(slot.id, { endTime: e.target.value })}
                    className="text-sm"
                  />
                </div>
                {timeSlots.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveSlot(slot.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={onAddSlot}
              className="w-full"
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
