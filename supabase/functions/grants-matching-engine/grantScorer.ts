
import { GrantCandidate, ScoredGrant } from './types.ts';
import { buildPrompt } from './promptBuilder.ts';

export class GrantScorer {
  private openAIApiKey: string;

  constructor(openAIApiKey: string) {
    this.openAIApiKey = openAIApiKey;
  }

  async scoreGrant(query: string, grant: GrantCandidate): Promise<ScoredGrant> {
    const prompt = buildPrompt(query, grant);
    
    console.log(`🤖 Scoring grant: ${grant.id}`);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { 
              role: 'system', 
              content: 'You are a grant matching expert. Always respond with only a number between 0-100.' 
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.1,
          max_tokens: 10,
        }),
      });

      if (!response.ok) {
        console.error(`OpenAI API error for grant ${grant.id}:`, response.status);
        return this.createFallbackScore(grant.id);
      }

      const aiData = await response.json();
      const scoreText = aiData.choices[0].message.content.trim();
      
      const score = this.parseScore(scoreText, grant.id);
      
      return {
        grantId: grant.id,
        relevanceScore: score / 100, // Convert to 0-1 scale for frontend compatibility
        matchingReasons: [`AI match score: ${score}/100`]
      };
    } catch (error) {
      console.error(`Error scoring grant ${grant.id}:`, error);
      return this.createFallbackScore(grant.id);
    }
  }

  private parseScore(scoreText: string, grantId: string): number {
    try {
      const parsedScore = parseInt(scoreText);
      if (!isNaN(parsedScore) && parsedScore >= 0 && parsedScore <= 100) {
        return parsedScore;
      }
    } catch (parseError) {
      console.error(`Failed to parse score for grant ${grantId}:`, scoreText);
    }
    return 50; // Fallback score
  }

  private createFallbackScore(grantId: string): ScoredGrant {
    return {
      grantId,
      relevanceScore: 0.5, // 50% fallback score
      matchingReasons: ['API error - fallback score applied']
    };
  }

  async scoreAllGrants(query: string, grants: GrantCandidate[]): Promise<ScoredGrant[]> {
    const scoredGrants: ScoredGrant[] = [];
    
    for (const grant of grants) {
      const scoredGrant = await this.scoreGrant(query, grant);
      scoredGrants.push(scoredGrant);
    }

    // Sort by relevance score descending
    return scoredGrants.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }
}
