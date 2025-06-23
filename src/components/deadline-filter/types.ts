
import { addDays, addMonths, addWeeks } from 'date-fns';

export interface DeadlineFilter {
  type: 'preset' | 'custom';
  preset?: string;
  customRange?: {
    start: Date | null;
    end: Date | null;
  };
}

export interface DeadlinePreset {
  id: string;
  label: string;
  getDates: () => { start: Date; end: Date };
}

export const DEADLINE_PRESETS: DeadlinePreset[] = [
  { id: 'urgent', label: 'Urgent (7 days)', getDates: () => ({ start: new Date(), end: addDays(new Date(), 7) }) },
  { id: '2weeks', label: 'Next 2 weeks', getDates: () => ({ start: new Date(), end: addWeeks(new Date(), 2) }) },
  { id: '1month', label: 'Next month', getDates: () => ({ start: new Date(), end: addMonths(new Date(), 1) }) },
  { id: '3months', label: 'Next 3 months', getDates: () => ({ start: new Date(), end: addMonths(new Date(), 3) }) },
  { id: '6months', label: 'Next 6 months', getDates: () => ({ start: new Date(), end: addMonths(new Date(), 6) }) },
  { id: '1year', label: 'Next year', getDates: () => ({ start: new Date(), end: addMonths(new Date(), 12) }) },
];
