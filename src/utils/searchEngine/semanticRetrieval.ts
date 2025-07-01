
import { Grant } from '@/types/grant';
import { SearchQuery, EnhancedGrantResult, MatchedField } from './types';

export class SemanticRetrieval {
  private domainEmbeddings = new Map([
    // Simplified semantic mapping for common domains
    ['ai', ['artificial intelligence', 'machine learning', 'neural networks', 'deep learning', 'automation']],
    ['sustainability', ['environment', 'green technology', 'renewable energy', 'climate change', 'circular economy']],
    ['healthcare', ['medical', 'pharmaceutical', 'biotechnology', 'health technology', 'life sciences']],
    ['innovation', ['research', 'development', 'technology', 'startup', 'entrepreneurship']]
  ]);

  async retrieveRelevantGrants(query: SearchQuery, grants: Grant[]): Promise<EnhancedGrantResult[]> {
    console.log('🎯 Starting semantic retrieval for:', query.originalQuery);
    
    const results: EnhancedGrantResult[] = [];
    
    for (const grant of grants) {
      const relevanceScore = this.calculateSemanticRelevance(query, grant);
      const matchedFields = this.findMatchedFields(query, grant);
      const snippet = this.generateSnippet(grant, query);
      const reasoning = this.generateReasoning(query, grant, matchedFields);
      
      if (relevanceScore > 0.1) { // Minimum threshold
        results.push({
          grant,
          relevanceScore,
          matchedFields,
          snippet,
          reasoning,
          confidence: relevanceScore
        });
      }
    }
    
    // Sort by relevance score
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    console.log(`✅ Retrieved ${results.length} relevant grants`);
    return results;
  }

  private calculateSemanticRelevance(query: SearchQuery, grant: Grant): number {
    let totalScore = 0;
    let weightSum = 0;
    
    // Title matching (highest weight)
    const titleScore = this.calculateFieldSemanticScore(query, grant.title || '');
    totalScore += titleScore * 0.4;
    weightSum += 0.4;
    
    // Description matching
    const descScore = this.calculateFieldSemanticScore(query, grant.description || '');
    totalScore += descScore * 0.3;
    weightSum += 0.3;
    
    // Organization matching
    const orgScore = this.calculateFieldSemanticScore(query, grant.organization || '');
    totalScore += orgScore * 0.2;
    weightSum += 0.2;
    
    // Tags matching
    const tagsText = Array.isArray(grant.tags) ? grant.tags.join(' ') : '';
    const tagsScore = this.calculateFieldSemanticScore(query, tagsText);
    totalScore += tagsScore * 0.1;
    weightSum += 0.1;
    
    return weightSum > 0 ? totalScore / weightSum : 0;
  }

  private calculateFieldSemanticScore(query: SearchQuery, fieldText: string): number {
    if (!fieldText) return 0;
    
    const normalizedField = fieldText.toLowerCase();
    let score = 0;
    
    // Check for exact matches from query tokens
    for (const token of query.tokens) {
      if (token.type === 'keyword') {
        const tokenText = token.corrected || token.text;
        if (normalizedField.includes(tokenText.toLowerCase())) {
          score += 1.0;
        }
      }
    }
    
    // Check for semantic matches using domain embeddings
    for (const token of query.tokens) {
      if (token.type === 'keyword') {
        const tokenText = (token.corrected || token.text).toLowerCase();
        
        for (const [domain, semanticTerms] of this.domainEmbeddings) {
          if (tokenText.includes(domain) || semanticTerms.includes(tokenText)) {
            // Check if field contains semantic matches
            const semanticMatches = semanticTerms.filter(term => 
              normalizedField.includes(term.toLowerCase())
            );
            score += semanticMatches.length * 0.7; // Lower weight for semantic matches
          }
        }
      }
    }
    
    // Apply date and amount filters
    if (query.filters.dateRange) {
      score *= this.applyDateFilter(query.filters.dateRange, fieldText);
    }
    
    if (query.filters.amountRange) {
      score *= this.applyAmountFilter(query.filters.amountRange, fieldText);
    }
    
    return Math.min(score, 1.0); // Cap at 1.0
  }

  private applyDateFilter(dateRange: any, fieldText: string): number {
    // Simplified date filtering - in a real implementation, you'd parse actual dates
    return 1.0;
  }

  private applyAmountFilter(amountRange: any, fieldText: string): number {
    // Simplified amount filtering - in a real implementation, you'd parse actual amounts
    return 1.0;
  }

  private findMatchedFields(query: SearchQuery, grant: Grant): MatchedField[] {
    const matchedFields: MatchedField[] = [];
    
    // Check each field for matches
    const fields = [
      { name: 'title', content: grant.title || '' },
      { name: 'description', content: grant.description || '' },
      { name: 'organization', content: grant.organization || '' },
      { name: 'tags', content: Array.isArray(grant.tags) ? grant.tags.join(' ') : '' }
    ];
    
    for (const field of fields) {
      const matches = this.findFieldMatches(query, field.content);
      if (matches.length > 0) {
        matchedFields.push({
          field: field.name,
          matchType: 'semantic',
          snippet: this.extractSnippet(field.content, matches[0]),
          score: matches.length
        });
      }
    }
    
    return matchedFields;
  }

  private findFieldMatches(query: SearchQuery, content: string): string[] {
    const matches: string[] = [];
    const normalizedContent = content.toLowerCase();
    
    for (const token of query.tokens) {
      if (token.type === 'keyword') {
        const searchTerm = (token.corrected || token.text).toLowerCase();
        if (normalizedContent.includes(searchTerm)) {
          matches.push(searchTerm);
        }
      }
    }
    
    return matches;
  }

  private extractSnippet(content: string, matchTerm: string, contextLength: number = 100): string {
    const index = content.toLowerCase().indexOf(matchTerm.toLowerCase());
    if (index === -1) return content.substring(0, contextLength);
    
    const start = Math.max(0, index - contextLength / 2);
    const end = Math.min(content.length, index + matchTerm.length + contextLength / 2);
    
    let snippet = content.substring(start, end);
    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet = snippet + '...';
    
    return snippet;
  }

  private generateSnippet(grant: Grant, query: SearchQuery): string {
    // Generate a relevant snippet based on the best matching field
    const description = grant.description || '';
    if (description.length <= 150) return description;
    
    // Find the best matching section
    let bestMatch = '';
    let bestScore = 0;
    
    for (const token of query.tokens) {
      if (token.type === 'keyword') {
        const searchTerm = (token.corrected || token.text).toLowerCase();
        const index = description.toLowerCase().indexOf(searchTerm);
        if (index !== -1) {
          const snippet = this.extractSnippet(description, searchTerm, 150);
          const score = (searchTerm.length / description.length) * 1000;
          if (score > bestScore) {
            bestScore = score;
            bestMatch = snippet;
          }
        }
      }
    }
    
    return bestMatch || description.substring(0, 150) + '...';
  }

  private generateReasoning(query: SearchQuery, grant: Grant, matchedFields: MatchedField[]): string[] {
    const reasoning: string[] = [];
    
    if (matchedFields.length > 0) {
      const fieldNames = matchedFields.map(f => f.field).join(', ');
      reasoning.push(`Matches found in: ${fieldNames}`);
    }
    
    if (query.correctedQuery) {
      reasoning.push(`Query auto-corrected from "${query.originalQuery}" to "${query.correctedQuery}"`);
    }
    
    if (query.intent.entities.length > 0) {
      reasoning.push(`Relevant entities detected: ${query.intent.entities.map(e => e.text).join(', ')}`);
    }
    
    return reasoning;
  }
}
