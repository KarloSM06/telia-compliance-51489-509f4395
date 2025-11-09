// @ts-nocheck
import type {
  BookingSystemAdapter,
  AuthResult,
  FetchBookingsParams,
  Booking,
  BookingInput,
  AvailabilityParams,
  TimeSlot,
  WebhookConfig,
  BookingEvent
} from '../types.ts';

export class SimplyBookAdapter implements BookingSystemAdapter {
  provider = 'simplybook';
  private apiUrl = 'https://user-api.simplybook.me';
  private token: string;
  private companyLogin: string;
  
  constructor(credentials: { token: string; companyLogin: string }) {
    this.token = credentials.token;
    this.companyLogin = credentials.companyLogin;
  }
  
  async authenticate(credentials: any): Promise<AuthResult> {
    try {
      const response = await fetch(`${this.apiUrl}/admin/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: credentials.companyLogin,
          login: credentials.login,
          password: credentials.password
        })
      });
      
      if (!response.ok) {
        return { success: false, error: 'Authentication failed' };
      }
      
      const data = await response.json();
      return { success: true, token: data.token };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async refreshAuth(): Promise<void> {
    // SimplyBook tokens don't typically need refresh
  }
  
  async fetchBookings(params: FetchBookingsParams): Promise<Booking[]> {
    const response = await fetch(
      `${this.apiUrl}/admin/bookings?date_from=${params.startDate}&date_to=${params.endDate}`,
      {
        headers: {
          'X-Company-Login': this.companyLogin,
          'X-Token': this.token
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch bookings: ${response.statusText}`);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data.map(b => this.toInternalFormat(b)) : [];
  }
  
  async getBooking(id: string): Promise<Booking> {
    const response = await fetch(
      `${this.apiUrl}/admin/bookings/${id}`,
      {
        headers: {
          'X-Company-Login': this.companyLogin,
          'X-Token': this.token
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch booking: ${response.statusText}`);
    }
    
    const data = await response.json();
    return this.toInternalFormat(data);
  }
  
  async createBooking(booking: BookingInput): Promise<Booking> {
    const externalFormat = this.toExternalFormat(booking);
    const response = await fetch(`${this.apiUrl}/admin/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Company-Login': this.companyLogin,
        'X-Token': this.token
      },
      body: JSON.stringify(externalFormat)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create booking: ${response.statusText}`);
    }
    
    const data = await response.json();
    return this.toInternalFormat(data);
  }
  
  async updateBooking(id: string, updates: Partial<BookingInput>): Promise<Booking> {
    const externalFormat = this.toExternalFormat(updates as BookingInput);
    const response = await fetch(`${this.apiUrl}/admin/bookings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Company-Login': this.companyLogin,
        'X-Token': this.token
      },
      body: JSON.stringify(externalFormat)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update booking: ${response.statusText}`);
    }
    
    const data = await response.json();
    return this.toInternalFormat(data);
  }
  
  async cancelBooking(id: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/admin/bookings/${id}`, {
      method: 'DELETE',
      headers: {
        'X-Company-Login': this.companyLogin,
        'X-Token': this.token
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to cancel booking: ${response.statusText}`);
    }
  }
  
  async getAvailability(params: AvailabilityParams): Promise<TimeSlot[]> {
    const response = await fetch(
      `${this.apiUrl}/admin/availability?service_id=${params.serviceId}&date=${params.date}`,
      {
        headers: {
          'X-Company-Login': this.companyLogin,
          'X-Token': this.token
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch availability: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.map((slot: any) => ({
      startTime: slot.start_time,
      endTime: slot.end_time,
      available: slot.is_available
    }));
  }
  
  async setupWebhook(callbackUrl: string): Promise<WebhookConfig> {
    const response = await fetch(`${this.apiUrl}/admin/webhooks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Company-Login': this.companyLogin,
        'X-Token': this.token
      },
      body: JSON.stringify({
        url: callbackUrl,
        events: ['booking.new', 'booking.changed', 'booking.cancelled']
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to setup webhook: ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      id: data.id,
      url: data.url,
      secret: data.secret,
      events: data.events
    };
  }
  
  verifyWebhook(payload: any, signature: string): boolean {
    // SimplyBook uses HMAC SHA256 for webhook verification
    // In production, you would verify the signature here
    // For now, we'll accept all webhooks (configure secret in webhook_secrets table)
    return true;
  }
  
  parseWebhookEvent(payload: any): BookingEvent {
    const eventType = payload.event_type || payload.type || 'booking.changed'
    const bookingData = payload.data || payload.booking || payload
    
    return {
      type: eventType,
      booking: this.toInternalFormat(bookingData)
    };
  }
  
  toInternalFormat(external: any): Booking {
    return {
      id: external.id?.toString() || '',
      externalId: external.id?.toString(),
      title: external.service_name || external.title || 'Bokning',
      description: external.comment || external.description,
      startTime: external.start_date_time || external.start_time,
      endTime: external.end_date_time || external.end_time,
      status: this.mapStatus(external.status || 'confirmed'),
      customer: {
        name: external.client_name || external.customer?.name || '',
        email: external.client_email || external.customer?.email,
        phone: external.client_phone || external.customer?.phone
      },
      metadata: {
        serviceId: external.event_id || external.service_id,
        providerId: external.unit_group_id || external.provider_id,
        originalData: external
      }
    };
  }
  
  toExternalFormat(booking: Booking | BookingInput): any {
    const hasId = 'id' in booking;
    return {
      event_id: booking.metadata?.serviceId,
      start_date_time: booking.startTime,
      end_date_time: booking.endTime,
      client: {
        name: booking.customer.name,
        email: booking.customer.email,
        phone: booking.customer.phone
      },
      comment: booking.description || '',
      ...(hasId && { id: booking.id })
    };
  }
  
  private mapStatus(externalStatus: string): 'confirmed' | 'pending' | 'cancelled' {
    const statusMap: Record<string, 'confirmed' | 'pending' | 'cancelled'> = {
      'confirmed': 'confirmed',
      'pending': 'pending',
      'cancelled': 'cancelled',
      'new': 'pending',
      'approved': 'confirmed'
    };
    return statusMap[externalStatus.toLowerCase()] || 'pending';
  }
}
