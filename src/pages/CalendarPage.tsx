import { useState, useMemo } from "react";
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
import { MiniCalendar } from "@/components/calendar/MiniCalendar";
import { SyncMetrics } from "@/components/calendar/SyncMetrics";
import { SyncLogsViewer } from "@/components/calendar/SyncLogsViewer";
import { IntegrationCard } from "@/components/calendar/IntegrationCard";
import { EventFilterBar, EventFilters } from "@/components/calendar/EventFilterBar";
import { ConflictResolver } from "@/components/calendar/ConflictResolver";
import { KeyboardShortcutsModal } from "@/components/calendar/KeyboardShortcutsModal";
import { DLQManager } from "@/components/calendar/DLQManager";
import { useCalendarEvents, CalendarEvent } from "@/hooks/useCalendarEvents";
import { useBookingIntegrations } from "@/hooks/useBookingIntegrations";
import { Plus, Settings, Calendar, CalendarDays, CalendarRange, CalendarClock, Keyboard, RefreshCw } from "lucide-react";
import { addMinutes, isSameDay, parseISO, startOfWeek, endOfWeek, isWithinInterval, format } from "date-fns";
import { sv } from "date-fns/locale";
import { checkEventConflicts } from "@/lib/calendarUtils";
import { toast } from "sonner";
import { useHotkeys } from "react-hotkeys-hook";

