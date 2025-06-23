
import { Grant } from '@/types/grant';

// Levenshtein distance for fuzzy matching
export const calculateLevenshteinDistance = (str1: string, str2: string): number => {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,     // insertion
        matrix[j - 1][i] + 1,     // deletion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  
  return matrix[str2.length][str1.length];
};

// Calculate similarity score (0-1, where 1 is exact match)
export const calculateSimilarity = (str1: string, str2: string): number => {
  if (str1 === str2) return 1;
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 1;
  const distance = calculateLevenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  return 1 - distance / maxLength;
};

// Normalize text for better matching
export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s]/g, ' ')        // Replace punctuation with spaces
    .replace(/\s+/g, ' ')            // Normalize whitespace
    .trim();
};

// Extract searchable keywords from text
export const extractKeywords = (text: string): string[] => {
  const normalized = normalizeText(text);
  return normalized
    .split(' ')
    .filter(word => word.length > 2) // Filter out very short words
    .slice(0, 20); // Limit to first 20 keywords for performance
};

// Calculate comprehensive relevance score
export const calculateRelevanceScore = (grant: Grant, searchTerm: string): number => {
  if (!searchTerm.trim()) return 0;
  
  const normalizedSearch = normalizeText(searchTerm);
  const searchWords = normalizedSearch.split(' ').filter(word => word.length > 0);
  
  let totalScore = 0;
  let maxPossibleScore = 0;
  
  // Title matching (highest weight)
  const titleScore = calculateFieldScore(grant.title, searchWords, 10);
  totalScore += titleScore;
  maxPossibleScore += 10;
  
  // Organization matching
  const orgScore = calculateFieldScore(grant.organization, searchWords, 7);
  totalScore += orgScore;
  maxPossibleScore += 7;
  
  // Tags matching
  const tagsText = grant.tags.join(' ');
  const tagsScore = calculateFieldScore(tagsText, searchWords, 8);
  totalScore += tagsScore;
  maxPossibleScore += 8;
  
  // Description matching (lower weight)
  const descScore = calculateFieldScore(grant.description, searchWords, 3);
  totalScore += descScore;
  maxPossibleScore += 3;
  
  // Qualifications matching
  const qualScore = calculateFieldScore(grant.qualifications, searchWords, 2);
  totalScore += qualScore;
  maxPossibleScore += 2;
  
  return maxPossibleScore > 0 ? totalScore / maxPossibleScore : 0;
};

// Calculate score for a specific field
const calculateFieldScore = (fieldText: string, searchWords: string[], weight: number): number => {
  if (!fieldText) return 0;
  
  const normalizedField = normalizeText(fieldText);
  const fieldWords = normalizedField.split(' ');
  
  let fieldScore = 0;
  
  searchWords.forEach(searchWord => {
    let bestMatchScore = 0;
    
    // Check for exact matches first
    if (normalizedField.includes(searchWord)) {
      bestMatchScore = 1;
    } else {
      // Check for fuzzy matches
      fieldWords.forEach(fieldWord => {
        const similarity = calculateSimilarity(searchWord, fieldWord);
        if (similarity > 0.7) { // Threshold for fuzzy matching
          bestMatchScore = Math.max(bestMatchScore, similarity * 0.8); // Slightly penalize fuzzy matches
        }
      });
    }
    
    fieldScore += bestMatchScore;
  });
  
  return (fieldScore / searchWords.length) * weight;
};

// Generate search suggestions based on current grants
export const generateSearchSuggestions = (grants: Grant[], searchTerm: string): string[] => {
  if (!searchTerm || searchTerm.length < 2) return [];
  
  const normalizedSearch = normalizeText(searchTerm);
  const suggestions = new Set<string>();
  
  grants.forEach(grant => {
    // Check title words
    const titleWords = extractKeywords(grant.title);
    titleWords.forEach(word => {
      if (word.startsWith(normalizedSearch) && word !== normalizedSearch) {
        suggestions.add(word);
      }
    });
    
    // Check organization
    const orgWords = extractKeywords(grant.organization);
    orgWords.forEach(word => {
      if (word.startsWith(normalizedSearch) && word !== normalizedSearch) {
        suggestions.add(word);
      }
    });
    
    // Check tags
    grant.tags.forEach(tag => {
      const normalizedTag = normalizeText(tag);
      if (normalizedTag.startsWith(normalizedSearch) && normalizedTag !== normalizedSearch) {
        suggestions.add(normalizedTag);
      }
    });
  });
  
  return Array.from(suggestions).slice(0, 5); // Limit to 5 suggestions
};
