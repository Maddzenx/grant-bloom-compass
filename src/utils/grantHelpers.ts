
import { Grant, GrantListItem } from '@/types/grant';
import { debugFundingAmount } from './debug';

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
    // Use spaces instead of commas for thousand separators (Swedish format)
    return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currency}`;
  };
  
  // Priority: max_funding_per_project if not null, otherwise total_funding_per_call
  if (grant.max_funding_per_project) {
    if (grant.min_funding_per_project && grant.min_funding_per_project !== grant.max_funding_per_project) {
      const result = `${formatAmount(grant.min_funding_per_project)} - ${formatAmount(grant.max_funding_per_project)}`;
      debugFundingAmount('min-max', result);
      return result;
    } else {
      const result = formatAmount(grant.max_funding_per_project);
      debugFundingAmount('max only', result);
      return result;
    }
  }
  
  // Fallback to total_funding_per_call
  const totalAmount = grant.total_funding_per_call;
  if (totalAmount) {
    const result = formatAmount(totalAmount);
    debugFundingAmount('total', result);
    return result;
  }
  
  debugFundingAmount('no amount specified', 'Ej specificerat');
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
 * Formats cofinancing text based on cofinancing_required and cofinancing level range
 * @param cofinancing_required - Whether cofinancing is required
 * @param cofinancing_level_min - The minimum cofinancing percentage level
 * @param cofinancing_level_max - The maximum cofinancing percentage level
 * @returns Formatted cofinancing text
 */
export const formatCofinancingText = (
  cofinancing_required?: boolean, 
  cofinancing_level_min?: number, 
  cofinancing_level_max?: number
): string => {
  if (cofinancing_required === false) {
    return 'Ingen medfinansiering krävs';
  }
  
  if (cofinancing_required === true) {
    // Check if we have any cofinancing level data
    if (cofinancing_level_min !== undefined || cofinancing_level_max !== undefined) {
      if (cofinancing_level_min !== undefined && cofinancing_level_max !== undefined) {
        if (cofinancing_level_min === cofinancing_level_max) {
          return `${cofinancing_level_min}% medfinansiering krävs`;
        } else {
          return `${cofinancing_level_min}-${cofinancing_level_max}% medfinansiering krävs`;
        }
      } else if (cofinancing_level_min !== undefined) {
        return `min ${cofinancing_level_min}% medfinansiering krävs`;
      } else if (cofinancing_level_max !== undefined) {
        return `max ${cofinancing_level_max}% medfinansiering krävs`;
      }
    }
    
    // Fallback when cofinancing is required but no specific levels are available
    return 'Medfinansiering krävs';
  }
  
  return 'Ej specificerat';
};

/**
 * Calculates grant status based on application opening and closing dates
 * @param application_opening_date - The application opening date
 * @param application_closing_date - The application closing date
 * @returns 'upcoming' | 'open' | 'closed' - Grant status
 */
export const calculateGrantStatus = (
  application_opening_date?: string, 
  application_closing_date?: string
): 'upcoming' | 'open' | 'closed' => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison

  // Parse opening date
  let openingDate: Date | null = null;
  if (application_opening_date) {
    try {
      openingDate = new Date(application_opening_date);
      if (isNaN(openingDate.getTime())) {
        // Try to parse Swedish date format (e.g., '15 mars 2025')
        const [day, monthName, year] = application_opening_date.split(' ');
        const months = ['januari','februari','mars','april','maj','juni','juli','augusti','september','oktober','november','december'];
        const month = months.findIndex(m => m === monthName.toLowerCase());
        if (month !== -1) {
          openingDate.setFullYear(Number(year), month, Number(day));
        } else {
          openingDate = null; // Invalid date format
        }
      }
      openingDate.setHours(0, 0, 0, 0);
    } catch (error) {
      console.warn('Error parsing application opening date:', application_opening_date, error);
      openingDate = null;
    }
  }

  // Parse closing date
  let closingDate: Date | null = null;
  if (application_closing_date) {
    try {
      closingDate = new Date(application_closing_date);
      if (isNaN(closingDate.getTime())) {
        // Try to parse Swedish date format (e.g., '15 mars 2025')
        const [day, monthName, year] = application_closing_date.split(' ');
        const months = ['januari','februari','mars','april','maj','juni','juli','augusti','september','oktober','november','december'];
        const month = months.findIndex(m => m === monthName.toLowerCase());
        if (month !== -1) {
          closingDate.setFullYear(Number(year), month, Number(day));
        } else {
          closingDate = null; // Invalid date format
        }
      }
      closingDate.setHours(0, 0, 0, 0);
    } catch (error) {
      console.warn('Error parsing application closing date:', application_closing_date, error);
      closingDate = null;
    }
  }

  // Determine status
  if (openingDate && today < openingDate) {
    return 'upcoming'; // Grant hasn't opened yet
  } else if (closingDate && today <= closingDate) {
    return 'open'; // Grant is currently open
  } else {
    return 'closed'; // Grant is closed (either no dates or deadline passed)
  }
};
