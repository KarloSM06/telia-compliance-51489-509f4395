import { useMemo } from 'react';
import { format } from 'date-fns';

interface TelephonyEvent {
  id: string;
  event_type: string;
  provider: string;
  status: string | null;
  direction: string | null;
  duration_seconds: number | null;
  cost_amount: number | null;
  created_at: string;
  normalized?: any;
}

export interface DailyData {
  date: string;
  [key: string]: any;
}

export interface ChartDataResult {
  dailyActivity: DailyData[];
  successRateData: Array<{
    date: string;
    successRate: number;
    totalCalls: number;
    successfulCalls: number;
    failedCalls: number;
  }>;
  providerPerformance: DailyData[];
  directionAnalysis: DailyData[];
  avgDurationTrend: Array<{
    date: string;
    avgDuration: number;
    minDuration: number;
    maxDuration: number;
    movingAverage: number;
  }>;
  eventTypeDistribution: DailyData[];
  providers: string[];
  totalStats: {
    totalCalls: number;
    totalSMS: number;
    avgSuccessRate: number;
    avgCallDuration: number;
  };
}

const calculateSuccessRate = (events: TelephonyEvent[]) => {
  const callEvents = events.filter(e => e.event_type.includes('call'));
  
  const successful = callEvents.filter(e => {
    const status = e.status?.toLowerCase() || '';
    const normalized = e.normalized as any;
    const endedReason = normalized?.endedReason?.toLowerCase() || '';
    
    return (
      status.includes('complet') ||
      status.includes('answer') ||
      endedReason === 'customer-hangup' ||
      endedReason === 'assistant-hangup' ||
      (normalized?.endedAt && !endedReason.includes('error'))
    );
  });
  
  return {
    rate: callEvents.length > 0 ? (successful.length / callEvents.length) * 100 : 0,
    total: callEvents.length,
    successful: successful.length,
    failed: callEvents.length - successful.length
  };
};

