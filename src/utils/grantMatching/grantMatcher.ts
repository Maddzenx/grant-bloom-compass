
import { Grant } from '@/types/grant';
import { GRANT_MATCHING_PROMPT } from './grantMatchingPrompt';
import { GrantMatchResponse, ProjectData } from './types';

export class GrantMatcher {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async matchGrants(grants: Grant[], projectData: ProjectData): Promise<GrantMatchResponse> {
    try {
      // Prepare the grants data for the prompt
      const grantsJson = JSON.stringify(grants.map(grant => ({
        id: grant.id,
        title: grant.title,
        organization: grant.organization,
        description: grant.description,
        fundingAmount: grant.fundingAmount,
        deadline: grant.deadline,
        tags: grant.tags,
        qualifications: grant.qualifications,
        aboutGrant: grant.aboutGrant,
        whoCanApply: grant.whoCanApply
      })));

      // Prepare project description
      const projectDescription = projectData.description;
      const attachmentsText = projectData.attachments ? 
        `Attachments: ${projectData.attachments.join(', ')}` : '';

      // Build the full prompt
      const fullPrompt = GRANT_MATCHING_PROMPT
        .replace('<grants-array-in-JSON>', grantsJson)
        .replace('<free-text description>', projectDescription)
        .replace('<attachments: …>', attachmentsText);

      console.log('🔍 Sending grant matching request to OpenAI...');

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: fullPrompt
            }
          ],
          temperature: 0.1,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const matchingResult = data.choices[0].message.content;

      console.log('✅ Grant matching response received:', matchingResult);

      // Parse the JSON response
      try {
        const parsedResult: GrantMatchResponse = JSON.parse(matchingResult);
        return parsedResult;
      } catch (parseError) {
        console.error('❌ Failed to parse grant matching response:', parseError);
        // Return empty result if parsing fails
        return {
          high_match: [],
          medium_match: [],
          low_match: []
        };
      }

    } catch (error) {
      console.error('❌ Grant matching error:', error);
      throw error;
    }
  }

  // Sort grants based on matching results
  sortGrantsByRelevance(grants: Grant[], matchResponse: GrantMatchResponse): Grant[] {
    const sortedGrants: Grant[] = [];
    
    // Add high matches first
    matchResponse.high_match.forEach(match => {
      const grant = grants.find(g => g.id === match.grant_id);
      if (grant) sortedGrants.push(grant);
    });

    // Add medium matches
    matchResponse.medium_match.forEach(match => {
      const grant = grants.find(g => g.id === match.grant_id);
      if (grant) sortedGrants.push(grant);
    });

    // Add low matches
    matchResponse.low_match.forEach(match => {
      const grant = grants.find(g => g.id === match.grant_id);
      if (grant) sortedGrants.push(grant);
    });

    // Add any remaining grants that weren't matched
    grants.forEach(grant => {
      if (!sortedGrants.find(g => g.id === grant.id)) {
        sortedGrants.push(grant);
      }
    });

    return sortedGrants;
  }
}
