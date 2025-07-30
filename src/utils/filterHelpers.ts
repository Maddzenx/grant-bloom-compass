
import { Grant, GrantListItem } from '@/types/grant';

// Helper function to parse funding amounts
export const parseFundingAmount = (fundingAmount: string | number): number => {
  // If it's already a number, return it
  if (typeof fundingAmount === 'number') {
    return fundingAmount;
  }
  
  // If it's a string, parse it - handle both SEK and EUR currencies
  const match = fundingAmount.match(/(\d+(?:[.,]\d+)?)\s*M?(SEK|EUR)/i);
  if (match) {
    const amount = parseFloat(match[1].replace(',', '.'));
    return fundingAmount.includes('M') ? amount * 1000000 : amount;
  }
  
  // Fallback: try to extract any number from the string
  const numbers = fundingAmount.match(/\d+(?:\s*\d+)*/g);
  if (!numbers) return 0;
  
  const firstNumber = numbers[0].replace(/\s/g, '');
  return parseInt(firstNumber, 10) || 0;
};

// Calculate active filter count
export const calculateActiveFilterCount = (filters: any): number => {
  return [
    filters.organizations.length,
    filters.fundingRange.min || filters.fundingRange.max ? 1 : 0,
    filters.deadline.preset || filters.deadline.customRange?.start ? 1 : 0,
    filters.tags.length
  ].reduce((sum, count) => sum + count, 0);
};

// Process organizations with grant counts
export const processOrganizationOptions = (grants: (Grant | GrantListItem)[]) => {
  const orgCounts = grants.reduce((acc: Record<string, number>, grant) => {
    acc[grant.organization] = (acc[grant.organization] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(orgCounts)
    .map(([org, count]) => ({
      value: org,
      label: org,
      count,
    }))
    .sort((a, b) => b.count - a.count);
};
