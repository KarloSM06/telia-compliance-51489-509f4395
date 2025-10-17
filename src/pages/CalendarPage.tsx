import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarView } from "@/components/calendar/CalendarView";
import { DayView } from "@/components/calendar/DayView";
import { EventModal } from "@/components/calendar/EventModal";
import { IntegrationSetupModal } from "@/components/calendar/IntegrationSetupModal";
import { useCalendarEvents, CalendarEvent } from "@/hooks/useCalendarEvents";
import { useBookingIntegrations } from "@/hooks/useBookingIntegrations";
import { Plus, Settings } from "lucide-react";
import { addMinutes, isSameDay, parseISO } from "date-fns";

const CalendarPage = () => {
  const { events, loading, createEvent, updateEvent, deleteEvent } = useCalendarEvents();
  const { integrations, createIntegration, updateIntegration, deleteIntegration, triggerSync } = useBookingIntegrations();
  
  const [currentView, setCurrentView] = useState<'month' | 'day'>('month');
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

  const handleQuickCreate = async (time: Date) => {
    const endTime = addMinutes(time, 30);
    setSelectedDate(time);
    setSelectedEvent({
      id: '',
      title: '',
      start_time: time.toISOString(),
      end_time: endTime.toISOString(),
      event_type: 'meeting',
      status: 'scheduled',
      source: 'internal',
    } as CalendarEvent);
    setShowEventModal(true);
  };

  const handleEventSave = async (eventData: Partial<CalendarEvent>) => {
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

  const filteredEvents = currentView === 'day' 
    ? events.filter(e => isSameDay(parseISO(e.start_time), selectedDay))
    : events;

  return (
    <div className="h-screen flex flex-col">
      {currentView === 'month' && (
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Kalender & CRM</h1>
              <p className="text-muted-foreground mt-1">
                Hantera dina möten och synka med befintliga bokningssystem
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowIntegrationModal(true)} variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Integrationer
              </Button>
              <Button onClick={() => handleQuickCreate(new Date())}>
                <Plus className="h-4 w-4 mr-2" />
                Ny händelse
              </Button>
            </div>
          </div>

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

      <EventModal
        open={showEventModal}
        onClose={handleCloseModal}
        event={selectedEvent}
        defaultDate={selectedDate || undefined}
        onSave={handleEventSave}
        onDelete={deleteEvent}
      />

      <IntegrationSetupModal
        open={showIntegrationModal}
        onClose={() => setShowIntegrationModal(false)}
        onSave={createIntegration}
      />
        </div>
      )}

      {currentView === 'day' && (
        <DayView
          date={selectedDay}
          events={filteredEvents}
          onEventClick={handleEventClick}
          onEventUpdate={updateEvent}
          onBackToMonth={handleBackToMonth}
          onCreate={handleQuickCreate}
          onDateChange={setSelectedDay}
        />
      )}

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

      {showIntegrationModal && (
        <IntegrationSetupModal
          open={showIntegrationModal}
          onClose={() => setShowIntegrationModal(false)}
          onSave={createIntegration}
        />
      )}
    </div>
  );
};

export default CalendarPage;
