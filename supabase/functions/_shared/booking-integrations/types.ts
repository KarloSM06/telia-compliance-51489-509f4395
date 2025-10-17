// Core types for booking system integrations

export interface BookingSystemAdapter {
  provider: string;
  
  // Auth
  authenticate(credentials: any): Promise<AuthResult>;
  
  // Bookings (Read)
  fetchBookings(params: FetchBookingsParams): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking>;
  
  // Bookings (Write)
  createBooking(booking: BookingInput): Promise<Booking>;
  updateBooking(id: string, updates: Partial<BookingInput>): Promise<Booking>;
  cancelBooking(id: string): Promise<void>;
  
  // Availability
  getAvailability?(params: AvailabilityParams): Promise<TimeSlot[]>;
  
  // Webhooks
  setupWebhook?(callbackUrl: string): Promise<WebhookConfig>;
  verifyWebhook?(payload: any, signature: string): boolean;
  parseWebhookEvent?(payload: any): BookingEvent;
  
  // Transformation
  toInternalFormat(externalBooking: any): Booking;
  toExternalFormat(internalBooking: Booking): any;
}

export interface AuthResult {
  success: boolean;
  token?: string;
  error?: string;
}

export interface FetchBookingsParams {
  startDate: string;
  endDate: string;
  status?: string[];
}

export interface AvailabilityParams {
  date: string;
  serviceId?: string;
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

export interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
}

export interface BookingEvent {
  type: string;
  booking: Booking;
}

export interface Booking {
  id: string;
  externalId?: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  customer: {
    name: string;
    email?: string;
    phone?: string;
  };
  metadata?: Record<string, any>;
}

export interface BookingInput {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  customer: {
    name: string;
    email?: string;
    phone?: string;
  };
  metadata?: Record<string, any>;
}
