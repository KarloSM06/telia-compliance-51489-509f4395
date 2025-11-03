import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarView } from "@/components/calendar/CalendarView";
import { DayView } from "@/components/calendar/DayView";
import { WeekView } from "@/components/calendar/WeekView";
import { YearView } from "@/components/calendar/YearView";
import { TimelineView } from "@/components/calendar/TimelineView";
import { EventModal } from "@/components/calendar/EventModal";
import { IntegrationSetupModal } from "@/components/calendar/IntegrationSetupModal";
import { AvailabilitySettings } from "@/components/calendar/AvailabilitySettings";
import { CalendarSelector } from "@/components/calendar/CalendarSelector";
import { CalendarManagementModal } from "@/components/calendar/CalendarManagementModal";
import { useCalendarEvents, CalendarEvent } from "@/hooks/useCalendarEvents";
import { useCalendars } from "@/hooks/useCalendars";
import { useBookingIntegrations } from "@/hooks/useBookingIntegrations";
import { Plus, Settings, Calendar, CalendarDays, CalendarRange, CalendarClock, List, FolderKanban } from "lucide-react";
import { addMinutes, isSameDay, startOfWeek, endOfWeek, isWithinInterval, format } from "date-fns";
import { sv } from "date-fns/locale";
import { checkEventConflicts } from "@/lib/calendarUtils";
import { toast } from "sonner";
import { useUserTimezone } from "@/hooks/useUserTimezone";

