import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarView } from "@/components/calendar/CalendarView";
import { DayView } from "@/components/calendar/DayView";
import { WeekView } from "@/components/calendar/WeekView";
import { YearView } from "@/components/calendar/YearView";
import { EventModal } from "@/components/calendar/EventModal";
import { IntegrationSetupModal } from "@/components/calendar/IntegrationSetupModal";
import { AvailabilitySettings } from "@/components/calendar/AvailabilitySettings";
import { useCalendarEvents, CalendarEvent } from "@/hooks/useCalendarEvents";
import { useBookingIntegrations } from "@/hooks/useBookingIntegrations";
import { Plus, Settings, Calendar, CalendarDays, CalendarRange, CalendarClock } from "lucide-react";
import { addMinutes, isSameDay, startOfWeek, endOfWeek, isWithinInterval, format } from "date-fns";
import { sv } from "date-fns/locale";
import { checkEventConflicts } from "@/lib/calendarUtils";
import { toast } from "sonner";
import { useUserTimezone } from "@/hooks/useUserTimezone";

const CalendarPage = () => {
  const { timezone } = useUserTimezone();
  const { events, loading, createEvent, updateEvent, deleteEvent } = useCalendarEvents();
  const { integrations, createIntegration, updateIntegration, deleteIntegration, triggerSync } = useBookingIntegrations();
  
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day' | 'year'>('month');
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDay(date);
    setCurrentView('day');
  };

  const handleBackToMonth = () => {
    setCurrentView('month');
  };

  const handleViewWeek = () => {
    setCurrentView('week');
  };

  const handleQuickCreate = async (time: Date) => {
    // Create event directly with default values
    const endTime = addMinutes(time, 30);
    await createEvent({
      title: 'Ny händelse',
      start_time: time.toISOString(),
      end_time: endTime.toISOString(),
      event_type: 'meeting',
      status: 'scheduled',
      source: 'internal',
    });
  };

  const handleEventSave = async (eventData: Partial<CalendarEvent>) => {
    // Check for conflicts
    if (eventData.start_time && eventData.end_time) {
      const tempEvent = {
        id: selectedEvent?.id || 'temp',
        title: eventData.title || '',
        start_time: eventData.start_time,
        end_time: eventData.end_time,
        event_type: eventData.event_type || 'meeting',
        status: 'scheduled',
        source: 'internal',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as CalendarEvent;

      const conflicts = checkEventConflicts(tempEvent, events.filter(e => e.id !== selectedEvent?.id), timezone);
      
      if (conflicts.length > 0) {
        toast.warning(`⚠️ Denna händelse överlappar med ${conflicts.length} andra händelse(r)`, {
          description: conflicts.map(e => `• ${e.title} (${format(new Date(e.start_time), 'HH:mm')} - ${format(new Date(e.end_time), 'HH:mm')})`).join('\n'),
          duration: 5000,
        });
      }
    }

    if (selectedEvent?.id) {
      await updateEvent(selectedEvent.id, eventData);
    } else {
      await createEvent(eventData);
    }
    setShowEventModal(false);
    setSelectedEvent(null);
    setSelectedDate(null);
  };

  const handleCloseModal = () => {
    setShowEventModal(false);
    setSelectedEvent(null);
    setSelectedDate(null);
  };

  // Filter events based on current view
  const filteredEvents = (() => {
    if (currentView === 'day') {
      return events.filter(e => isSameDay(new Date(e.start_time), selectedDay));
    }
    if (currentView === 'week') {
      const weekStart = startOfWeek(selectedDay, { locale: sv, weekStartsOn: 1 });
      const weekEnd = endOfWeek(selectedDay, { locale: sv, weekStartsOn: 1 });
      return events.filter(e => 
        isWithinInterval(new Date(e.start_time), { start: weekStart, end: weekEnd })
      );
    }
    return events;
  })();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 text-white mb-8 mx-6 mt-6">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Kalender & CRM</h1>
          <p className="text-lg opacity-90 mb-6">
            Hantera dina möten och synka med befintliga bokningssystem
          </p>
        </div>
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]" />
      </div>

      {/* Navigation with Minimalist Pill Design */}
      <div className="px-6 mb-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          {/* View selector - Pill Design */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant={currentView === 'year' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentView('year')}
              className="gap-2 px-6 py-3 rounded-full border shadow-sm hover:shadow-md transition-all duration-200"
            >
              <CalendarClock className="h-5 w-5" />
              <span className="font-medium">År</span>
            </Button>
            <Button
              variant={currentView === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentView('month')}
              className="gap-2 px-6 py-3 rounded-full border shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Calendar className="h-5 w-5" />
              <span className="font-medium">Månad</span>
            </Button>
            <Button
              variant={currentView === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={handleViewWeek}
              className="gap-2 px-6 py-3 rounded-full border shadow-sm hover:shadow-md transition-all duration-200"
            >
              <CalendarRange className="h-5 w-5" />
              <span className="font-medium">Vecka</span>
            </Button>
            <Button
              variant={currentView === 'day' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDateClick(selectedDay)}
              className="gap-2 px-6 py-3 rounded-full border shadow-sm hover:shadow-md transition-all duration-200"
            >
              <CalendarDays className="h-5 w-5" />
              <span className="font-medium">Dag</span>
            </Button>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 items-center">
            <Button 
              onClick={() => setShowIntegrationModal(true)} 
              variant="outline" 
              className="gap-2 px-6 py-3 rounded-full border shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Settings className="h-5 w-5" />
              <span className="font-medium">Integrationer</span>
              {integrations.length > 0 && (
                <Badge variant="secondary" className="ml-1">{integrations.length}</Badge>
              )}
            </Button>

            {/* Integration badges */}
            {integrations.slice(0, 3).map(int => (
              <Badge 
                key={int.id}
                variant={int.is_enabled && int.last_sync_status === 'success' ? 'default' : 'secondary'}
                className="cursor-pointer hover:opacity-80 transition-opacity px-3 py-1 rounded-full"
                onClick={() => setShowIntegrationModal(true)}
              >
                {int.provider_display_name}
                {!int.is_enabled && <span className="ml-1">⏸</span>}
                {int.last_sync_status === 'error' && <span className="ml-1">⚠️</span>}
              </Badge>
            ))}
            {integrations.length > 3 && (
              <Badge variant="outline" className="cursor-pointer rounded-full px-3 py-1" onClick={() => setShowIntegrationModal(true)}>
                +{integrations.length - 3}
              </Badge>
            )}

            <Button 
              onClick={() => {
                setSelectedEvent(null);
                setSelectedDate(new Date());
                setShowEventModal(true);
              }}
              className="gap-2 px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Skapa händelse</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Year view */}
      {currentView === 'year' && (
        <YearView
          date={selectedDay}
          events={events}
          onEventClick={handleEventClick}
          onDateChange={setSelectedDay}
          onDayClick={(date) => {
            setSelectedDay(date);
            setCurrentView('day');
          }}
        />
      )}

      {/* Month view */}
      {currentView === 'month' && (
        <div className="px-6 pb-8 space-y-6 flex-1 overflow-auto">
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList className="flex gap-3 bg-transparent border-0 p-0 mb-6">
              <TabsTrigger 
                value="calendar"
                className="relative z-10 gap-2 px-6 py-3 bg-card text-foreground border border-border rounded-full shadow-sm hover:shadow-md hover:bg-accent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-md transition-all duration-200"
              >
                <Calendar className="h-5 w-5" />
                <span className="font-medium">Kalender</span>
              </TabsTrigger>
              <TabsTrigger 
                value="availability"
                className="relative z-10 gap-2 px-6 py-3 bg-card text-foreground border border-border rounded-full shadow-sm hover:shadow-md hover:bg-accent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-md transition-all duration-200"
              >
                <CalendarClock className="h-5 w-5" />
                <span className="font-medium">Min Tillgänglighet</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="calendar" className="space-y-6">
              <CalendarView
                events={events}
                onEventClick={handleEventClick}
                onDateClick={handleDateClick}
              />

              {showEventModal && (
                <EventModal
                  open={showEventModal}
                  onClose={handleCloseModal}
                  event={selectedEvent}
                  defaultDate={selectedDate || undefined}
                  onSave={handleEventSave}
                  onDelete={deleteEvent}
                />
              )}
            </TabsContent>

            <TabsContent value="availability">
              <AvailabilitySettings />
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Week view */}
      {currentView === 'week' && (
        <WeekView
          date={selectedDay}
          events={filteredEvents}
          onEventClick={handleEventClick}
          onEventUpdate={updateEvent}
          onBackToMonth={handleBackToMonth}
          onCreate={handleQuickCreate}
          onDateChange={setSelectedDay}
          onDelete={deleteEvent}
          showEventModal={showEventModal}
          selectedEvent={selectedEvent}
          onCloseModal={handleCloseModal}
          onEventSave={handleEventSave}
        />
      )}

      {/* Day view */}
      {currentView === 'day' && (
        <DayView
          date={selectedDay}
          events={filteredEvents}
          onEventClick={handleEventClick}
          onEventUpdate={updateEvent}
          onBackToMonth={handleBackToMonth}
          onCreate={handleQuickCreate}
          onDateChange={setSelectedDay}
          onDelete={deleteEvent}
          showEventModal={showEventModal}
          selectedEvent={selectedEvent}
          onCloseModal={handleCloseModal}
          onEventSave={handleEventSave}
        />
      )}

      {/* Integration setup modal */}
      <IntegrationSetupModal
        open={showIntegrationModal}
        onClose={() => setShowIntegrationModal(false)}
        onSave={createIntegration}
        existingIntegrations={integrations}
      />
    </div>
  );
};

export default CalendarPage;
