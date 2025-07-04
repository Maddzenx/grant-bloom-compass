
import { Grant } from '@/types/grant';

// Helper function to parse funding amounts
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
export const processOrganizationOptions = (grants: Grant[]) => {
  const orgCounts = grants.reduce((acc, grant) => {
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
