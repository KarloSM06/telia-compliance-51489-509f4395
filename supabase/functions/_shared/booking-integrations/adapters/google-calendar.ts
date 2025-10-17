import { BookingSystemAdapter, CalendarEvent, SyncResult } from '../types.ts';

interface GoogleCalendarCredentials {
  'Client ID': string;
  'Client Secret': string;
  access_token?: string;
  refresh_token?: string;
  token_expiry?: string;
}

export class GoogleCalendarAdapter implements BookingSystemAdapter {
  private credentials: GoogleCalendarCredentials;
  private accessToken: string | null = null;

  constructor(credentials: GoogleCalendarCredentials) {
    this.credentials = credentials;
    this.accessToken = credentials.access_token || null;
  }

  async authenticate(): Promise<void> {
    // Check if token is expired
    if (this.credentials.token_expiry) {
      const expiry = new Date(this.credentials.token_expiry);
      const now = new Date();
      
      // If token expires in less than 5 minutes, refresh it
      if (expiry.getTime() - now.getTime() < 5 * 60 * 1000) {
        await this.refreshToken();
        return;
      }
    }

    // If we have an access token, verify it's valid
    if (this.accessToken) {
      try {
        const response = await fetch('https://www.googleapis.com/oauth2/v1/tokeninfo', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        });
        
        if (response.ok) {
          return; // Token is valid
        }
      } catch (error) {
        console.log('Access token validation failed, attempting refresh');
      }
    }

    // Try to refresh if we have a refresh token
    if (this.credentials.refresh_token) {
      await this.refreshToken();
    } else {
      throw new Error('Google Calendar requires OAuth2 authentication. Please reconnect your Google Calendar.');
    }
  }

  private async refreshToken(): Promise<void> {
    // Note: In production, this should call the edge function to refresh the token
    // For now, we'll just throw an error indicating reconnection is needed
    throw new Error('Token refresh needed. Please reconnect your Google Calendar.');
  }

  async fetchEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    if (!this.accessToken) {
      throw new Error('Not authenticated with Google Calendar');
    }

    const timeMin = startDate.toISOString();
    const timeMax = endDate.toISOString();

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&orderBy=startTime`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch Google Calendar events: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    return (data.items || []).map((item: any) => ({
      external_id: item.id,
      title: item.summary || 'No title',
      description: item.description,
      start_time: item.start.dateTime || item.start.date,
      end_time: item.end.dateTime || item.end.date,
      event_type: item.eventType || 'default',
      status: this.mapGoogleStatus(item.status),
      attendees: item.attendees?.map((a: any) => ({
        email: a.email,
        name: a.displayName,
        responseStatus: a.responseStatus,
      })),
      location: item.location,
      meet_link: item.hangoutLink,
    }));
  }

  async createEvent(event: CalendarEvent): Promise<string> {
    if (!this.accessToken) {
      throw new Error('Not authenticated with Google Calendar');
    }

    const googleEvent = {
      summary: event.title,
      description: event.description,
      start: {
        dateTime: event.start_time,
        timeZone: 'Europe/Stockholm',
      },
      end: {
        dateTime: event.end_time,
        timeZone: 'Europe/Stockholm',
      },
      location: event.location,
      attendees: event.attendees?.map(a => ({
        email: a.email,
        displayName: a.name,
      })),
    };

    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(googleEvent),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create Google Calendar event: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.id;
  }

  async updateEvent(externalId: string, event: Partial<CalendarEvent>): Promise<void> {
    if (!this.accessToken) {
      throw new Error('Not authenticated with Google Calendar');
    }

    const updateData: any = {};
    
    if (event.title) updateData.summary = event.title;
    if (event.description) updateData.description = event.description;
    if (event.start_time) {
      updateData.start = {
        dateTime: event.start_time,
        timeZone: 'Europe/Stockholm',
      };
    }
    if (event.end_time) {
      updateData.end = {
        dateTime: event.end_time,
        timeZone: 'Europe/Stockholm',
      };
    }
    if (event.location) updateData.location = event.location;

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${externalId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update Google Calendar event: ${response.status} - ${errorText}`);
    }
  }

  async deleteEvent(externalId: string): Promise<void> {
    if (!this.accessToken) {
      throw new Error('Not authenticated with Google Calendar');
    }

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${externalId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      }
    );

    if (!response.ok && response.status !== 404) {
      const errorText = await response.text();
      throw new Error(`Failed to delete Google Calendar event: ${response.status} - ${errorText}`);
    }
  }

  async syncEvents(startDate: Date, endDate: Date): Promise<SyncResult> {
    const result: SyncResult = {
      created: 0,
      updated: 0,
      deleted: 0,
      errors: [],
    };

    try {
      await this.authenticate();
      const events = await this.fetchEvents(startDate, endDate);
      
      // Note: In a full implementation, you would:
      // 1. Compare with existing events in the database
      // 2. Create/update/delete as needed
      // 3. Track the counts in the result object
      
      console.log(`Fetched ${events.length} events from Google Calendar`);
      result.created = events.length;
      
    } catch (error) {
      result.errors.push(error.message);
      console.error('Google Calendar sync error:', error);
    }

    return result;
  }

  private mapGoogleStatus(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'scheduled';
      case 'tentative':
        return 'pending';
      case 'cancelled':
        return 'cancelled';
      default:
        return 'scheduled';
    }
  }
}
