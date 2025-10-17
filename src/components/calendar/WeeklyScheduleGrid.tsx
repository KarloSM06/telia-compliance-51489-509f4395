import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DayScheduleCard } from './DayScheduleCard';
import { SchedulePresets, PresetSchedule } from './SchedulePresets';
import { Save, RotateCcw } from 'lucide-react';
import { AvailabilitySlot } from '@/hooks/useAvailability';

const DAYS = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'];

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

interface DaySchedule {
  enabled: boolean;
  timeSlots: TimeSlot[];
}

interface WeeklySchedule {
  [dayIndex: number]: DaySchedule;
}

interface WeeklyScheduleGridProps {
  existingSlots: AvailabilitySlot[];
  onSave: (slots: Omit<AvailabilitySlot, 'id' | 'created_at' | 'updated_at' | 'user_id'>[]) => void;
  loading: boolean;
}

export const WeeklyScheduleGrid = ({ existingSlots, onSave, loading }: WeeklyScheduleGridProps) => {
  const [schedule, setSchedule] = useState<WeeklySchedule>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize schedule from existing slots
  useEffect(() => {
    const initialSchedule: WeeklySchedule = {};
    
    // Initialize all days as disabled
    for (let i = 0; i < 7; i++) {
      initialSchedule[i] = { enabled: false, timeSlots: [] };
    }

    // Group existing slots by day
    existingSlots.forEach((slot) => {
      const dayIndex = slot.day_of_week;
      if (!initialSchedule[dayIndex]) {
        initialSchedule[dayIndex] = { enabled: true, timeSlots: [] };
      }
      initialSchedule[dayIndex].enabled = true;
      initialSchedule[dayIndex].timeSlots.push({
        id: slot.id || `temp-${Date.now()}-${Math.random()}`,
        startTime: slot.start_time.substring(0, 5),
        endTime: slot.end_time.substring(0, 5),
      });
    });

    setSchedule(initialSchedule);
  }, [existingSlots]);

  const handleToggleDay = (dayIndex: number, enabled: boolean) => {
    setSchedule((prev) => ({
      ...prev,
      [dayIndex]: {
        enabled,
        timeSlots: enabled ? [{ id: `temp-${Date.now()}`, startTime: '09:00', endTime: '17:00' }] : [],
      },
    }));
    setHasChanges(true);
  };

  const handleUpdateSlot = (dayIndex: number, slotId: string, updates: Partial<TimeSlot>) => {
    setSchedule((prev) => ({
      ...prev,
      [dayIndex]: {
        ...prev[dayIndex],
        timeSlots: prev[dayIndex].timeSlots.map((slot) =>
          slot.id === slotId ? { ...slot, ...updates } : slot
        ),
      },
    }));
    setHasChanges(true);
  };

  const handleAddSlot = (dayIndex: number) => {
    setSchedule((prev) => ({
      ...prev,
      [dayIndex]: {
        ...prev[dayIndex],
        timeSlots: [
          ...prev[dayIndex].timeSlots,
          { id: `temp-${Date.now()}`, startTime: '09:00', endTime: '17:00' },
        ],
      },
    }));
    setHasChanges(true);
  };

  const handleRemoveSlot = (dayIndex: number, slotId: string) => {
    setSchedule((prev) => ({
      ...prev,
      [dayIndex]: {
        ...prev[dayIndex],
        timeSlots: prev[dayIndex].timeSlots.filter((slot) => slot.id !== slotId),
      },
    }));
    setHasChanges(true);
  };

  const handleSelectPreset = (preset: PresetSchedule) => {
    const newSchedule: WeeklySchedule = {};
    
    for (let i = 0; i < 7; i++) {
      if (preset.days.includes(i)) {
        newSchedule[i] = {
          enabled: true,
          timeSlots: [{ id: `temp-${Date.now()}-${i}`, startTime: preset.startTime, endTime: preset.endTime }],
        };
      } else {
        newSchedule[i] = { enabled: false, timeSlots: [] };
      }
    }
    
    setSchedule(newSchedule);
    setHasChanges(true);
  };

  const handleSave = () => {
    const slots: Omit<AvailabilitySlot, 'id' | 'created_at' | 'updated_at' | 'user_id'>[] = [];

    Object.entries(schedule).forEach(([dayIndex, daySchedule]) => {
      if (daySchedule.enabled) {
        daySchedule.timeSlots.forEach((slot) => {
          slots.push({
            day_of_week: parseInt(dayIndex),
            start_time: slot.startTime,
            end_time: slot.endTime,
            is_active: true,
          });
        });
      }
    });

    onSave(slots);
    setHasChanges(false);
  };

  const handleReset = () => {
    const initialSchedule: WeeklySchedule = {};
    
    for (let i = 0; i < 7; i++) {
      initialSchedule[i] = { enabled: false, timeSlots: [] };
    }

    existingSlots.forEach((slot) => {
      const dayIndex = slot.day_of_week;
      if (!initialSchedule[dayIndex]) {
        initialSchedule[dayIndex] = { enabled: true, timeSlots: [] };
      }
      initialSchedule[dayIndex].enabled = true;
      initialSchedule[dayIndex].timeSlots.push({
        id: slot.id || `temp-${Date.now()}-${Math.random()}`,
        startTime: slot.start_time.substring(0, 5),
        endTime: slot.end_time.substring(0, 5),
      });
    });

    setSchedule(initialSchedule);
    setHasChanges(false);
  };

  const calculateTotalHours = () => {
    let totalMinutes = 0;

    Object.values(schedule).forEach((daySchedule) => {
      if (daySchedule.enabled) {
        daySchedule.timeSlots.forEach((slot) => {
          const [startHour, startMin] = slot.startTime.split(':').map(Number);
          const [endHour, endMin] = slot.endTime.split(':').map(Number);
          const minutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
          totalMinutes += minutes;
        });
      }
    });

    return (totalMinutes / 60).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <SchedulePresets onSelectPreset={handleSelectPreset} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {DAYS.map((dayName, index) => (
          <DayScheduleCard
            key={index}
            dayName={dayName}
            dayIndex={index}
            enabled={schedule[index]?.enabled || false}
            timeSlots={schedule[index]?.timeSlots || []}
            onToggle={(enabled) => handleToggleDay(index, enabled)}
            onUpdateSlot={(slotId, updates) => handleUpdateSlot(index, slotId, updates)}
            onAddSlot={() => handleAddSlot(index)}
            onRemoveSlot={(slotId) => handleRemoveSlot(index, slotId)}
          />
        ))}
      </div>

      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <div className="space-y-1">
          <p className="text-sm font-medium">Totalt antal timmar per vecka</p>
          <p className="text-2xl font-bold">{calculateTotalHours()}h</p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Ångra ändringar
            </Button>
          )}
          <Button onClick={handleSave} disabled={loading || !hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            Spara schema
          </Button>
        </div>
      </div>
    </div>
  );
};
