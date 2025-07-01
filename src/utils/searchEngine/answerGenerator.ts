
import { SearchResult, SearchSummary, Citation, ResultCluster, EnhancedGrantResult } from './types';

export class AnswerGenerator {
  generateSearchResult(results: EnhancedGrantResult[], query: string): SearchResult {
    console.log('📝 Generating search result for:', query);
    
    const summary = this.generateSummary(results, query);
    const suggestions = this.generateSuggestions(results, query);
    const clusters = this.clusterResults(results);
    
    return {
      items: results,
      summary: {
        ...summary,
        clusters
      },
      suggestions,
      confidence: this.calculateOverallConfidence(results),
      sources: this.extractSources(results),
      processingTime: Date.now() // Would be actual processing time
    };
  }

  private generateSummary(results: EnhancedGrantResult[], query: string): SearchSummary {
    const keyFindings: string[] = [];
    const citations: Citation[] = [];
    
    if (results.length === 0) {
      return {
        totalResults: 0,
        answerText: `No grants found matching "${query}". Try broader search terms or check for typos.`,
        keyFindings: ['No matching results found'],
        clusters: [],
        citations: []
      };
    }
    
    // Generate key findings
    const topResults = results.slice(0, 3);
    keyFindings.push(`Found ${results.length} relevant grants`);
    
    // Analyze funding amounts
    const amounts = results
      .map(r => this.extractAmount(r.grant.fundingAmount))
      .filter(a => a > 0);
    
    if (amounts.length > 0) {
      const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      const maxAmount = Math.max(...amounts);
      keyFindings.push(`Average funding: ${this.formatAmount(avgAmount)}, Max: ${this.formatAmount(maxAmount)}`);
    }
    
    // Analyze organizations
    const organizations = [...new Set(results.map(r => r.grant.organization))];
    if (organizations.length > 1) {
      keyFindings.push(`${organizations.length} different funding organizations represented`);
    }
    
    // Generate answer text
    let answerText = `Found ${results.length} grants matching your search. `;
    if (topResults.length > 0) {
      answerText += `Top matches include "${topResults[0].grant.title}" from ${topResults[0].grant.organization}`;
      if (topResults.length > 1) {
        answerText += ` and "${topResults[1].grant.title}"`;
      }
      answerText += '.';
    }
    
    // Generate citations
    for (let i = 0; i < Math.min(3, results.length); i++) {
      const result = results[i];
      citations.push({
        text: result.grant.title || '',
        source: result.grant.organization || '',
        confidence: result.confidence
      });
    }
    
    return {
      totalResults: results.length,
      answerText,
      keyFindings,
      clusters: [],
      citations
    };
  }

  private clusterResults(results: EnhancedGrantResult[]): ResultCluster[] {
    const clusters: ResultCluster[] = [];
    
    // Cluster by organization
    const orgGroups = new Map<string, string[]>();
    results.forEach(result => {
      const org = result.grant.organization || 'Unknown';
      if (!orgGroups.has(org)) {
        orgGroups.set(org, []);
      }
      orgGroups.get(org)!.push(result.grant.id);
    });
    
    // Only include organizations with multiple grants
    for (const [org, ids] of orgGroups) {
      if (ids.length > 1) {
        clusters.push({
          label: org,
          items: ids,
          count: ids.length
        });
      }
    }
    
    // Cluster by funding amount ranges
    const smallGrants = results.filter(r => this.extractAmount(r.grant.fundingAmount) < 500000);
    const mediumGrants = results.filter(r => {
      const amount = this.extractAmount(r.grant.fundingAmount);
      return amount >= 500000 && amount < 5000000;
    });
    const largeGrants = results.filter(r => this.extractAmount(r.grant.fundingAmount) >= 5000000);
    
    if (smallGrants.length > 0) {
      clusters.push({
        label: 'Small grants (<500k SEK)',
        items: smallGrants.map(g => g.grant.id),
        count: smallGrants.length
      });
    }
    
    if (mediumGrants.length > 0) {
      clusters.push({
        label: 'Medium grants (500k-5M SEK)',
        items: mediumGrants.map(g => g.grant.id),
        count: mediumGrants.length
      });
    }
    
    if (largeGrants.length > 0) {
      clusters.push({
        label: 'Large grants (>5M SEK)',
        items: largeGrants.map(g => g.grant.id),
        count: largeGrants.length
      });
    }
    
    return clusters;
  }

  private generateSuggestions(results: EnhancedGrantResult[], query: string) {
    const suggestions: any[] = [];
    
    // Suggest refinements if too many results
    if (results.length > 20) {
      suggestions.push({
        type: 'refinement',
        query: query + ' 2024',
        reasoning: 'Add year to narrow down results',
        confidence: 0.8
      });
    }
    
    // Suggest expansion if too few results
    if (results.length < 3) {
      suggestions.push({
        type: 'expansion',
        query: this.expandQuery(query),
        reasoning: 'Try broader search terms',
        confidence: 0.7
      });
    }
    
    // Suggest related queries based on common terms in results
    const commonTerms = this.extractCommonTerms(results);
    for (const term of commonTerms.slice(0, 2)) {
      suggestions.push({
        type: 'related',
        query: term,
        reasoning: `Many results mention "${term}"`,
        confidence: 0.6
      });
    }
    
    return suggestions;
  }

  private expandQuery(query: string): string {
    // Simple query expansion - in practice, use synonyms/thesaurus
    const expansions = [
      ['AI', 'artificial intelligence technology innovation'],
      ['startup', 'entrepreneur business innovation'],
      ['research', 'development innovation study'],
      ['green', 'sustainability environment climate']
    ];
    
    let expanded = query;
    for (const [term, expansion] of expansions) {
      if (query.toLowerCase().includes(term.toLowerCase())) {
        expanded = expansion;
        break;
      }
    }
    
    return expanded;
  }

  private extractCommonTerms(results: EnhancedGrantResult[]): string[] {
    const termCounts = new Map<string, number>();
    
    results.forEach(result => {
      const text = `${result.grant.title} ${result.grant.description}`.toLowerCase();
      const words = text.match(/\b\w{4,}\b/g) || [];
      
      words.forEach(word => {
        termCounts.set(word, (termCounts.get(word) || 0) + 1);
      });
    });
    
    return Array.from(termCounts.entries())
      .filter(([term, count]) => count > 1 && term.length > 3)
      .sort((a, b) => b[1] - a[1])
      .map(([term]) => term)
      .slice(0, 5);
  }

  private calculateOverallConfidence(results: EnhancedGrantResult[]): number {
    if (results.length === 0) return 0;
    return results.reduce((sum, r) => sum + r.confidence, 0) / results.length;
  }

  private extractSources(results: EnhancedGrantResult[]): string[] {
    return [...new Set(results.map(r => r.grant.organization))].filter(Boolean);
  }

  private extractAmount(fundingAmount: string): number {
    if (!fundingAmount) return 0;
    
    const match = fundingAmount.match(/(\d+(?:[.,]\d+)?)\s*([kmb]?)\s*sek/i);
    if (!match) return 0;
    
    let amount = parseFloat(match[1].replace(',', '.'));
    const multiplier = match[2]?.toLowerCase();
    
    if (multiplier === 'k') amount *= 1000;
    else if (multiplier === 'm') amount *= 1000000;
    else if (multiplier === 'b') amount *= 1000000000;
    
    return amount;
  }

  private formatAmount(amount: number): string {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M SEK`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}k SEK`;
    }
    return `${amount} SEK`;
  }
}
