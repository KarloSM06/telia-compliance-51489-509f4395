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
import { EventManager } from "@/components/ui/event-manager";
import { AvailabilitySettings } from "@/components/calendar/AvailabilitySettings";
import { CalendarSelector } from "@/components/calendar/CalendarSelector";
import { IntegrationQuickView } from "@/components/integrations/IntegrationQuickView";
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
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { PremiumTelephonyStatCard } from "@/components/telephony/PremiumTelephonyStatCard";
import hiemsLogoSnowflake from '@/assets/hiems-logo-snowflake.png';
const CalendarPage = () => {
  const {
    timezone
  } = useUserTimezone();
  const {
    calendars,
    defaultCalendar,
    createCalendar,
    updateCalendar,
    deleteCalendar
  } = useCalendars();
  const {
    events,
    loading,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch
  } = useCalendarEvents();
  const {
    integrations,
    createIntegration,
    updateIntegration,
    deleteIntegration,
    triggerSync
  } = useBookingIntegrations();
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day' | 'year' | 'timeline' | 'manager'>('manager');
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
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
      source: 'internal'
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
        updated_at: new Date().toISOString()
      } as CalendarEvent;
      const conflicts = checkEventConflicts(tempEvent, events.filter(e => e.id !== selectedEvent?.id), timezone);
      if (conflicts.length > 0) {
        toast.warning(`⚠️ Denna händelse överlappar med ${conflicts.length} andra händelse(r)`, {
          description: conflicts.map(e => `• ${e.title} (${format(new Date(e.start_time), 'HH:mm')} - ${format(new Date(e.end_time), 'HH:mm')})`).join('\n'),
          duration: 5000
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
      const weekStart = startOfWeek(selectedDay, {
        locale: sv,
        weekStartsOn: 1
      });
      const weekEnd = endOfWeek(selectedDay, {
        locale: sv,
        weekStartsOn: 1
      });
      return events.filter(e => isWithinInterval(new Date(e.start_time), {
        start: weekStart,
        end: weekEnd
      }));
    }
    return events;
  })();

  // Calculate stats for today and this week
  const todayEvents = events.filter(e => isSameDay(new Date(e.start_time), new Date())).length;
  const thisWeekEvents = events.filter(e => {
    const weekStart = startOfWeek(new Date(), {
      locale: sv,
      weekStartsOn: 1
    });
    const weekEnd = endOfWeek(new Date(), {
      locale: sv,
      weekStartsOn: 1
    });
    return isWithinInterval(new Date(e.start_time), {
      start: weekStart,
      end: weekEnd
    });
  }).length;
  const activeIntegrations = integrations.filter(i => i.is_enabled).length;
  return <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.1),transparent_50%)]" />
        
        {/* Snowflakes */}
        <div className="absolute -top-32 -right-32 w-[700px] h-[700px] opacity-5 pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_60s_linear_infinite]" />
        </div>
        <div className="absolute -top-20 -left-20 w-[450px] h-[450px] opacity-[0.03] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_40s_linear_infinite_reverse]" />
        </div>
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[350px] h-[350px] opacity-[0.04] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_50s_linear_infinite]" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-block">
                <span className="text-sm font-semibold tracking-wider text-primary uppercase">Realtidsövervakning</span>
                <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50 mt-2" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
                Kalender & CRM
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                Hantera dina möten och synka med befintliga bokningssystem
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Quick Actions Bar */}
      <section className="relative py-8 border-y border-primary/10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={100}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium text-green-600">Live</span>
                </div>
                <Badge variant="outline" className="px-4 py-2">
                  {events.length} händelser
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Calendar selector */}
                {calendars.length > 0 && <CalendarSelector calendars={calendars} selectedCalendarId={selectedCalendarId} onSelect={setSelectedCalendarId} />}

                {/* View selector */}
                <div className="flex gap-1">
                  <Button variant={currentView === 'manager' ? 'default' : 'outline'} size="sm" onClick={() => setCurrentView('manager')} className="gap-2 hover:bg-primary/5 hover:border-primary/30 transition-all duration-500">
                    <FolderKanban className="h-4 w-4" />
                    Hanterare
                  </Button>
                  <Button variant={currentView === 'year' ? 'default' : 'outline'} size="sm" onClick={() => setCurrentView('year')} className="gap-2 hover:bg-primary/5 hover:border-primary/30 transition-all duration-500">
                    <CalendarClock className="h-4 w-4" />
                    År
                  </Button>
                  <Button variant={currentView === 'month' ? 'default' : 'outline'} size="sm" onClick={() => setCurrentView('month')} className="gap-2 hover:bg-primary/5 hover:border-primary/30 transition-all duration-500">
                    <Calendar className="h-4 w-4" />
                    Månad
                  </Button>
                  <Button variant={currentView === 'week' ? 'default' : 'outline'} size="sm" onClick={handleViewWeek} className="gap-2 hover:bg-primary/5 hover:border-primary/30 transition-all duration-500">
                    <CalendarRange className="h-4 w-4" />
                    Vecka
                  </Button>
                  <Button variant={currentView === 'day' ? 'default' : 'outline'} size="sm" onClick={() => handleDateClick(selectedDay)} className="gap-2 hover:bg-primary/5 hover:border-primary/30 transition-all duration-500">
                    <CalendarDays className="h-4 w-4" />
                    Dag
                  </Button>
                  <Button variant={currentView === 'timeline' ? 'default' : 'outline'} size="sm" onClick={() => setCurrentView('timeline')} className="gap-2 hover:bg-primary/5 hover:border-primary/30 transition-all duration-500">
                    <List className="h-4 w-4" />
                    Timeline
                  </Button>
                </div>

                <Button variant="outline" size="sm" onClick={() => setShowCalendarManagement(true)} className="gap-2 hover:bg-primary/5 hover:border-primary/30 transition-all duration-500">
                  <Calendar className="h-4 w-4" />
                  Hantera kalendrar
                </Button>

                <Button onClick={() => {
                setSelectedEvent(null);
                setSelectedDate(new Date());
                setShowEventModal(true);
              }} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Skapa händelse
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Overview + Integration Status */}
      <section className="relative py-12 bg-gradient-to-b from-background via-primary/2 to-background">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={250}>
            <IntegrationQuickView 
              filterByType="calendar" 
              title="Kalenderintegrationer"
              highlightCategory="calendar"
            />
          </AnimatedSection>
        </div>
      </section>

      {/* Event Manager View */}
      {currentView === 'manager' && (
        <section className="relative py-12 bg-gradient-to-b from-background via-primary/2 to-background">
          <div className="container mx-auto px-6 lg:px-8">
            <AnimatedSection delay={300}>
              <EventManager
                events={events}
                onEventCreate={() => {
                  setSelectedEvent(null);
                  setSelectedDate(new Date());
                  setShowEventModal(true);
                }}
                onEventClick={handleEventClick}
                categories={['meeting', 'call', 'demo', 'follow_up', 'personal', 'work', 'leisure', 'other']}
                timezone={timezone}
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
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Year view */}
      {currentView === 'year' && <section className="relative py-12 bg-gradient-to-b from-background via-primary/2 to-background">
          <div className="container mx-auto px-6 lg:px-8">
            <AnimatedSection delay={300}>
              <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-xl hover:border-primary/30 transition-all duration-500">
                <YearView date={selectedDay} events={events} onEventClick={handleEventClick} onDateChange={setSelectedDay} onDayClick={date => {
              setSelectedDay(date);
              setCurrentView('day');
            }} />
              </Card>
            </AnimatedSection>
          </div>
        </section>}

      {/* Month view */}
      {currentView === 'month' && <section className="relative py-12 bg-gradient-to-b from-background via-primary/2 to-background">
          <div className="container mx-auto px-6 lg:px-8">
            <AnimatedSection delay={300}>
              <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-xl hover:border-primary/30 transition-all duration-500">
                <Tabs defaultValue="calendar" className="w-full">
                  <TabsList>
                    <TabsTrigger value="calendar">Kalender</TabsTrigger>
                    <TabsTrigger value="availability">Min Tillgänglighet</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="calendar" className="space-y-6">
                    <CalendarView events={events} onEventClick={handleEventClick} onDateClick={handleDateClick} />

                    {showEventModal && <EventModal open={showEventModal} onClose={handleCloseModal} event={selectedEvent} defaultDate={selectedDate || undefined} onSave={handleEventSave} onDelete={deleteEvent} calendars={calendars} selectedCalendarId={selectedCalendarId !== 'all' ? selectedCalendarId : defaultCalendar?.id} />}
                  </TabsContent>

                  <TabsContent value="availability">
                    <AvailabilitySettings />
                  </TabsContent>
                </Tabs>
              </Card>
            </AnimatedSection>
          </div>
        </section>}

      {/* Week view */}
      {currentView === 'week' && <section className="relative py-12 bg-gradient-to-b from-background via-primary/2 to-background">
          <div className="container mx-auto px-6 lg:px-8">
            <AnimatedSection delay={300}>
              <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-xl hover:border-primary/30 transition-all duration-500">
                <WeekView date={selectedDay} events={filteredEvents} onEventClick={handleEventClick} onEventUpdate={updateEvent} onBackToMonth={handleBackToMonth} onCreate={handleQuickCreate} onDateChange={setSelectedDay} onDelete={deleteEvent} showEventModal={showEventModal} selectedEvent={selectedEvent} onCloseModal={handleCloseModal} onEventSave={handleEventSave} onMonthViewClick={() => setCurrentView('month')} />
              </Card>
            </AnimatedSection>
          </div>
        </section>}

      {/* Timeline view */}
      {currentView === 'timeline' && <section className="relative py-12 bg-gradient-to-b from-background via-primary/2 to-background">
          <div className="container mx-auto px-6 lg:px-8">
            <AnimatedSection delay={300}>
              <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-xl hover:border-primary/30 transition-all duration-500">
                <TimelineView events={events} onEventClick={handleEventClick} onEventSave={handleEventSave} onEventDelete={deleteEvent} />
              </Card>
            </AnimatedSection>
          </div>
        </section>}

      {/* Day view */}
      {currentView === 'day' && <section className="relative py-12 bg-gradient-to-b from-background via-primary/2 to-background">
          <div className="container mx-auto px-6 lg:px-8">
            <AnimatedSection delay={300}>
              <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-xl hover:border-primary/30 transition-all duration-500">
                <DayView date={selectedDay} events={filteredEvents} onEventClick={handleEventClick} onEventUpdate={updateEvent} onBackToMonth={handleBackToMonth} onCreate={handleQuickCreate} onDateChange={setSelectedDay} onDelete={deleteEvent} showEventModal={showEventModal} selectedEvent={selectedEvent} onCloseModal={handleCloseModal} onEventSave={handleEventSave} />
              </Card>
            </AnimatedSection>
          </div>
        </section>}

      {/* Calendar management modal */}
      <CalendarManagementModal open={showCalendarManagement} onClose={() => setShowCalendarManagement(false)} calendars={calendars} onCreateCalendar={createCalendar} onUpdateCalendar={updateCalendar} onDeleteCalendar={deleteCalendar} />
    </div>;
};
export default CalendarPage;