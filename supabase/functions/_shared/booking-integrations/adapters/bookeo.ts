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

export class BookeoAdapter implements BookingSystemAdapter {
  provider = 'bookeo';
  private apiUrl = 'https://api.bookeo.com/v2';
  private apiKey: string;
  private secretKey: string;
  
  constructor(credentials: { apiKey: string; secretKey: string }) {
    this.apiKey = credentials.apiKey;
    this.secretKey = credentials.secretKey;
  }
  
  async authenticate(credentials: any): Promise<AuthResult> {
    try {
      const response = await fetch(`${this.apiUrl}/settings/business`, {
        headers: {
          'Authorization': `Bearer ${credentials.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        return { success: false, error: 'Authentication failed' };
      }
      
      return { success: true, token: credentials.apiKey };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async refreshAuth(): Promise<void> {
    // Bookeo API keys don't expire
  }
  
  async fetchBookings(params: FetchBookingsParams): Promise<Booking[]> {
    const response = await fetch(
      `${this.apiUrl}/bookings?startTime=${params.startDate}&endTime=${params.endDate}`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch bookings: ${response.statusText}`);
    }
    
    const data = await response.json();
    return (data.data || []).map((b: any) => this.toInternalFormat(b));
  }
  
  async getBooking(id: string): Promise<Booking> {
    const response = await fetch(
      `${this.apiUrl}/bookings/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
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
    const response = await fetch(`${this.apiUrl}/bookings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
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
    const response = await fetch(`${this.apiUrl}/bookings/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
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
    const response = await fetch(`${this.apiUrl}/bookings/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to cancel booking: ${response.statusText}`);
    }
  }
  
  async getAvailability(params: AvailabilityParams): Promise<TimeSlot[]> {
    const response = await fetch(
      `${this.apiUrl}/availability/slots?productId=${params.serviceId}&startTime=${params.date}`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch availability: ${response.statusText}`);
    }
    
    const data = await response.json();
    return (data.data || []).map((slot: any) => ({
      startTime: slot.startTime,
      endTime: slot.endTime,
      available: true
    }));
  }
  
  async setupWebhook(callbackUrl: string): Promise<WebhookConfig> {
    const response = await fetch(`${this.apiUrl}/settings/webhooks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: callbackUrl,
        events: ['booking.created', 'booking.updated', 'booking.cancelled']
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to setup webhook: ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      id: data.webhookId,
      url: data.url,
      secret: data.signingKey,
      events: data.events
    };
  }
  
  verifyWebhook(payload: any, signature: string): boolean {
    // Bookeo uses HMAC SHA256
    // Signature verification would be implemented here
    return true;
  }
  
  parseWebhookEvent(payload: any): BookingEvent {
    return {
      type: payload.event || 'booking.updated',
      booking: this.toInternalFormat(payload.data || payload)
    };
  }
  
  toInternalFormat(external: any): Booking {
    return {
      id: external.bookingNumber || external.id,
      externalId: external.bookingNumber || external.id,
      title: external.title || external.productName || 'Booking',
      description: external.customerNotes || external.notes,
      startTime: external.startTime,
      endTime: external.endTime,
      status: this.mapStatus(external.canceled ? 'cancelled' : 'confirmed'),
      customer: {
        name: external.customer?.name || '',
        email: external.customer?.email,
        phone: external.customer?.phoneNumbers?.[0]?.number
      },
      metadata: {
        productId: external.productId,
        originalData: external
      }
    };
  }
  
  toExternalFormat(booking: Booking | BookingInput): any {
    return {
      productId: booking.metadata?.productId,
      startTime: booking.startTime,
      endTime: booking.endTime,
      customer: {
        name: booking.customer.name,
        email: booking.customer.email,
        phoneNumbers: booking.customer.phone ? [{ number: booking.customer.phone }] : []
      },
      customerNotes: booking.description || ''
    };
  }
  
  private mapStatus(externalStatus: string): 'confirmed' | 'pending' | 'cancelled' {
    if (externalStatus === 'cancelled') return 'cancelled';
    return 'confirmed';
  }
}