
import { GrantCandidate, ScoredGrant } from './types.ts';
import { buildPrompt } from './promptBuilder.ts';

export class GrantScorer {
  private openAIApiKey: string;

  constructor(openAIApiKey: string) {
    this.openAIApiKey = openAIApiKey;
  }

  async scoreGrant(query: string, grant: GrantCandidate): Promise<ScoredGrant> {
    const prompt = buildPrompt(query, grant);
    
    console.log(`🤖 Scoring grant: ${grant.id} - ${grant.title?.substring(0, 50)}...`);
    
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
        console.error(`OpenAI API error for grant ${grant.id}:`, response.status, response.statusText);
        return this.createFallbackScore(grant.id);
      }

      const aiData = await response.json();
      
      if (!aiData.choices || !aiData.choices[0] || !aiData.choices[0].message) {
        console.error(`Invalid OpenAI response for grant ${grant.id}:`, aiData);
        return this.createFallbackScore(grant.id);
      }

      const scoreText = aiData.choices[0].message.content.trim();
      const score = this.parseScore(scoreText, grant.id);
      
      console.log(`✅ Grant ${grant.id} scored: ${score}/100`);
      
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
      // Try to extract any number from the response
      const matches = scoreText.match(/\d+/);
      if (matches) {
        const parsedScore = parseInt(matches[0]);
        if (!isNaN(parsedScore) && parsedScore >= 0 && parsedScore <= 100) {
          return parsedScore;
        }
      }
      
      console.warn(`Could not parse score for grant ${grantId}: "${scoreText}"`);
    } catch (parseError) {
      console.error(`Failed to parse score for grant ${grantId}:`, scoreText, parseError);
    }
    return 40; // Default fallback score
  }

  private createFallbackScore(grantId: string): ScoredGrant {
    return {
      grantId,
      relevanceScore: 0.4, // 40% fallback score
      matchingReasons: ['Fallback score - API error or parsing issue']
    };
  }

  async scoreAllGrants(query: string, grants: GrantCandidate[]): Promise<ScoredGrant[]> {
    const scoredGrants: ScoredGrant[] = [];
    const batchSize = 5; // Process in smaller batches to avoid rate limits
    
    console.log(`🚀 Starting to score ${grants.length} grants in batches of ${batchSize}`);
    
    for (let i = 0; i < grants.length; i += batchSize) {
      const batch = grants.slice(i, i + batchSize);
      console.log(`📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(grants.length / batchSize)}`);
      
      // Process batch with Promise.all for speed but with error handling
      const batchPromises = batch.map(grant => this.scoreGrant(query, grant));
      const batchResults = await Promise.all(batchPromises);
      
      scoredGrants.push(...batchResults);
      
      // Small delay between batches to avoid rate limiting
      if (i + batchSize < grants.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`✅ Finished scoring all ${scoredGrants.length} grants`);
    
    // Sort by relevance score descending
    return scoredGrants.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }
}
