
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AIGrantMatch {
  grantId: string;
  relevanceScore: number;
  matchingReasons: string[];
}

export interface AISearchResult {
  rankedGrants: AIGrantMatch[];
  explanation: string;
}

export const useAIGrantSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchGrants = async (query: string): Promise<AISearchResult | null> => {
    if (!query.trim()) {
      return null;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      console.log('🤖 Starting AI grant search for query:', query);

      const { data, error } = await supabase.functions.invoke('ai-grant-search', {
        body: { query: query.trim() }
      });

      if (error) {
        console.error('❌ Supabase function error:', error);
        throw new Error(error.message);
      }

      if (!data) {
        console.error('❌ No response from AI search service');
        throw new Error('No response from AI search service');
      }

      // Check if the response indicates an API key issue
      if (data.error && data.error.includes('OpenAI API error: 401')) {
        console.error('❌ OpenAI API key not configured properly');
        setSearchError('AI search is temporarily unavailable. Please try again later.');
        return {
          rankedGrants: [],
          explanation: 'AI search temporarily unavailable - showing all grants'
        };
      }

      if (data.error) {
        console.error('❌ AI search service error:', data.error);
        throw new Error(data.error);
      }

      console.log('✅ AI search completed:', {
        rankedCount: data.rankedGrants?.length || 0,
        explanation: data.explanation
      });

      return data as AISearchResult;

    } catch (error) {
      console.error('❌ AI grant search failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'AI search failed';
      setSearchError(errorMessage);
      
      // Return empty result instead of null to allow the UI to handle gracefully
      return {
        rankedGrants: [],
        explanation: 'Search encountered an error - showing all grants'
      };
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchGrants,
    isSearching,
    searchError
  };
};
