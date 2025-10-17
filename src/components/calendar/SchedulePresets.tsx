import { Button } from '@/components/ui/button';
import { Clock, Briefcase, CalendarClock } from 'lucide-react';

interface SchedulePresetsProps {
  onSelectPreset: (preset: PresetSchedule) => void;
}

export interface PresetSchedule {
  name: string;
  days: number[];
  startTime: string;
  endTime: string;
}

const PRESETS: PresetSchedule[] = [
  {
    name: 'Vardagar 9-17',
    days: [1, 2, 3, 4, 5], // Måndag-Fredag
    startTime: '09:00',
    endTime: '17:00',
  },
  {
    name: 'Heltid flex',
    days: [1, 2, 3, 4, 5],
    startTime: '08:00',
    endTime: '18:00',
  },
  {
    name: 'Deltid (halvdag)',
    days: [1, 2, 3, 4, 5],
    startTime: '09:00',
    endTime: '13:00',
  },
];

export const SchedulePresets = ({ onSelectPreset }: SchedulePresetsProps) => {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Snabbmallar:</p>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <Button
            key={preset.name}
            variant="outline"
            size="sm"
            onClick={() => onSelectPreset(preset)}
            className="gap-2"
          >
            {preset.name === 'Vardagar 9-17' && <Clock className="h-4 w-4" />}
            {preset.name === 'Heltid flex' && <Briefcase className="h-4 w-4" />}
            {preset.name === 'Deltid (halvdag)' && <CalendarClock className="h-4 w-4" />}
            {preset.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
