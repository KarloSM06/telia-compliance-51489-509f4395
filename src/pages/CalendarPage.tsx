import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
import { useCalendarEvents, CalendarEvent } from "@/hooks/useCalendarEvents";
import { useBookingIntegrations } from "@/hooks/useBookingIntegrations";
import { Plus, Settings, Calendar, CalendarDays, CalendarRange, CalendarClock, List } from "lucide-react";
import { addMinutes, isSameDay, startOfWeek, endOfWeek, isWithinInterval, format } from "date-fns";
import { sv } from "date-fns/locale";
import { checkEventConflicts } from "@/lib/calendarUtils";
import { toast } from "sonner";
import { useUserTimezone } from "@/hooks/useUserTimezone";

const CalendarPage = () => {
  const location = useLocation();
  const { timezone } = useUserTimezone();
  const { events, loading, createEvent, updateEvent, deleteEvent } = useCalendarEvents();
  const { integrations, createIntegration, updateIntegration, deleteIntegration, triggerSync } = useBookingIntegrations();
  
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day' | 'year' | 'timeline'>('month');
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Listen for location state to open specific event
  useEffect(() => {
    if (location.state?.openEventId) {
      const event = events.find(e => e.id === location.state.openEventId);
      if (event) {
        setSelectedEvent(event);
        setShowEventModal(true);
        
        // Switch to appropriate view if date provided
        if (location.state.date) {
          setSelectedDay(new Date(location.state.date));
          setCurrentView('day');
        }
      }
      
      // Clear state
      window.history.replaceState({}, document.title);
    }
  }, [location.state, events]);

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
    <div className="h-screen flex flex-col">
      {/* Global header with view selector - always visible */}
      <div className="border-b bg-background">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Kalender & CRM</h1>
              <p className="text-sm text-muted-foreground">
                Hantera dina möten och synka med befintliga bokningssystem
              </p>
            </div>
            <div className="flex gap-2 items-center">
              {/* View selector */}
              <div className="flex gap-1 border rounded-lg p-1 bg-muted/50">
                <Button
                  variant={currentView === 'year' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('year')}
                  className="gap-2"
                >
                  <CalendarClock className="h-4 w-4" />
                  År
                </Button>
                <Button
                  variant={currentView === 'month' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('month')}
                  className="gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Månad
                </Button>
                <Button
                  variant={currentView === 'week' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={handleViewWeek}
                  className="gap-2"
                >
                  <CalendarRange className="h-4 w-4" />
                  Vecka
                </Button>
                <Button
                  variant={currentView === 'day' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleDateClick(selectedDay)}
                  className="gap-2"
                >
                  <CalendarDays className="h-4 w-4" />
                  Dag
                </Button>
                <Button
                  variant={currentView === 'timeline' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('timeline')}
                  className="gap-2"
                >
                  <List className="h-4 w-4" />
                  Timeline
                </Button>
              </div>
              
              <Button onClick={() => setShowIntegrationModal(true)} variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Integrationer
                {integrations.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{integrations.length}</Badge>
                )}
              </Button>

              {/* Integration badges */}
              {integrations.slice(0, 3).map(int => (
                <Badge 
                  key={int.id}
                  variant={int.is_enabled && int.last_sync_status === 'success' ? 'default' : 'secondary'}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setShowIntegrationModal(true)}
                >
                  {int.provider_display_name}
                  {!int.is_enabled && <span className="ml-1">⏸</span>}
                  {int.last_sync_status === 'error' && <span className="ml-1">⚠️</span>}
                </Badge>
              ))}
              {integrations.length > 3 && (
                <Badge variant="outline" className="cursor-pointer" onClick={() => setShowIntegrationModal(true)}>
                  +{integrations.length - 3}
                </Badge>
              )}

              <Button onClick={() => {
                setSelectedEvent(null);
                setSelectedDate(new Date());
                setShowEventModal(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Skapa händelse
              </Button>
            </div>
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
    </div>
  );
};

export default CalendarPage;
