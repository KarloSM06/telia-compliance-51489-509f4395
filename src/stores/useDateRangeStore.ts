import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DateRange {
  from: Date;
  to: Date;
}

interface DateRangeState {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  setPreset: (days: 7 | 30 | 90) => void;
}

export const useDateRangeStore = create<DateRangeState>()(
  persist(
    (set) => ({
      // Default: Last 30 days
      dateRange: {
        from: new Date(new Date().setDate(new Date().getDate() - 30)),
        to: new Date(),
      },
      setDateRange: (range) => set({ dateRange: range }),
      setPreset: (days) => {
        const to = new Date();
        const from = new Date(to);
        from.setDate(to.getDate() - days);
        set({ dateRange: { from, to } });
      },
    }),
    {
      name: 'hiems-date-range-storage',
    }
  )
);
