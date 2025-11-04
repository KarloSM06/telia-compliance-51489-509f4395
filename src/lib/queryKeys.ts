/**
 * Centralized query keys for React Query
 * Prevents typos and makes it easier to invalidate queries
 */

export const queryKeys = {
  // AI Usage
  aiUsage: {
    all: ['ai-usage'] as const,
    logs: (userId: string, dateRange?: { from: Date; to: Date }) =>
      ['ai-usage', 'logs', userId, dateRange] as const,
    summary: (userId: string, dateRange?: { from: Date; to: Date }) =>
      ['ai-usage', 'summary', userId, dateRange] as const,
  },

  // OpenRouter
  openRouter: {
    all: ['openrouter'] as const,
    activity: (dateRange?: { from: Date; to: Date }) =>
      ['openrouter', 'activity', dateRange] as const,
    activitySEK: (dateRange?: { from: Date; to: Date }) =>
      ['openrouter', 'activity-sek', dateRange] as const,
    credits: () => ['openrouter', 'credits'] as const,
    keys: () => ['openrouter', 'keys'] as const,
    keyDetails: (keyHash: string) => ['openrouter', 'key-details', keyHash] as const,
    keyInfo: () => ['openrouter', 'key-info'] as const,
    models: () => ['openrouter', 'models'] as const,
  },

  // Telephony
  telephony: {
    all: ['telephony'] as const,
    events: (integrationId?: string, dateRange?: { from: Date; to: Date }) =>
      ['telephony', 'events', integrationId, dateRange] as const,
    accounts: (userId: string) => ['telephony', 'accounts', userId] as const,
    integrations: (userId: string) => ['telephony', 'integrations', userId] as const,
    metrics: (dateRange?: { from: Date; to: Date }) =>
      ['telephony', 'metrics', dateRange] as const,
    messages: (dateRange?: { from: Date; to: Date }) =>
      ['telephony', 'messages', dateRange] as const,
    syncJobs: (integrationId?: string) =>
      ['telephony', 'sync-jobs', integrationId] as const,
    agents: (userId: string) => ['telephony', 'agents', userId] as const,
  },

  // Calendar & Bookings
  calendar: {
    all: ['calendar'] as const,
    events: (userId: string, dateRange?: { from: Date; to: Date }) =>
      ['calendar', 'events', userId, dateRange] as const,
    calendars: (userId: string) => ['calendar', 'calendars', userId] as const,
    availability: (userId: string) => ['calendar', 'availability', userId] as const,
  },

  // Booking Systems
  bookingSystems: {
    all: ['booking-systems'] as const,
    integrations: (userId: string) => ['booking-systems', 'integrations', userId] as const,
    syncQueue: (integrationId: string) =>
      ['booking-systems', 'sync-queue', integrationId] as const,
  },

  // Leads
  leads: {
    all: ['leads'] as const,
    list: (userId: string, filters?: any) => ['leads', 'list', userId, filters] as const,
    detail: (leadId: string) => ['leads', 'detail', leadId] as const,
    activities: (leadId: string) => ['leads', 'activities', leadId] as const,
    searches: (userId: string) => ['leads', 'searches', userId] as const,
  },

  // Lead Chat
  leadChat: {
    all: ['lead-chat'] as const,
    conversations: (userId: string) => ['lead-chat', 'conversations', userId] as const,
    messages: (conversationId: string) =>
      ['lead-chat', 'messages', conversationId] as const,
  },

  // Analytics
  analytics: {
    all: ['analytics'] as const,
    data: (userId: string, dateRange?: { from: Date; to: Date }) =>
      ['analytics', 'data', userId, dateRange] as const,
    roi: (userId: string, dateRange?: { from: Date; to: Date }) =>
      ['analytics', 'roi', userId, dateRange] as const,
    funnel: (userId: string, dateRange?: { from: Date; to: Date }) =>
      ['analytics', 'funnel', userId, dateRange] as const,
  },

  // Dashboards
  dashboards: {
    all: ['dashboards'] as const,
    list: (userId: string) => ['dashboards', 'list', userId] as const,
    detail: (dashboardId: string) => ['dashboards', 'detail', dashboardId] as const,
    widgets: (dashboardId: string) => ['dashboards', 'widgets', dashboardId] as const,
    shares: (dashboardId: string) => ['dashboards', 'shares', dashboardId] as const,
  },

  // Reviews
  reviews: {
    all: ['reviews'] as const,
    list: (userId: string, dateRange?: { from: Date; to: Date }) =>
      ['reviews', 'list', userId, dateRange] as const,
    insights: (userId: string) => ['reviews', 'insights', userId] as const,
  },

  // Business Metrics
  businessMetrics: {
    all: ['business-metrics'] as const,
    detail: (userId: string) => ['business-metrics', 'detail', userId] as const,
  },

  // User & Profile
  user: {
    all: ['user'] as const,
    profile: (userId: string) => ['user', 'profile', userId] as const,
    settings: (userId: string) => ['user', 'settings', userId] as const,
    aiSettings: (userId: string) => ['user', 'ai-settings', userId] as const,
  },

  // Agents
  agents: {
    all: ['agents'] as const,
    list: (userId: string) => ['agents', 'list', userId] as const,
    detail: (agentId: string) => ['agents', 'detail', agentId] as const,
  },

  // Admin
  admin: {
    all: ['admin'] as const,
    users: () => ['admin', 'users'] as const,
    metrics: (dateRange?: { from: Date; to: Date }) =>
      ['admin', 'metrics', dateRange] as const,
    userActivity: (dateRange?: { from: Date; to: Date }) =>
      ['admin', 'user-activity', dateRange] as const,
    aggregatedData: (dateRange?: { from: Date; to: Date }) =>
      ['admin', 'aggregated-data', dateRange] as const,
    callTranscripts: (userId?: string) =>
      ['admin', 'call-transcripts', userId] as const,
  },
} as const;

export type QueryKeys = typeof queryKeys;
