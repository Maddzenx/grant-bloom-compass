
import { SearchQuery, SearchToken, QueryIntent, DetectedEntity } from './types';

export class QueryProcessor {
  private commonTypos = new Map([
    ['searhc', 'search'],
    ['gorvernmnt', 'government'],
    ['fundaing', 'funding'],
    ['goverment', 'government'],
    ['bussiness', 'business'],
    ['recieve', 'receive'],
    ['seperate', 'separate'],
    ['occured', 'occurred']
  ]);

  private domainSynonyms = new Map([
    ['ai', ['artificial intelligence', 'machine learning', 'ML', 'AI']],
    ['sustainability', ['green', 'environmental', 'climate', 'renewable']],
    ['research', ['R&D', 'development', 'innovation', 'study']],
    ['startup', ['entrepreneur', 'SME', 'small business', 'new company']]
  ]);

  private currencies = ['SEK', 'EUR', 'USD', 'kronor', 'euro', 'dollar'];
  private dateKeywords = ['before', 'after', 'until', 'by', 'from', 'mellan', 'före', 'efter'];

  async processQuery(query: string): Promise<SearchQuery> {
    console.log('🔍 Processing query:', query);

    const detectedLanguage = this.detectLanguage(query);
    const correctedQuery = this.correctTypos(query);
    const tokens = this.tokenize(correctedQuery || query);
    const intent = this.extractIntent(tokens, correctedQuery || query);
    const filters = this.extractFilters(tokens);

    const processedQuery: SearchQuery = {
      originalQuery: query,
      correctedQuery: correctedQuery !== query ? correctedQuery : undefined,
      detectedLanguage,
      tokens,
      intent,
      filters,
      confidence: this.calculateQueryConfidence(tokens, intent)
    };

    console.log('✅ Processed query:', processedQuery);
    return processedQuery;
  }

  private detectLanguage(query: string): string {
    // Simple language detection based on common words
    const swedishWords = ['bidrag', 'stöd', 'ansökan', 'finansiering', 'utveckling', 'forskning'];
    const englishWords = ['grant', 'funding', 'support', 'application', 'research', 'development'];
    
    const lowerQuery = query.toLowerCase();
    const swedishMatches = swedishWords.filter(word => lowerQuery.includes(word)).length;
    const englishMatches = englishWords.filter(word => lowerQuery.includes(word)).length;
    
    if (swedishMatches > englishMatches) return 'sv';
    if (englishMatches > swedishMatches) return 'en';
    return 'mixed';
  }

  private correctTypos(query: string): string {
    let corrected = query;
    
    // Apply common typo corrections
    for (const [typo, correction] of this.commonTypos) {
      const regex = new RegExp(`\\b${typo}\\b`, 'gi');
      corrected = corrected.replace(regex, correction);
    }

    // Handle character transpositions (common typos)
    const words = corrected.split(' ');
    const correctedWords = words.map(word => {
      if (word.length < 4) return word;
      
      // Check for common transposition patterns
      const transpositions = [
        [word.slice(0, -2) + word.slice(-1) + word.slice(-2, -1)], // Last two chars
        [word[1] + word[0] + word.slice(2)] // First two chars
      ];
      
      // Return original if no better correction found
      return word;
    });

    return correctedWords.join(' ');
  }

  private tokenize(query: string): SearchToken[] {
    const tokens: SearchToken[] = [];
    const words = query.split(/\s+/);
    
    for (const word of words) {
      const token = this.classifyToken(word);
      tokens.push(token);
    }
    
    return tokens;
  }

