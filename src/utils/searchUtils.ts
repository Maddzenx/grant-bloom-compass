
import { Grant } from '@/types/grant';
import { FilterOptions } from '@/components/FilterControls';
import { calculateRelevanceScore } from '@/utils/searchAlgorithms';

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

// Parse deadline to Date for comparison
export const parseDeadline = (deadline: string): Date => {
  if (deadline === 'Ej specificerat') return new Date(2099, 11, 31);
  
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
      return new Date(year, month, day);
    }
  }
  
  return new Date();
};

// Check if deadline is within specified days
export const isDeadlineWithinDays = (deadline: string, days: number): boolean => {
  if (deadline === 'Ej specificerat') return false;
  
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

// Apply filters to grants
export const applyFilters = (grants: Grant[], filters: FilterOptions): Grant[] => {
  return grants.filter(grant => {
    // Organization filter
    if (filters.organization && grant.organization !== filters.organization) {
      return false;
    }

    // Funding amount filters
    if (filters.minFunding || filters.maxFunding) {
      const grantAmount = parseFundingAmount(grant.fundingAmount);
      
      if (filters.minFunding) {
        const minAmount = parseInt(filters.minFunding, 10);
        if (grantAmount < minAmount) return false;
      }
      
      if (filters.maxFunding) {
        const maxAmount = parseInt(filters.maxFunding, 10);
        if (grantAmount > maxAmount) return false;
      }
    }

    // Deadline filter
    if (filters.deadline) {
      const days = parseInt(filters.deadline, 10);
      if (!isDeadlineWithinDays(grant.deadline, days)) return false;
    }

    return true;
  });
};

// Apply sorting to grants
export const applySorting = (grants: Grant[], sortBy: string, searchTerm: string): Grant[] => {
  if (sortBy === "none") return grants;
  
  return [...grants].sort((a, b) => {
    switch (sortBy) {
      case "deadline":
        const dateA = parseDeadline(a.deadline);
        const dateB = parseDeadline(b.deadline);
        return dateA.getTime() - dateB.getTime();
      
      case "funding":
        const amountA = parseFundingAmount(a.fundingAmount);
        const amountB = parseFundingAmount(b.fundingAmount);
        return amountB - amountA;
      
      case "relevance":
        if (searchTerm) {
          const scoreA = calculateRelevanceScore(a, searchTerm);
          const scoreB = calculateRelevanceScore(b, searchTerm);
          return scoreB - scoreA;
        }
        return 0;
      
      default:
        return 0;
    }
  });
};

// Generate cache key for search operations
export const generateCacheKey = (term: string, filters: FilterOptions, sortBy: string): string => {
  return `${term}|${JSON.stringify(filters)}|${sortBy}`;
};
