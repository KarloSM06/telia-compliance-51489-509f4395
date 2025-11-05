"use client"

import * as React from "react"
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths, isToday, parseISO, isBefore, isAfter, startOfDay, endOfDay } from "date-fns"
import { sv } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Search, Filter, X, Clock, MapPin, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { CalendarEvent } from "@/hooks/useCalendarEvents"
import { formatInTimeZone_, toTimeZone } from "@/lib/timezoneUtils"

export type Event = CalendarEvent

interface EventManagerProps {
  events: Event[]
  onEventCreate?: (event: Partial<Event>) => void
  onEventUpdate?: (id: string, event: Partial<Event>) => void
  onEventDelete?: (id: string) => void
  onEventClick?: (event: Event) => void
  categories?: string[]
  availableTags?: string[]
  defaultView?: "month" | "week" | "day"
  timezone: string
}

export function EventManager({
  events,
  onEventCreate,
  onEventUpdate,
  onEventDelete,
  onEventClick,
  categories = [],
  availableTags = [],
  defaultView = "month",
  timezone,
}: EventManagerProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [view, setView] = React.useState<"month" | "week" | "day">(defaultView)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null)

  // Filter events
  const filteredEvents = React.useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = searchQuery
        ? event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchQuery.toLowerCase())
        : true

      const matchesCategory = selectedCategory
        ? event.event_type === selectedCategory
        : true

      return matchesSearch && matchesCategory
    })
  }, [events, searchQuery, selectedCategory])

  // Get events for a specific day
  const getEventsForDay = (date: Date) => {
    return filteredEvents.filter((event) => {
      const eventStartDate = new Date(event.start_time)
      const eventStartLocal = toTimeZone(eventStartDate, timezone)
      return isSameDay(eventStartLocal, date)
    })
  }

  // Calendar grid
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days: Date[] = []
  let day = startDate
  while (day <= endDate) {
    days.push(day)
    day = addDays(day, 1)
  }

  const weekDays = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"]

  const handlePreviousMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const handleToday = () => setCurrentDate(new Date())

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      meeting: "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30",
      call: "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30",
      demo: "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30",
      follow_up: "bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30",
      personal: "bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-500/30",
      work: "bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
      leisure: "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/30",
      other: "bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30",
    }
    return colors[type] || colors.other
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "meeting": return "🤝"
      case "call": return "📞"
      case "demo": return "💼"
      case "follow_up": return "📋"
      case "personal": return "👤"
      case "work": return "💻"
      case "leisure": return "🎉"
      default: return "📌"
    }
  }

  return (
    <div className="space-y-6 relative">
      {/* Snowflake decoration - subtle background */}
      <div className="absolute -top-20 -right-20 w-96 h-96 opacity-[0.02] pointer-events-none">
        <div className="w-full h-full animate-[spin_60s_linear_infinite]">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50 0 L50 100 M0 50 L100 50 M15 15 L85 85 M85 15 L15 85" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>
      </div>

      {/* Header with search and filters */}
      <Card className="border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md shadow-xl">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={handlePreviousMonth} className="hover:bg-primary/5 hover:border-primary/30 transition-all">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={handleToday} className="hover:bg-primary/5 hover:border-primary/30 transition-all">
                Idag
              </Button>
              <Button variant="outline" size="icon" onClick={handleNextMonth} className="hover:bg-primary/5 hover:border-primary/30 transition-all">
                <ChevronRight className="h-4 w-4" />
              </Button>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                {format(currentDate, "MMMM yyyy", { locale: sv })}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Sök händelser..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>

              {onEventCreate && (
                <Button onClick={() => onEventCreate({})} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Ny händelse
                </Button>
              )}
            </div>
          </div>

          {/* Category filters */}
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Badge
                variant={selectedCategory === null ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/5 transition-all"
                onClick={() => setSelectedCategory(null)}
              >
                Alla
              </Badge>
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/5 transition-all"
                  onClick={() => setSelectedCategory(category)}
                >
                  {getEventTypeIcon(category)} {category}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <Card className="border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md shadow-xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-7 gap-2">
            {/* Week day headers */}
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-sm text-muted-foreground p-2"
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {days.map((day, index) => {
              const dayEvents = getEventsForDay(day)
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isTodayDate = isToday(day)

              return (
                <div
                  key={index}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "min-h-32 p-3 border rounded-lg cursor-pointer transition-all duration-300",
                    "hover:shadow-lg hover:scale-[1.02] hover:border-primary/40",
                    !isCurrentMonth && "bg-muted/30 text-muted-foreground opacity-50",
                    isCurrentMonth && "bg-card hover:bg-accent/50",
                    isTodayDate && "border-primary/60 border-2 shadow-lg shadow-primary/20",
                    selectedDate && isSameDay(day, selectedDate) && "ring-2 ring-primary/40"
                  )}
                >
                  <div
                    className={cn(
                      "text-sm font-medium mb-2",
                      isTodayDate && "text-primary font-bold text-base"
                    )}
                  >
                    {format(day, "d")}
                  </div>

                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          onEventClick?.(event)
                        }}
                        className={cn(
                          "text-xs p-1.5 rounded border cursor-pointer truncate transition-all",
                          "hover:scale-105 hover:shadow-md",
                          getEventTypeColor(event.event_type)
                        )}
                        title={event.title}
                      >
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 opacity-60" />
                          <span className="font-medium">
                            {formatInTimeZone_(event.start_time, "HH:mm", timezone)}
                          </span>
                        </div>
                        <div className="truncate">{event.title}</div>
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-muted-foreground text-center py-1">
                        +{dayEvents.length - 3} fler
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Event Details Sidebar */}
      {selectedDate && (
        <Card className="border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {format(selectedDate, "EEEE, d MMMM yyyy", { locale: sv })}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedDate(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {getEventsForDay(selectedDate).length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Inga händelser denna dag
                </p>
              ) : (
                getEventsForDay(selectedDate).map((event) => (
                  <div
                    key={event.id}
                    onClick={() => onEventClick?.(event)}
                    className={cn(
                      "p-4 rounded-lg border cursor-pointer transition-all",
                      "hover:shadow-lg hover:scale-[1.02]",
                      getEventTypeColor(event.event_type)
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getEventTypeIcon(event.event_type)}</span>
                        <h4 className="font-semibold">{event.title}</h4>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {event.event_type}
                      </Badge>
                    </div>

                    {event.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {event.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 opacity-60" />
                        <span>
                          {formatInTimeZone_(event.start_time, "HH:mm", timezone)} -{" "}
                          {formatInTimeZone_(event.end_time, "HH:mm", timezone)}
                        </span>
                      </div>

                      {event.contact_person && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 opacity-60" />
                          <span>{event.contact_person}</span>
                        </div>
                      )}

                      {(event as any).address && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 opacity-60" />
                          <span>{(event as any).address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats footer */}
      <Card className="border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <span className="text-muted-foreground">
                <span className="font-semibold text-foreground">{filteredEvents.length}</span> händelser
              </span>
            </div>
            {selectedCategory && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Filtrerat:</span>
                <Badge variant="outline">{selectedCategory}</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
