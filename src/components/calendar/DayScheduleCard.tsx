import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Lock, Unlock } from 'lucide-react';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isLocked?: boolean;
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
  onToggleLock: (slotId: string) => void;
}

export const DayScheduleCard = ({
  dayName,
  enabled,
  timeSlots,
  onToggle,
  onUpdateSlot,
  onAddSlot,
  onRemoveSlot,
  onToggleLock,
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
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-3">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Från</Label>
                      <Input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => onUpdateSlot(slot.id, { startTime: e.target.value })}
                        className="text-lg font-semibold h-12 w-full"
                        disabled={slot.isLocked}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Till</Label>
                      <Input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => onUpdateSlot(slot.id, { endTime: e.target.value })}
                        className="text-lg font-semibold h-12 w-full"
                        disabled={slot.isLocked}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 pt-8">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onToggleLock(slot.id)}
                      className="flex-shrink-0"
                      title={slot.isLocked ? "Lås upp period" : "Lås period"}
                    >
                      {slot.isLocked ? (
                        <Lock className="h-4 w-4 text-yellow-600" />
                      ) : (
                        <Unlock className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveSlot(slot.id)}
                      className="flex-shrink-0"
                      title="Ta bort period"
                      disabled={slot.isLocked}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
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
