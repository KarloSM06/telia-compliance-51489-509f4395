import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAvailability } from '@/hooks/useAvailability';
import { WeeklyScheduleGrid } from './WeeklyScheduleGrid';
import { Clock, Info } from 'lucide-react';

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
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            AI-receptionisten kan bara boka möten under dina tillgänglighetstider. 
            Alla händelser du lägger till i kalendern blockerar automatiskt den tiden från bokning.
          </AlertDescription>
        </Alert>
        
        <WeeklyScheduleGrid
          existingSlots={slots}
          onSave={replaceWeeklySchedule}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
};