const CalendarPage = () => {
  const { timezone } = useUserTimezone();
  const { calendars, defaultCalendar, createCalendar, updateCalendar, deleteCalendar } = useCalendars();
  const { events, loading, createEvent, updateEvent, deleteEvent, refetch } = useCalendarEvents();
  const { integrations, createIntegration, updateIntegration, deleteIntegration, triggerSync } = useBookingIntegrations();
  
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day' | 'year' | 'timeline'>('month');
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [showCalendarManagement, setShowCalendarManagement] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCalendarId, setSelectedCalendarId] = useState<string | 'all'>('all');

  // Refetch events when selected calendar changes
  useEffect(() => {
    refetch(selectedCalendarId);
  }, [selectedCalendarId]);

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

  const handleEventSave = async (eventData: Partial<CalendarEvent>, calendarId?: string) => {
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
      await createEvent(eventData, calendarId || (selectedCalendarId !== 'all' ? selectedCalendarId : defaultCalendar?.id));
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
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Premium Hero Section with Calendar Theme */}
      <div className="relative border-b bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-background overflow-hidden">
        {/* Floating Calendar Icons Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-[10%] animate-float opacity-20">
            <Calendar className="h-16 w-16 text-blue-500" />
          </div>
          <div className="absolute top-20 right-[15%] animate-float opacity-15" style={{ animationDelay: '1s' }}>
            <CalendarDays className="h-12 w-12 text-purple-500" />
          </div>
          <div className="absolute bottom-10 left-[20%] animate-float opacity-10" style={{ animationDelay: '2s' }}>
            <CalendarClock className="h-20 w-20 text-blue-400" />
          </div>
          <div className="absolute top-1/2 right-[25%] animate-float opacity-15" style={{ animationDelay: '1.5s' }}>
            <CalendarRange className="h-14 w-14 text-purple-400" />
          </div>
        </div>

        <div className="relative px-6 py-8">
          <div className="flex justify-between items-start">
            <div className="space-y-2 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/10 rounded-xl backdrop-blur-sm animate-scale-in">
                  <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Kalender & CRM
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Hantera dina möten och synka med befintliga bokningssystem
                  </p>
                </div>
              </div>

              {/* Active Integrations Badge */}
              {integrations.filter(i => i.is_enabled).length > 0 && (
                <div className="flex items-center gap-2 animate-slide-in-right">
                  <div className="px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 border border-emerald-500/30 rounded-full backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        {integrations.filter(i => i.is_enabled).length} aktiv{integrations.filter(i => i.is_enabled).length !== 1 ? 'a' : ''} integration{integrations.filter(i => i.is_enabled).length !== 1 ? 'er' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 items-center animate-slide-in-right">
              {/* Calendar selector */}
              {calendars.length > 0 && (
                <CalendarSelector
                  calendars={calendars}
                  selectedCalendarId={selectedCalendarId}
                  onSelect={setSelectedCalendarId}
                />
              )}
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowCalendarManagement(true)}
                className="gap-2 backdrop-blur-sm hover:scale-105 transition-transform"
              >
                <FolderKanban className="h-4 w-4" />
                Hantera kalendrar
              </Button>
              
              <Button onClick={() => setShowIntegrationModal(true)} variant="outline" className="gap-2 backdrop-blur-sm hover:scale-105 transition-transform">
                <Settings className="h-4 w-4" />
                Integrationer
                {integrations.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{integrations.length}</Badge>
                )}
              </Button>

              <Button 
                onClick={() => {
                  setSelectedEvent(null);
                  setSelectedDate(new Date());
                  setShowEventModal(true);
                }}
                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <Plus className="h-4 w-4" />
                Skapa händelse
              </Button>
            </div>
          </div>

          {/* Premium View Selector with Glassmorphism */}
          <div className="mt-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="inline-flex gap-1 p-1.5 rounded-xl bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-xl border border-border/50 shadow-lg">
              <Button
                variant={currentView === 'year' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('year')}
                className={`gap-2 transition-all duration-300 ${
                  currentView === 'year' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg scale-105' 
                    : 'hover:scale-105 hover:bg-accent/50'
                }`}
              >
                <CalendarClock className="h-4 w-4" />
                År
              </Button>
              <Button
                variant={currentView === 'month' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('month')}
                className={`gap-2 transition-all duration-300 ${
                  currentView === 'month' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg scale-105' 
                    : 'hover:scale-105 hover:bg-accent/50'
                }`}
              >
                <Calendar className="h-4 w-4" />
                Månad
              </Button>
              <Button
                variant={currentView === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={handleViewWeek}
                className={`gap-2 transition-all duration-300 ${
                  currentView === 'week' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg scale-105' 
                    : 'hover:scale-105 hover:bg-accent/50'
                }`}
              >
                <CalendarRange className="h-4 w-4" />
                Vecka
              </Button>
              <Button
                variant={currentView === 'day' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleDateClick(selectedDay)}
                className={`gap-2 transition-all duration-300 ${
                  currentView === 'day' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg scale-105' 
                    : 'hover:scale-105 hover:bg-accent/50'
                }`}
              >
                <CalendarDays className="h-4 w-4" />
                Dag
              </Button>
              <Button
                variant={currentView === 'timeline' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('timeline')}
                className={`gap-2 transition-all duration-300 ${
                  currentView === 'timeline' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg scale-105' 
                    : 'hover:scale-105 hover:bg-accent/50'
                }`}
              >
                <List className="h-4 w-4" />
                Timeline
              </Button>
            </div>

            {/* Premium Integration Status Cards */}
            {integrations.length > 0 && (
              <div className="flex gap-2 mt-4">
                {integrations.slice(0, 3).map((int, idx) => (
                  <div
                    key={int.id}
                    className="group px-3 py-2 rounded-lg bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-xl border border-border/50 cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${150 + idx * 50}ms` }}
                    onClick={() => setShowIntegrationModal(true)}
                  >
                    <div className="flex items-center gap-2">
                      {int.is_enabled && int.last_sync_status === 'success' && (
                        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      )}
                      {!int.is_enabled && (
                        <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                      )}
                      {int.last_sync_status === 'error' && (
                        <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                      )}
                      <span className="text-xs font-medium">{int.provider_display_name}</span>
                    </div>
                  </div>
                ))}
                {integrations.length > 3 && (
                  <div 
                    className="px-3 py-2 rounded-lg bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-xl border border-border/50 cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-300"
                    onClick={() => setShowIntegrationModal(true)}
                  >
                    <span className="text-xs font-medium text-muted-foreground">
                      +{integrations.length - 3} till
                    </span>
                  </div>
                )}
              </div>
            )}
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
        <div className="px-6 py-4 space-y-6 flex-1 overflow-auto">
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList>
              <TabsTrigger value="calendar">Kalender</TabsTrigger>
              <TabsTrigger value="availability">Min Tillgänglighet</TabsTrigger>
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
                  calendars={calendars}
                  selectedCalendarId={selectedCalendarId !== 'all' ? selectedCalendarId : defaultCalendar?.id}
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
          onMonthViewClick={() => setCurrentView('month')}
        />
      )}

      {/* Timeline view */}
      {currentView === 'timeline' && (
        <TimelineView
          events={events}
          onEventClick={handleEventClick}
          onEventSave={handleEventSave}
          onEventDelete={deleteEvent}
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

      {/* Calendar management modal */}
      <CalendarManagementModal
        open={showCalendarManagement}
        onClose={() => setShowCalendarManagement(false)}
        calendars={calendars}
        onCreateCalendar={createCalendar}
        onUpdateCalendar={updateCalendar}
        onDeleteCalendar={deleteCalendar}
      />
    </div>
  );
};

export default CalendarPage;
