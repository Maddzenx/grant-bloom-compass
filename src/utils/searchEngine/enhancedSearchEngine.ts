
import { Grant } from '@/types/grant';
import { QueryProcessor } from './queryProcessor';
import { SemanticRetrieval } from './semanticRetrieval';
import { AnswerGenerator } from './answerGenerator';
import { SearchResult, SearchFeedback } from './types';

export class EnhancedSearchEngine {
  private queryProcessor: QueryProcessor;
  private semanticRetrieval: SemanticRetrieval;
  private answerGenerator: AnswerGenerator;
  private feedbackHistory: SearchFeedback[] = [];

  constructor() {
    this.queryProcessor = new QueryProcessor();
    this.semanticRetrieval = new SemanticRetrieval();
    this.answerGenerator = new AnswerGenerator();
  }

  async search(query: string, grants: Grant[]): Promise<SearchResult> {
    console.log('🚀 Enhanced search starting for:', query);
    const startTime = Date.now();

    try {
      // Step 1: Process and understand the query
      const processedQuery = await this.queryProcessor.processQuery(query);
      
      // Step 2: Handle typo corrections and clarifications
      if (processedQuery.correctedQuery && processedQuery.confidence < 0.6) {
        console.log('⚠️ Low confidence query, may need clarification');
      }
      
      // Step 3: Semantic retrieval
      const relevantResults = await this.semanticRetrieval.retrieveRelevantGrants(
        processedQuery, 
        grants
      );
      
      // Step 4: Generate comprehensive answer
      const searchResult = this.answerGenerator.generateSearchResult(
        relevantResults, 
        query
      );
      
      // Step 5: Add processing metadata
      searchResult.processingTime = Date.now() - startTime;
      
      console.log('✅ Enhanced search completed:', {
        query,
        resultsCount: searchResult.items.length,
        confidence: searchResult.confidence,
        processingTime: searchResult.processingTime
      });
      
      return searchResult;
      
    } catch (error) {
      console.error('❌ Enhanced search failed:', error);
      
      // Fallback to basic results
      return {
        items: grants.slice(0, 10).map(grant => ({
          grant,
          relevanceScore: 0.5,
          matchedFields: [],
          snippet: grant.description?.substring(0, 150) + '...' || '',
          reasoning: ['Fallback search due to processing error'],
          confidence: 0.3
        })),
        summary: {
          totalResults: grants.length,
          answerText: 'Search temporarily using fallback mode. Some features may be limited.',
          keyFindings: ['Fallback search active'],
          clusters: [],
          citations: []
        },
        suggestions: [],
        confidence: 0.3,
        sources: [],
        processingTime: Date.now() - startTime
      };
    }
  }

  // Handle user feedback for continuous learning
  recordFeedback(feedback: SearchFeedback): void {
    this.feedbackHistory.push(feedback);
    console.log('📊 Feedback recorded:', feedback);
    
    // In a real implementation, this would update ML models
    // For now, we just store for analysis
  }

  // Get search suggestions without performing full search
  async getSuggestions(partialQuery: string): Promise<string[]> {
    if (partialQuery.length < 2) return [];
    
    const suggestions: string[] = [];
    
    // Common grant-related suggestions
    const commonQueries = [
      'government funding Sweden',
      'startup grants 2024',
      'research funding artificial intelligence',
      'green technology grants',
      'innovation support SME',
      'Vinnova funding opportunities',
      'EU grants Sweden'
    ];
    
    // Filter suggestions that match partial query
    for (const suggestion of commonQueries) {
      if (suggestion.toLowerCase().includes(partialQuery.toLowerCase())) {
        suggestions.push(suggestion);
      }
    }
    
    return suggestions.slice(0, 5);
  }

  // Test the system with edge cases
  async testSystem(): Promise<void> {
    console.log('🧪 Testing enhanced search system...');
    
    const testQueries = [
      'searhc gorvernmnt fundaing Sweden', // Typos
      'grants closing after 1 Aug but before 1 Oct', // Date logic
      'apple funding', // Ambiguous
      'AI 🤖 grants for startups', // Emojis
      'bidrag för AI-utveckling', // Mixed language
      '', // Empty query
      'a', // Too short
      'research development innovation technology grants funding support' // Too long
    ];
    
    // In a real implementation, run these tests
    console.log('Test queries prepared:', testQueries);
  }
}

// Factory function to create and initialize the search engine
export const createEnhancedSearchEngine = (): EnhancedSearchEngine => {
  return new EnhancedSearchEngine();
};
