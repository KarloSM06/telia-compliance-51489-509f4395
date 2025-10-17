import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAvailability } from '@/hooks/useAvailability';
import { WeeklyScheduleGrid } from './WeeklyScheduleGrid';
import { Clock, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addWeeks, startOfWeek } from 'date-fns';
import { sv } from 'date-fns/locale';

export const AvailabilitySettings = () => {
  const { slots, loading, replaceWeeklySchedule, fetchSlots } = useAvailability();
  const [useTemplateMode, setUseTemplateMode] = useState(true);
  const [currentWeekStart, setCurrentWeekStart] = useState(() => 
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const handlePreviousWeek = () => {
    const newWeek = addWeeks(currentWeekStart, -1);
    setCurrentWeekStart(newWeek);
    fetchSlots(newWeek.toISOString().split('T')[0]);
  };

  const handleNextWeek = () => {
    const newWeek = addWeeks(currentWeekStart, 1);
    setCurrentWeekStart(newWeek);
    fetchSlots(newWeek.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    const today = startOfWeek(new Date(), { weekStartsOn: 1 });
    setCurrentWeekStart(today);
    fetchSlots(today.toISOString().split('T')[0]);
  };

  const handleTemplateModeChange = (checked: boolean) => {
    setUseTemplateMode(checked);
    if (checked) {
      fetchSlots();
    } else {
      fetchSlots(currentWeekStart.toISOString().split('T')[0]);
    }
  };

  const handleSave = (slotsData: any[]) => {
    const weekDate = useTemplateMode ? undefined : currentWeekStart.toISOString().split('T')[0];
    replaceWeeklySchedule(slotsData, weekDate);
  };

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

        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-3">
            <Switch
              id="template-mode"
              checked={useTemplateMode}
              onCheckedChange={handleTemplateModeChange}
            />
            <Label htmlFor="template-mode" className="cursor-pointer">
              Samma schema varje vecka
            </Label>
          </div>

          {!useTemplateMode && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleToday}>
                Idag
              </Button>
              <span className="text-sm font-medium min-w-[150px] text-center">
                Vecka {format(currentWeekStart, 'w, yyyy', { locale: sv })}
              </span>
              <Button variant="outline" size="sm" onClick={handleNextWeek}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <WeeklyScheduleGrid
            existingSlots={slots}
            onSave={handleSave}
            loading={loading}
            weekStartDate={useTemplateMode ? undefined : currentWeekStart}
            isTemplateMode={useTemplateMode}
          />
        </div>
      </CardContent>
    </Card>
  );
};