export const useTelephonyChartData = (
  events: TelephonyEvent[] = []
): ChartDataResult => {
  return useMemo(() => {
    if (!events || events.length === 0) {
      return {
        dailyActivity: [],
        successRateData: [],
        providerPerformance: [],
        directionAnalysis: [],
        avgDurationTrend: [],
        eventTypeDistribution: [],
        providers: [],
        totalStats: {
          totalCalls: 0,
          totalSMS: 0,
          avgSuccessRate: 0,
          avgCallDuration: 0
        }
      };
    }

    // Group events by date
    const eventsByDate = events.reduce((acc, event) => {
      const date = format(new Date(event.created_at), 'yyyy-MM-dd');
      if (!acc[date]) acc[date] = [];
      acc[date].push(event);
      return acc;
    }, {} as Record<string, TelephonyEvent[]>);

    const sortedDates = Object.keys(eventsByDate).sort();
    const providers = Array.from(new Set(events.map(e => e.provider)));

    // 1. Daily Activity (calls, cost, duration, sms per provider)
    const dailyActivity = sortedDates.map(date => {
      const dayEvents = eventsByDate[date];
      const result: DailyData = { date };
      
      providers.forEach(provider => {
        const providerEvents = dayEvents.filter(e => e.provider === provider);
        const calls = providerEvents.filter(e => e.event_type.includes('call')).length;
        const sms = providerEvents.filter(e => e.event_type.includes('message')).length;
        const duration = providerEvents.reduce((sum, e) => sum + (e.duration_seconds || 0), 0) / 60; // minutes
        const cost = providerEvents.reduce((sum, e) => sum + (e.cost_amount || 0), 0);
        
        result[`${provider}_calls`] = calls;
        result[`${provider}_sms`] = sms;
        result[`${provider}_duration`] = duration;
        result[`${provider}_cost`] = cost;
      });
      
      return result;
    });

    // 2. Success Rate Data
    const successRateData = sortedDates.map(date => {
      const dayEvents = eventsByDate[date];
      const { rate, total, successful, failed } = calculateSuccessRate(dayEvents);
      
      return {
        date,
        successRate: rate,
        totalCalls: total,
        successfulCalls: successful,
        failedCalls: failed
      };
    });

    // 3. Provider Performance (aggregated per provider)
    const providerPerformance = sortedDates.map(date => {
      const dayEvents = eventsByDate[date];
      const result: DailyData = { date };
      
      providers.forEach(provider => {
        const providerEvents = dayEvents.filter(e => e.provider === provider);
        const callEvents = providerEvents.filter(e => e.event_type.includes('call'));
        const calls = callEvents.length;
        const cost = providerEvents.reduce((sum, e) => sum + (e.cost_amount || 0), 0);
        const avgCost = calls > 0 ? cost / calls : 0;
        
        result[`${provider}_calls`] = calls;
        result[`${provider}_cost`] = cost;
        result[`${provider}_avgCost`] = avgCost;
      });
      
      return result;
    });

    // 4. Direction Analysis
    const directionAnalysis = sortedDates.map(date => {
      const dayEvents = eventsByDate[date];
      const inbound = dayEvents.filter(e => e.direction === 'inbound');
      const outbound = dayEvents.filter(e => e.direction === 'outbound');
      
      return {
        date,
        inbound_calls: inbound.filter(e => e.event_type.includes('call')).length,
        outbound_calls: outbound.filter(e => e.event_type.includes('call')).length,
        inbound_duration: inbound.reduce((sum, e) => sum + (e.duration_seconds || 0), 0) / 60,
        outbound_duration: outbound.reduce((sum, e) => sum + (e.duration_seconds || 0), 0) / 60,
        inbound_cost: inbound.reduce((sum, e) => sum + (e.cost_amount || 0), 0),
        outbound_cost: outbound.reduce((sum, e) => sum + (e.cost_amount || 0), 0)
      };
    });

    // 5. Average Duration Trend with moving average
    const avgDurationTrend = sortedDates.map((date, index) => {
      const dayEvents = eventsByDate[date];
      const callEvents = dayEvents.filter(e => e.event_type.includes('call') && e.duration_seconds);
      
      const durations = callEvents.map(e => (e.duration_seconds || 0) / 60);
      const avgDuration = durations.length > 0 
        ? durations.reduce((sum, d) => sum + d, 0) / durations.length 
        : 0;
      const minDuration = durations.length > 0 ? Math.min(...durations) : 0;
      const maxDuration = durations.length > 0 ? Math.max(...durations) : 0;
      
      // Calculate 7-day moving average
      const windowStart = Math.max(0, index - 6);
      const windowDates = sortedDates.slice(windowStart, index + 1);
      const windowAvg = windowDates.reduce((sum, d) => {
        const calls = eventsByDate[d].filter(e => e.event_type.includes('call') && e.duration_seconds);
        const dayAvg = calls.length > 0
          ? calls.reduce((s, e) => s + (e.duration_seconds || 0), 0) / calls.length / 60
          : 0;
        return sum + dayAvg;
      }, 0) / windowDates.length;
      
      return {
        date,
        avgDuration,
        minDuration,
        maxDuration,
        movingAverage: windowAvg
      };
    });

    // 6. Event Type Distribution
    const eventTypeDistribution = sortedDates.map(date => {
      const dayEvents = eventsByDate[date];
      return {
        date,
        calls: dayEvents.filter(e => e.event_type.includes('call')).length,
        sms: dayEvents.filter(e => e.event_type.includes('message')).length,
        transcripts: dayEvents.filter(e => e.event_type.includes('transcript')).length,
        recordings: dayEvents.filter(e => e.event_type.includes('recording')).length
      };
    });

    // Total stats
    const totalCalls = events.filter(e => e.event_type.includes('call')).length;
    const totalSMS = events.filter(e => e.event_type.includes('message')).length;
    const { rate: avgSuccessRate } = calculateSuccessRate(events);
    const callsWithDuration = events.filter(e => e.event_type.includes('call') && e.duration_seconds);
    const avgCallDuration = callsWithDuration.length > 0
      ? callsWithDuration.reduce((sum, e) => sum + (e.duration_seconds || 0), 0) / callsWithDuration.length / 60
      : 0;

    return {
      dailyActivity,
      successRateData,
      providerPerformance,
      directionAnalysis,
      avgDurationTrend,
      eventTypeDistribution,
      providers,
      totalStats: {
        totalCalls,
        totalSMS,
        avgSuccessRate,
        avgCallDuration
      }
    };
  }, [events]);
};
