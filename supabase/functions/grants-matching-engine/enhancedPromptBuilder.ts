
import { GrantCandidate } from './types.ts';

export const buildEnhancedPrompt = (userInput: string, grant: GrantCandidate): string => {
  return `You are an expert grant matching AI with advanced contextual understanding. Analyze how well this grant matches the user's need.

IMPORTANT CAPABILITIES:
- Understand context and intent from unstructured text
- Interpret typos, grammatical errors, and informal language
- Perform semantic matching beyond simple keyword overlap
- Handle mixed Swedish/English queries
- Recognize business needs and funding purposes
- Understand different organizational types and their needs

USER QUERY (analyze for intent, context, and needs):
"${userInput}"

GRANT TO EVALUATE:
Title: ${grant.title || 'N/A'}
Organization: ${grant.organisation || 'N/A'}
Description: ${grant.description || 'N/A'}
Subtitle: ${grant.subtitle || 'N/A'}
Eligibility: ${grant.eligibility || 'N/A'}
Keywords: ${Array.isArray(grant.keywords) ? grant.keywords.join(', ') : 'N/A'}
Industry Sectors: ${Array.isArray(grant.industry_sectors) ? grant.industry_sectors.join(', ') : 'N/A'}
Eligible Organizations: ${Array.isArray(grant.eligible_organisations) ? grant.eligible_organisations.join(', ') : 'N/A'}
Geographic Scope: ${grant.geographic_scope || 'N/A'}
Funding Range: ${grant.min_funding_per_project || 'N/A'}–${grant.max_funding_per_project || 'N/A'} ${grant.currency || 'SEK'}
Application Process: ${grant.application_process || 'N/A'}
Evaluation Criteria: ${grant.evaluation_criteria || 'N/A'}

ANALYSIS FRAMEWORK:
1. INTENT MATCHING: Does the grant's purpose align with what the user is trying to achieve?
2. CONTEXTUAL RELEVANCE: Does the overall context and domain match the user's needs?
3. ELIGIBILITY ALIGNMENT: Can the user realistically qualify for this grant?
4. SEMANTIC SIMILARITY: Are the concepts and themes semantically related?
5. PRACTICAL SUITABILITY: Would this grant practically help the user achieve their goals?

Consider these factors with equal weight:
- Semantic similarity and thematic overlap
- Practical applicability and usefulness
- Eligibility requirements and constraints
- Funding amount appropriateness
- Timeline and geographic compatibility
- Organizational type matching

Handle these query types intelligently:
- Informal descriptions: "I need money for my startup idea"
- Specific technical needs: "AI research funding for healthcare applications"
- Mixed languages: "Behöver bidrag för innovation inom renewable energy"
- Typos and errors: "loking for funds to develope mobile app"
- Broad requests: "Funding for small business growth"
- Industry-specific: "Sustainability grants for manufacturing companies"

SCORING GUIDELINES:
- 90-100: Perfect match - user's needs directly align with grant purpose and eligibility
- 80-89: Excellent match - strong alignment with minor gaps
- 70-79: Good match - clear relevance with some limitations
- 60-69: Moderate match - some relevance but significant gaps
- 50-59: Weak match - limited relevance or major barriers
- 40-49: Poor match - minimal relevance or incompatibility
- 30-39: Very poor match - little to no relevance
- 0-29: No match - completely irrelevant or impossible to qualify

Return ONLY a number between 0-100.`;
};
