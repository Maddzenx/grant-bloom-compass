
import { Grant } from '@/types/grant';

// Parse funding amount string to number for comparison
export const parseFundingAmount = (fundingAmount: string): number => {
  const match = fundingAmount.match(/(\d+(?:[.,]\d+)?)\s*M?SEK/i);
  if (match) {
    const amount = parseFloat(match[1].replace(',', '.'));
    return fundingAmount.includes('M') ? amount * 1000000 : amount;
  }
  
  const numbers = fundingAmount.match(/\d+(?:\s*\d+)*/g);
  if (!numbers) return 0;
  
  const firstNumber = numbers[0].replace(/\s/g, '');
  return parseInt(firstNumber, 10) || 0;
};

// Check if deadline is within specified days
export const isGrantWithinDeadline = (grant: Grant, deadlineFilter: any): boolean => {
  if (grant.deadline === 'Ej specificerat') return false;
  
  // Parse Swedish date format
  const months: { [key: string]: number } = {
    'januari': 0, 'februari': 1, 'mars': 2, 'april': 3, 'maj': 4, 'juni': 5,
    'juli': 6, 'augusti': 7, 'september': 8, 'oktober': 9, 'november': 10, 'december': 11
  };
  
  const parts = grant.deadline.toLowerCase().split(' ');
  if (parts.length < 3) return false;
  
  const day = parseInt(parts[0], 10);
  const month = months[parts[1]];
  const year = parseInt(parts[2], 10);
  
  if (isNaN(day) || month === undefined || isNaN(year)) return false;
  
  const deadlineDate = new Date(year, month, day);
  const today = new Date();
  
  if (deadlineFilter.type === 'preset' && deadlineFilter.preset) {
    const presetDays: { [key: string]: number } = {
      'urgent': 7,
      '2weeks': 14,
      '1month': 30,
      '3months': 90,
      '6months': 180,
      '1year': 365,
    };
    
    const days = presetDays[deadlineFilter.preset];
    if (days) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + days);
      return deadlineDate >= today && deadlineDate <= targetDate;
    }
  }
  
  if (deadlineFilter.type === 'custom' && deadlineFilter.customRange) {
    const { start, end } = deadlineFilter.customRange;
    if (start && deadlineDate < start) return false;
    if (end && deadlineDate > end) return false;
    return true;
  }
  
  return true;
};