const CalendarPage = () => {
  const { events, loading, createEvent, updateEvent, deleteEvent } = useCalendarEvents();
  const { integrations, createIntegration, updateIntegration, deleteIntegration, triggerSync } = useBookingIntegrations();
  
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day' | 'year'>('month');
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showConflictResolver, setShowConflictResolver] = useState(false);
  const [conflictingEvents, setConflictingEvents] = useState<CalendarEvent[]>([]);
  const [pendingEvent, setPendingEvent] = useState<CalendarEvent | null>(null);
  const [filters, setFilters] = useState<EventFilters>({
    search: '',
    sources: [],
    eventTypes: [],
    syncStates: [],
  });

  // Keyboard shortcuts
  useHotkeys('t', () => setSelectedDay(new Date()), []);
  useHotkeys('left', () => navigatePrevious(), [selectedDay, currentView]);
  useHotkeys('right', () => navigateNext(), [selectedDay, currentView]);
  useHotkeys('m', () => setCurrentView('month'), []);
  useHotkeys('w', () => setCurrentView('week'), []);
  useHotkeys('d', () => setCurrentView('day'), []);
  useHotkeys('y', () => setCurrentView('year'), []);
  useHotkeys('n', () => {
    setSelectedEvent(null);
    setSelectedDate(new Date());
    setShowEventModal(true);
  }, []);
  useHotkeys('shift+/', () => setShowKeyboardShortcuts(true), []);

  const navigatePrevious = () => {
    if (currentView === 'day') {
      setSelectedDay(new Date(selectedDay.getTime() - 24 * 60 * 60 * 1000));
    } else if (currentView === 'week') {
      setSelectedDay(new Date(selectedDay.getTime() - 7 * 24 * 60 * 60 * 1000));
    } else if (currentView === 'month') {
      setSelectedDay(new Date(selectedDay.getFullYear(), selectedDay.getMonth() - 1, 1));
    } else if (currentView === 'year') {
      setSelectedDay(new Date(selectedDay.getFullYear() - 1, 0, 1));
    }
  };

  const navigateNext = () => {
    if (currentView === 'day') {
      setSelectedDay(new Date(selectedDay.getTime() + 24 * 60 * 60 * 1000));
    } else if (currentView === 'week') {
      setSelectedDay(new Date(selectedDay.getTime() + 7 * 24 * 60 * 60 * 1000));
    } else if (currentView === 'month') {
      setSelectedDay(new Date(selectedDay.getFullYear(), selectedDay.getMonth() + 1, 1));
    } else if (currentView === 'year') {
      setSelectedDay(new Date(selectedDay.getFullYear() + 1, 0, 1));
    }
  };

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
        // Open conflict resolver instead of just showing toast
        setPendingEvent(tempEvent);
        setConflictingEvents(conflicts);
        setShowConflictResolver(true);
        return;
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

  const handleConflictResolve = async (keepEventId: string, discardEventIds: string[]) => {
    try {
      // Delete discarded events
      for (const id of discardEventIds) {
        if (id !== 'temp') {
          await deleteEvent(id);
        }
      }

      // If keeping the pending event, create it
      if (keepEventId === 'temp' && pendingEvent) {
        await createEvent(pendingEvent);
      }

      toast.success('Konflikt löst!');
      setShowConflictResolver(false);
      setPendingEvent(null);
      setConflictingEvents([]);
    } catch (error) {
      toast.error('Kunde inte lösa konflikt');
    }
  };

  const handleCloseModal = () => {
    setShowEventModal(false);
    setSelectedEvent(null);
    setSelectedDate(null);
  };

  // Filter events based on filters and search
  const filteredEvents = useMemo(() => {
    let filtered = events;

    // View-based filtering
    if (currentView === 'day') {
      filtered = filtered.filter(e => isSameDay(parseISO(e.start_time), selectedDay));
    } else if (currentView === 'week') {
      const weekStart = startOfWeek(selectedDay, { locale: sv, weekStartsOn: 1 });
      const weekEnd = endOfWeek(selectedDay, { locale: sv, weekStartsOn: 1 });
      filtered = filtered.filter(e => 
        isWithinInterval(parseISO(e.start_time), { start: weekStart, end: weekEnd })
      );
    }

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(e => 
        e.title.toLowerCase().includes(searchLower) ||
        e.description?.toLowerCase().includes(searchLower) ||
        e.contact_person?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.sources.length > 0) {
      filtered = filtered.filter(e => filters.sources.includes(e.source || 'internal'));
    }

    if (filters.eventTypes.length > 0) {
      filtered = filtered.filter(e => filters.eventTypes.includes(e.event_type));
    }

    return filtered;
  }, [events, currentView, selectedDay, filters]);

  // Get unique sources and event types for filter options
  const availableSources = useMemo(() => 
    [...new Set(events.map(e => e.source || 'internal'))],
    [events]
  );

  const availableEventTypes = useMemo(() => 
    [...new Set(events.map(e => e.event_type))],
    [events]
  );

  return (
    <div className="h-screen flex flex-col">
      {/* Global header - Kompakt */}
      <div className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-3 py-2">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">Kalender & Bokningar</h1>
              <p className="text-xs text-muted-foreground hidden lg:block">
                Synka och hantera möten från alla dina system
              </p>
            </div>
            <div className="flex gap-1.5">
              <Button onClick={() => setSelectedDay(new Date())} variant="outline" size="sm" className="h-8">
                Idag
              </Button>

              {/* View selector - Kompakt */}
              <div className="flex gap-0.5 border rounded-lg p-0.5 bg-muted/50">
                <Button
                  variant={currentView === 'year' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('year')}
                  className="gap-1 h-7 px-2"
                >
                  <CalendarClock className="h-3.5 w-3.5" />
                  <span className="hidden lg:inline">År</span>
                </Button>
                <Button
                  variant={currentView === 'month' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('month')}
                  className="gap-1 h-7 px-2"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="hidden lg:inline">Månad</span>
                </Button>
                <Button
                  variant={currentView === 'week' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={handleViewWeek}
                  className="gap-1 h-7 px-2"
                >
                  <CalendarRange className="h-3.5 w-3.5" />
                  <span className="hidden lg:inline">Vecka</span>
                </Button>
                <Button
                  variant={currentView === 'day' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleDateClick(selectedDay)}
                  className="gap-1 h-7 px-2"
                >
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span className="hidden lg:inline">Dag</span>
                </Button>
              </div>
              
              <Button onClick={() => setShowKeyboardShortcuts(true)} variant="outline" size="sm" className="h-8 px-2">
                <Keyboard className="h-3.5 w-3.5" />
              </Button>
              
              <Button onClick={() => setShowIntegrationModal(true)} variant="outline" size="sm" className="h-8 px-2">
                <Settings className="h-3.5 w-3.5 lg:mr-1.5" />
                <span className="hidden lg:inline">Integrationer</span>
              </Button>
              <Button onClick={() => {
                setSelectedEvent(null);
                setSelectedDate(new Date());
                setShowEventModal(true);
              }} size="sm" className="h-8 px-2">
                <Plus className="h-3.5 w-3.5 lg:mr-1.5" />
                <span className="hidden lg:inline">Ny händelse</span>
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

      {/* Month view - Optimerad 3-kolumn layout */}
      {currentView === 'month' && (
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="calendar" className="h-full flex flex-col">
            <div className="border-b px-2">
              <TabsList className="h-9">
                <TabsTrigger value="calendar" className="text-xs">Kalender</TabsTrigger>
                <TabsTrigger value="integrations" className="text-xs">Integrationer & Synk</TabsTrigger>
                <TabsTrigger value="availability" className="text-xs">Tillgänglighet</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="calendar" className="flex-1 overflow-hidden m-0 p-0">
              <div className="h-full flex">
                {/* Left sidebar - 12% - Dölj på mobil */}
                <div className="hidden lg:flex lg:w-[12%] border-r bg-muted/30 p-2 overflow-y-auto flex-col gap-2">
                  <MiniCalendar
                    selectedDate={selectedDay}
                    onDateSelect={setSelectedDay}
                    events={events}
                  />
                  
                  {/* Quick stats - Kompakt */}
                  <div className="space-y-1.5">
                    <h3 className="text-[10px] font-semibold text-muted-foreground uppercase">Översikt</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground">Händelser</span>
                        <Badge variant="secondary" className="h-4 text-[9px] px-1">{events.length}</Badge>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground">Integrationer</span>
                        <Badge variant="secondary" className="h-4 text-[9px] px-1">{integrations.length}</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main calendar area - 66% (88% på tablet, 100% på mobil) */}
                <div className="flex-1 lg:w-[66%] overflow-y-auto">
                  <div className="p-2 space-y-2">
                    <EventFilterBar
                      filters={filters}
                      onFiltersChange={setFilters}
                      availableSources={availableSources}
                      availableEventTypes={availableEventTypes}
                    />

                    <CalendarView 
                      events={filteredEvents}
                      onEventClick={handleEventClick}
                      onDateClick={handleDateClick}
                    />
                  </div>
                </div>

                {/* Right sidebar - 22% - Dölj på tablet och mobil */}
                <div className="hidden xl:flex xl:w-[22%] border-l bg-muted/20 overflow-y-auto">
                  <div className="p-2 space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-semibold">Integrationer</h3>
                      <Button size="sm" variant="outline" onClick={() => setShowIntegrationModal(true)} className="h-7 px-2">
                        <Plus className="h-3 w-3 mr-1" />
                        <span className="text-xs">Ny</span>
                      </Button>
                    </div>

                    {integrations.length === 0 ? (
                      <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-4">
                          <Settings className="h-6 w-6 text-muted-foreground mb-1.5" />
                          <p className="text-xs text-muted-foreground text-center mb-2">
                            Inga integrationer ännu
                          </p>
                          <Button size="sm" onClick={() => setShowIntegrationModal(true)} className="h-7">
                            <Plus className="h-3 w-3 mr-1" />
                            Lägg till
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-2">
                        {integrations.map(integration => (
                          <IntegrationCard
                            key={integration.id}
                            integration={{
                              id: integration.id,
                              provider: integration.provider,
                              is_active: integration.is_enabled,
                              last_sync: integration.last_sync_at || undefined,
                              sync_stats: {
                                success: integration.total_synced_events || 0,
                                failed: 0,
                                total: integration.total_synced_events || 0,
                              },
                            }}
                            onSync={(id) => triggerSync(id)}
                            onToggleActive={(id, active) => updateIntegration(id, { is_enabled: active })}
                            onSettings={() => {}}
                            onViewLogs={() => {}}
                          />
                        ))}
                      </div>
                    )}

                    <div className="pt-2 border-t">
                      <SyncMetrics />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="integrations" className="flex-1 overflow-y-auto m-0 p-4">
              <div className="space-y-6 max-w-5xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Synkroniseringsstatus</CardTitle>
                    <CardDescription>
                      Översikt över dina bokningssystem och synkroniseringshälsa
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <SyncMetrics />
                    <SyncLogsViewer />
                    <DLQManager />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="availability" className="flex-1 overflow-y-auto m-0 p-4">
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

      {/* Modals */}
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

      <IntegrationSetupModal
        open={showIntegrationModal}
        onClose={() => setShowIntegrationModal(false)}
        onSave={createIntegration}
        existingIntegrations={integrations}
      />

      <KeyboardShortcutsModal
        open={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />

      {showConflictResolver && pendingEvent && (
        <ConflictResolver
          open={showConflictResolver}
          onClose={() => setShowConflictResolver(false)}
          event={pendingEvent}
          conflictingEvents={conflictingEvents}
          onResolve={handleConflictResolve}
        />
      )}
    </div>
  );
};

export default CalendarPage;