  private classifyToken(word: string): SearchToken {
    const lowerWord = word.toLowerCase();
    
    // Check for amounts
    if (/^\d+[kmb]?(\s*(sek|eur|usd|kronor))?$/i.test(word)) {
      return {
        text: word,
        type: 'filter',
        language: 'numeric',
        confidence: 0.9
      };
    }
    
    // Check for dates
    if (/^\d{4}-\d{2}-\d{2}$/.test(word) || this.dateKeywords.includes(lowerWord)) {
      return {
        text: word,
        type: 'filter',
        language: 'temporal',
        confidence: 0.8
      };
    }
    
    // Check for emojis
    if (/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(word)) {
      return {
        text: word,
        type: 'emoji',
        language: 'universal',
        confidence: 1.0
      };
    }
    
    // Default to keyword
    return {
      text: word,
      type: 'keyword',
      language: this.detectWordLanguage(word),
      confidence: 0.7
    };
  }

  private detectWordLanguage(word: string): string {
    // Simple heuristic based on character patterns
    const swedishChars = /[åäöÅÄÖ]/;
    if (swedishChars.test(word)) return 'sv';
    return 'en';
  }

  private extractIntent(tokens: SearchToken[], query: string): QueryIntent {
    const lowerQuery = query.toLowerCase();
    
    // Detect question patterns
    const questionWords = ['what', 'when', 'where', 'how', 'why', 'which', 'vad', 'när', 'var', 'hur', 'varför'];
    const isQuestion = questionWords.some(qw => lowerQuery.includes(qw)) || query.includes('?');
    
    // Detect comparison patterns
    const comparisonWords = ['vs', 'versus', 'compared to', 'difference', 'better', 'skillnad', 'jämför'];
    const isComparison = comparisonWords.some(cw => lowerQuery.includes(cw));
    
    // Extract entities
    const entities = this.extractEntities(tokens, query);
    
    // Determine primary intent
    let intentType: QueryIntent['type'] = 'search';
    if (isQuestion) intentType = 'question';
    else if (isComparison) intentType = 'compare';
    else if (tokens.some(t => t.type === 'filter')) intentType = 'filter';
    
    return {
      type: intentType,
      entities,
      confidence: 0.8
    };
  }

  private extractEntities(tokens: SearchToken[], query: string): DetectedEntity[] {
    const entities: DetectedEntity[] = [];
    const lowerQuery = query.toLowerCase();
    
    // Extract organizations (simple pattern matching)
    const orgPatterns = ['vinnova', 'vetenskapsrådet', 'almi', 'tillväxtverket', 'energimyndigheten'];
    for (const org of orgPatterns) {
      if (lowerQuery.includes(org)) {
        entities.push({
          text: org,
          type: 'organization',
          normalized: org.charAt(0).toUpperCase() + org.slice(1),
          confidence: 0.9
        });
      }
    }
    
    // Extract amounts
    const amountMatches = query.match(/\d+[kmb]?\s*(sek|eur|usd|kronor)?/gi);
    if (amountMatches) {
      for (const match of amountMatches) {
        entities.push({
          text: match,
          type: 'amount',
          normalized: this.normalizeAmount(match),
          confidence: 0.8
        });
      }
    }
    
    return entities;
  }

  private normalizeAmount(amountText: string): string {
    // Convert to standard format
    const match = amountText.match(/(\d+)([kmb])?/i);
    if (!match) return amountText;
    
    const [, number, multiplier] = match;
    let value = parseInt(number);
    
    if (multiplier?.toLowerCase() === 'k') value *= 1000;
    else if (multiplier?.toLowerCase() === 'm') value *= 1000000;
    else if (multiplier?.toLowerCase() === 'b') value *= 1000000000;
    
    return `${value} SEK`;
  }

  private extractFilters(tokens: SearchToken[]) {
    // Extract date and amount filters from tokens
    return {};
  }

  private calculateQueryConfidence(tokens: SearchToken[], intent: QueryIntent): number {
    const tokenConfidences = tokens.map(t => t.confidence);
    const avgTokenConfidence = tokenConfidences.reduce((a, b) => a + b, 0) / tokenConfidences.length;
    
    return (avgTokenConfidence + intent.confidence) / 2;
  }
}
