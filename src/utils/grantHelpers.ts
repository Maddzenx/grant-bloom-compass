
import { Grant, GrantListItem } from '@/types/grant';

// Parse funding amount string or number to number for comparison
export const parseFundingAmount = (fundingAmount: string | number): number => {
  // If it's already a number, return it
  if (typeof fundingAmount === 'number') {
    return fundingAmount;
  }
  
  // If it's a string, parse it
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

// Sophisticated funding amount formatter that matches grantTransform.ts logic
export const formatFundingAmount = (
  grant: {
    max_funding_per_project?: number | null;
    min_funding_per_project?: number | null;
    total_funding_per_call?: number | null;
    total_funding_amount?: number | null;
    currency?: string | null;
  }
): string => {
  const currency = grant.currency || 'SEK';
  
  // Helper to format large amounts in millions
  const formatAmount = (amount: number): string => {
    if (amount >= 1000000) {
      const millions = amount / 1000000;
      return `${millions.toFixed(millions % 1 === 0 ? 0 : 1)} M${currency}`;
    }
    return `${amount.toLocaleString()} ${currency}`;
  };
  
  // Priority: max_funding_per_project if not null, otherwise total_funding_per_call
  if (grant.max_funding_per_project) {
    if (grant.min_funding_per_project && grant.min_funding_per_project !== grant.max_funding_per_project) {
      const result = `${formatAmount(grant.min_funding_per_project)} - ${formatAmount(grant.max_funding_per_project)}`;
      console.log('🔍 formatFundingAmount: min-max ->', result);
      return result;
    } else {
      const result = formatAmount(grant.max_funding_per_project);
      console.log('🔍 formatFundingAmount: max only ->', result);
      return result;
    }
  }
  
  // Fallback to total_funding_per_call (from grantTransform.ts) or total_funding_amount (from services)
  const totalAmount = grant.total_funding_per_call || grant.total_funding_amount;
  if (totalAmount) {
    const result = formatAmount(totalAmount);
    console.log('🔍 formatFundingAmount: total ->', result);
    return result;
  }
  
  console.log('🔍 formatFundingAmount: no amount specified');
  return 'Ej specificerat';
};

// Parse deadline string to Date object
export const parseDeadline = (deadline: string): Date | null => {
  if (deadline === 'Ej specificerat' || !deadline) return null;
  
  // Parse Swedish date format
  const months: { [key: string]: number } = {
    'januari': 0, 'februari': 1, 'mars': 2, 'april': 3, 'maj': 4, 'juni': 5,
    'juli': 6, 'augusti': 7, 'september': 8, 'oktober': 9, 'november': 10, 'december': 11
  };
  
  const parts = deadline.toLowerCase().split(' ');
  if (parts.length < 3) return null;
  
  const day = parseInt(parts[0], 10);
  const month = months[parts[1]];
  const year = parseInt(parts[2], 10);
  
  if (isNaN(day) || month === undefined || isNaN(year)) return null;
  
  return new Date(year, month, day);
};

// Check if grant is active (not past deadline)
export const isGrantActive = (grant: Grant | GrantListItem): boolean => {
  const deadlineDate = parseDeadline(grant.deadline);
  if (!deadlineDate) return true; // If no deadline specified, consider it active
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison
  
  return deadlineDate >= today;
};

// Check if deadline is within specified days
export const isGrantWithinDeadline = (grant: Grant | GrantListItem, deadlineFilter: any): boolean => {
  if (grant.deadline === 'Ej specificerat') return false;
  
  const deadlineDate = parseDeadline(grant.deadline);
  if (!deadlineDate) return false;
  
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

/**
 * Formats cofinancing text based on cofinancing_required and cofinancing_level
 * @param cofinancing_required - Whether cofinancing is required
 * @param cofinancing_level - The cofinancing percentage level
 * @returns Formatted cofinancing text
 */
export const formatCofinancingText = (cofinancing_required?: boolean, cofinancing_level?: number): string => {
  if (cofinancing_required === false) {
    return 'Ingen medfinansiering krävs';
  }
  
  if (cofinancing_required === true && cofinancing_level !== null && cofinancing_level !== undefined) {
    return `${cofinancing_level}% medfinansiering krävs`;
  }
  
  if (cofinancing_required === true) {
    return 'Medfinansiering krävs';
  }
  
  return 'Ej specificerat';
};
