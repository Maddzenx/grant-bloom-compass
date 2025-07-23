
import { Grant } from "@/types/grant";

export type SortOption = "default" | "deadline-asc" | "deadline-desc" | "amount-desc" | "amount-asc" | "created-desc" | "relevance";

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

// Parse deadline string to Date for comparison
const parseDeadline = (deadline: string): Date => {
  if (deadline === 'Ej specificerat') return new Date(2099, 11, 31); // Far future date
  
  // Handle Swedish date format like "15 mars 2025"
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
  
  // Fallback to current date if parsing fails
  return new Date();
};

// Calculate relevance score based on various factors
const calculateRelevanceScore = (grant: Grant, searchTerm: string): number => {
  let score = 0;
  const searchLower = searchTerm.toLowerCase();
  
  if (!searchTerm) {
    // If no search term, score by funding amount and deadline
    const fundingAmount = parseFundingAmount(grant.fundingAmount);
    const deadline = parseDeadline(grant.deadline);
    const daysUntilDeadline = Math.max(0, (deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    // Higher funding = higher score (normalized)
    score += Math.min(fundingAmount / 10000000, 10); // Cap at 10 points
    
    // Closer deadline = higher urgency score
    if (daysUntilDeadline <= 30) score += 5;
    else if (daysUntilDeadline <= 90) score += 3;
    else if (daysUntilDeadline <= 365) score += 1;
    
    return score;
  }
  
  // Title matches are most important
  if (grant.title.toLowerCase().includes(searchLower)) {
    score += 10;
    if (grant.title.toLowerCase().startsWith(searchLower)) score += 5;
  }
  
  // Organization matches
  if (grant.organization.toLowerCase().includes(searchLower)) {
    score += 5;
  }
  
  // Tag matches
  const tagMatches = grant.tags.filter(tag => tag.toLowerCase().includes(searchLower)).length;
  score += tagMatches * 3;
  
  // Description matches (less weight)
  if (grant.description.toLowerCase().includes(searchLower)) {
    score += 2;
  }
  
  return score;
};

export const sortGrants = (grants: Grant[], sortBy: SortOption, searchTerm: string = ""): Grant[] => {
  if (sortBy === "default") {
    return grants;
  }
  
  return [...grants].sort((a, b) => {
    switch (sortBy) {
      case "deadline-asc":
        const dateA = parseDeadline(a.deadline);
        const dateB = parseDeadline(b.deadline);
        return dateA.getTime() - dateB.getTime(); // Earliest deadline first
      
      case "deadline-desc":
        const dateA2 = parseDeadline(a.deadline);
        const dateB2 = parseDeadline(b.deadline);
        return dateB2.getTime() - dateA2.getTime(); // Latest deadline first
      
      case "amount-desc":
        const amountA = parseFundingAmount(a.fundingAmount);
        const amountB = parseFundingAmount(b.fundingAmount);
        return amountB - amountA; // Highest funding first
      
      case "amount-asc":
        const amountA2 = parseFundingAmount(a.fundingAmount);
        const amountB2 = parseFundingAmount(b.fundingAmount);
        return amountA2 - amountB2; // Lowest funding first
      
      case "created-desc":
        // For now, sort by grant ID as a proxy for creation date
        // In a real app, you'd have a proper created_at field
        return b.id.localeCompare(a.id);
      
      case "relevance":
        const scoreA = calculateRelevanceScore(a, searchTerm);
        const scoreB = calculateRelevanceScore(b, searchTerm);
        return scoreB - scoreA; // Highest relevance score first
      
      default:
        return 0;
    }
  });
};
