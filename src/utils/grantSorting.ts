
import { Grant } from "@/types/grant";

export type SortOption = "deadline" | "funding" | "none";

// Parse funding amount string to number for comparison
const parseFundingAmount = (fundingAmount: string): number => {
  // Extract numbers from string like "500 000 - 2 000 000 SEK"
  const numbers = fundingAmount.match(/\d+(?:\s*\d+)*/g);
  if (!numbers) return 0;
  
  // Take the first number (minimum amount) and remove spaces
  const firstNumber = numbers[0].replace(/\s/g, '');
  return parseInt(firstNumber, 10) || 0;
};

// Parse deadline string to Date for comparison
const parseDeadline = (deadline: string): Date => {
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

export const sortGrants = (grants: Grant[], sortBy: SortOption): Grant[] => {
  if (sortBy === "none") {
    return grants;
  }
  
  return [...grants].sort((a, b) => {
    switch (sortBy) {
      case "deadline":
        const dateA = parseDeadline(a.deadline);
        const dateB = parseDeadline(b.deadline);
        return dateA.getTime() - dateB.getTime(); // Earliest deadline first
      
      case "funding":
        const amountA = parseFundingAmount(a.fundingAmount);
        const amountB = parseFundingAmount(b.fundingAmount);
        return amountB - amountA; // Highest funding first
      
      default:
        return 0;
    }
  });
};
