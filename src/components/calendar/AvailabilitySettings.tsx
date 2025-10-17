import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAvailability } from '@/hooks/useAvailability';
import { WeeklyScheduleGrid } from './WeeklyScheduleGrid';
import { Clock } from 'lucide-react';

export const AvailabilitySettings = () => {
  const { slots, loading, replaceWeeklySchedule } = useAvailability();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Min Tillgänglighet
        </CardTitle>
        <CardDescription>
          Ange när du är tillgänglig för möten. Röstagenten kan använda denna information för att boka möten.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <WeeklyScheduleGrid
          existingSlots={slots}
          onSave={replaceWeeklySchedule}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
};
