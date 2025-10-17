export interface BookingSystemAdapter {
  provider: string;
  
  authenticate(credentials: any): Promise<AuthResult>;
  refreshAuth(): Promise<void>;
  
  fetchBookings(params: FetchBookingsParams): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking>;
  
  createBooking(booking: BookingInput): Promise<Booking>;
  updateBooking(id: string, updates: Partial<BookingInput>): Promise<Booking>;
  cancelBooking(id: string): Promise<void>;
  
  getAvailability(params: AvailabilityParams): Promise<TimeSlot[]>;
  
  setupWebhook(callbackUrl: string): Promise<WebhookConfig>;
  verifyWebhook(payload: any, signature: string): boolean;
  parseWebhookEvent(payload: any): BookingEvent;
  
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

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface AvailabilityParams {
  serviceId?: string;
  date: string;
}

export interface WebhookConfig {
  id: string;
  url: string;
  secret?: string;
  events: string[];
}

export interface BookingEvent {
  type: string;
  booking: Booking;
}
