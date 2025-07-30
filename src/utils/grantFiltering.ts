
import { Grant } from '@/types/grant';
import { FilterOptions } from '@/components/FilterControls';

// Parse funding amount string to number for comparison
const parseFundingAmount = (fundingAmount: string | number): number => {
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

// Parse deadline to check if it's within specified days
const isDeadlineWithinDays = (deadline: string, days: number): boolean => {
  if (deadline === 'Ej specificerat') return false;
  
  // Parse Swedish date format
  const months: { [key: string]: number } = {
    'januari': 0, 'februari': 1, 'mars': 2, 'april': 3, 'maj': 4, 'juni': 5,
    'juli': 6, 'augusti': 7, 'september': 8, 'oktober': 9, 'november': 10, 'december': 11
  };
  
  const parts = deadline.toLowerCase().split(' ');
  if (parts.length >= 3) {
    const day = parseInt(parts[0], 10);
    const month = months[parts[1]];
    const year = parseInt(parts[2], 10);
    
    if (!isNaN(day) && month !== undefined && !isNaN(year)) {
      const deadlineDate = new Date(year, month, day);
      const today = new Date();
      const diffTime = deadlineDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays <= days && diffDays >= 0;
    }
  }
  
  return false;
};

export const filterGrants = (grants: Grant[], searchTerm: string, filters: FilterOptions): Grant[] => {
  return grants.filter(grant => {
    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (grant.title || '').toLowerCase().includes(searchLower) ||
        (grant.organization || '').toLowerCase().includes(searchLower) ||
        (grant.description || '').toLowerCase().includes(searchLower) ||
        (grant.tags || []).some(tag => tag.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;
    }

    // Organization filter
    if (filters.organization && grant.organization !== filters.organization) {
      return false;
    }

    // Funding amount filters
    const grantAmount = grant.funding_amount_eur ?? parseFundingAmount(grant.fundingAmount);
    
    if (filters.minFunding) {
      const minAmount = parseInt(filters.minFunding, 10);
      if (grantAmount < minAmount) return false;
    }
    
    if (filters.maxFunding) {
      const maxAmount = parseInt(filters.maxFunding, 10);
      if (grantAmount > maxAmount) return false;
    }

    // Deadline filter
    if (filters.deadline) {
      const days = parseInt(filters.deadline, 10);
      if (!isDeadlineWithinDays(grant.deadline, days)) return false;
    }

    return true;
  });
};

// Get unique organizations for filter dropdown
export const getUniqueOrganizations = (grants: Grant[]): string[] => {
  const organizations = grants
    .map(grant => grant.organization)
    .filter(Boolean)
    .filter((org, index, arr) => arr.indexOf(org) === index)
    .sort();
  
  return organizations;
};
