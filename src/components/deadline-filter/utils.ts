
import { format } from 'date-fns';
import { DeadlineFilter, DEADLINE_PRESETS } from './types';

export const getDisplayText = (value: DeadlineFilter): string => {
  if (value.type === 'preset' && value.preset) {
    const preset = DEADLINE_PRESETS.find(p => p.id === value.preset);
    return preset?.label || 'Custom range';
  }
  
  if (value.type === 'custom' && (value.customRange?.start || value.customRange?.end)) {
    const start = value.customRange.start ? format(value.customRange.start, 'MMM dd') : 'Any';
    const end = value.customRange.end ? format(value.customRange.end, 'MMM dd') : 'Any';
    return `${start} - ${end}`;
  }
  
  return 'All deadlines';
};

export const hasActiveFilter = (value: DeadlineFilter): boolean => {
  return !!(value.preset || value.customRange?.start || value.customRange?.end);
};
