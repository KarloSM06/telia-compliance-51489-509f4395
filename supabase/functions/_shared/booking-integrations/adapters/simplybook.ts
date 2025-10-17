import type {
  BookingSystemAdapter,
  AuthResult,
  FetchBookingsParams,
  Booking,
  BookingInput,
  WebhookConfig,
  BookingEvent,
  AvailabilityParams,
  TimeSlot
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
        throw new Error(`Auth failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, token: data.token };
    } catch (error) {
      return { success: false, error: error.message };
    }
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
    return (data.data || data || []).map((b: any) => this.toInternalFormat(b));
  }
  
  async getBooking(id: string): Promise<Booking> {
    const response = await fetch(`${this.apiUrl}/admin/bookings/${id}`, {
      headers: {
        'X-Company-Login': this.companyLogin,
        'X-Token': this.token
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get booking: ${response.statusText}`);
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
      `${this.apiUrl}/admin/availability?date=${params.date}${params.serviceId ? `&service_id=${params.serviceId}` : ''}`,
      {
        headers: {
          'X-Company-Login': this.companyLogin,
          'X-Token': this.token
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to get availability: ${response.statusText}`);
    }
    
    const data = await response.json();
    return (data || []).map((slot: any) => ({
      start: slot.time,
      end: slot.end_time,
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
      url: callbackUrl,
      events: ['booking.new', 'booking.changed', 'booking.cancelled']
    };
  }
  
  verifyWebhook(payload: any, signature: string): boolean {
    // SimplyBook webhook verification
    // Implementera enligt deras dokumentation
    return true;
  }
  
  parseWebhookEvent(payload: any): BookingEvent {
    return {
      type: payload.event_type || 'booking.updated',
      booking: this.toInternalFormat(payload.data || payload)
    };
  }
  
  toInternalFormat(external: any): Booking {
    return {
      id: external.id?.toString() || external.booking_id?.toString(),
      externalId: external.id?.toString() || external.booking_id?.toString(),
      title: external.service_name || external.title || 'Bokning',
      description: external.comment || external.description,
      startTime: external.start_date_time || external.start_time,
      endTime: external.end_date_time || external.end_time,
      status: this.mapStatus(external.status || external.booking_status),
      customer: {
        name: external.client_name || external.customer_name || 'Okänd kund',
        email: external.client_email || external.customer_email,
        phone: external.client_phone || external.customer_phone
      },
      metadata: {
        serviceId: external.event_id || external.service_id,
        providerId: external.unit_group_id,
        originalData: external
      }
    };
  }
  
  toExternalFormat(booking: Booking | BookingInput): any {
    return {
      event_id: (booking as any).metadata?.serviceId,
      start_date_time: booking.startTime,
      end_date_time: booking.endTime,
      client: {
        name: booking.customer.name,
        email: booking.customer.email,
        phone: booking.customer.phone
      },
      comment: booking.description
    };
  }
  
  private mapStatus(externalStatus: string): 'confirmed' | 'pending' | 'cancelled' {
    const statusMap: Record<string, 'confirmed' | 'pending' | 'cancelled'> = {
      'confirmed': 'confirmed',
      'approved': 'confirmed',
      'pending': 'pending',
      'new': 'pending',
      'cancelled': 'cancelled',
      'canceled': 'cancelled',
      'rejected': 'cancelled'
    };
    return statusMap[externalStatus?.toLowerCase()] || 'pending';
  }
}
