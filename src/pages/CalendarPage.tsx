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
import { addMinutes, isSameDay, parseISO, startOfWeek, endOfWeek, isWithinInterval, format } from "date-fns";
import { sv } from "date-fns/locale";
import { checkEventConflicts } from "@/lib/calendarUtils";
import { toast } from "sonner";

const CalendarPage = () => {
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

      const conflicts = checkEventConflicts(tempEvent, events.filter(e => e.id !== selectedEvent?.id));
      
      if (conflicts.length > 0) {
        toast.warning(`⚠️ Denna händelse överlappar med ${conflicts.length} andra händelse(r)`, {
          description: conflicts.map(e => `• ${e.title} (${format(parseISO(e.start_time), 'HH:mm')} - ${format(parseISO(e.end_time), 'HH:mm')})`).join('\n'),
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
      return events.filter(e => isSameDay(parseISO(e.start_time), selectedDay));
    }
    if (currentView === 'week') {
      const weekStart = startOfWeek(selectedDay, { locale: sv, weekStartsOn: 1 });
      const weekEnd = endOfWeek(selectedDay, { locale: sv, weekStartsOn: 1 });
      return events.filter(e => 
        isWithinInterval(parseISO(e.start_time), { start: weekStart, end: weekEnd })
      );
    }
    return events;
  })();

  return (
    <div className="h-screen flex flex-col">
      {/* Global header with view selector - always visible */}
      <div className="border-b bg-background">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Kalender & CRM</h1>
              <p className="text-sm text-muted-foreground">
                Hantera dina möten och synka med befintliga bokningssystem
              </p>
            </div>
            <div className="flex gap-2">
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
              </div>
              
              <Button onClick={() => setShowIntegrationModal(true)} variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Integrationer
              </Button>
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
        <div className="container mx-auto p-6 space-y-6 flex-1 overflow-auto">
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList>
              <TabsTrigger value="calendar">Kalender</TabsTrigger>
              <TabsTrigger value="availability">Min Tillgänglighet</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calendar" className="space-y-6">
              {integrations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Aktiva integrationer</CardTitle>
            <CardDescription>
              Dina anslutna bokningssystem och kalendersynkroniseringar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {integrations.map(integration => (
                <Card key={integration.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">
                        {integration.provider_display_name}
                      </CardTitle>
                      <Badge variant={integration.is_enabled ? "default" : "secondary"}>
                        {integration.is_enabled ? "Aktiv" : "Inaktiv"}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      {integration.integration_type === 'full_api' ? 'Full API' : 'Kalendersynk'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Synkade events:</span>
                        <span className="font-medium">{integration.total_synced_events}</span>
                      </div>
                      {integration.last_sync_at && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Senaste synk:</span>
                          <span className="text-xs">
                            {new Date(integration.last_sync_at).toLocaleString('sv-SE')}
                          </span>
                        </div>
                      )}
                      {integration.last_sync_status && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge variant={integration.last_sync_status === 'success' ? 'default' : 'destructive'} className="text-xs">
                            {integration.last_sync_status}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => triggerSync(integration.id)}
                      >
                        Synka nu
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateIntegration(integration.id, { is_enabled: !integration.is_enabled })}
                      >
                        {integration.is_enabled ? 'Pausa' : 'Aktivera'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => deleteIntegration(integration.id)}
                      >
                        Ta bort
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {integrations.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Settings className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Inga integrationer ännu</h3>
            <p className="text-muted-foreground text-center mb-4 max-w-md">
              Anslut ditt befintliga bokningssystem eller CRM för att automatiskt synka dina möten och händelser
            </p>
            <Button onClick={() => setShowIntegrationModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Lägg till integration
            </Button>
          </CardContent>
        </Card>
      )}

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
