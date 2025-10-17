import type { BookingSystemAdapter } from './types.ts';
import { SimplyBookAdapter } from './adapters/simplybook.ts';

export class BookingAdapterFactory {
  static createAdapter(provider: string, credentials: any): BookingSystemAdapter {
    switch (provider) {
      case 'simplybook':
        return new SimplyBookAdapter(credentials);
      
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }
}
