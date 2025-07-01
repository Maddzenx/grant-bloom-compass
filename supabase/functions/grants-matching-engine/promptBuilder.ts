
import { GrantCandidate } from './types.ts';

export const buildPrompt = (userInput: string, grant: GrantCandidate): string => {
  return `You are a Swedish/English grant matching expert. Score how well this grant matches the user's project/need on a scale of 0-100.

Consider:
- Relevance to the user's project description
- Eligibility match for their organization type  
- Focus area alignment
- Funding purpose match

Return ONLY a number between 0-100. Higher scores for better matches.

USER PROJECT/NEED:
${userInput}

GRANT DETAILS:
Title: ${grant.title || 'N/A'}
Organisation: ${grant.organisation || 'N/A'}
Description: ${grant.description || 'N/A'}
Keywords: ${Array.isArray(grant.keywords) ? grant.keywords.join(', ') : 'N/A'}
Industry sectors: ${Array.isArray(grant.industry_sectors) ? grant.industry_sectors.join(', ') : 'N/A'}
Eligibility: ${grant.eligibility || 'N/A'}
Geographic scope: ${grant.geographic_scope || 'N/A'}
Funding range: ${grant.min_grant_per_project || 'N/A'}–${grant.max_grant_per_project || 'N/A'}`;
};
