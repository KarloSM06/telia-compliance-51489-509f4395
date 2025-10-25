import type { BookingSystemAdapter } from './types.ts';
import { SimplyBookAdapter } from './adapters/simplybook.ts';
import { GoogleCalendarAdapter } from './adapters/google-calendar.ts';
import { BookeoAdapter } from './adapters/bookeo.ts';

export class BookingAdapterFactory {
  static createAdapter(provider: string, credentials: any): BookingSystemAdapter {
    switch (provider) {
      case 'simplybook':
        return new SimplyBookAdapter(credentials);
      
      case 'google_calendar':
        return new GoogleCalendarAdapter(credentials);
      
      case 'bookeo':
        return new BookeoAdapter(credentials);
      
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }
}
