
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GrantMatch {
  grantId: string;
  relevanceScore: number;
  matchingReasons: string[];
}

export interface GrantsMatchingResult {
  rankedGrants: GrantMatch[];
  explanation: string;
}

export interface SectorMatchingResult {
  relevantSectors: string[];
  explanation: string;
}

export const useGrantsMatchingEngine = () => {
  const [isMatching, setIsMatching] = useState(false);
  const [matchingError, setMatchingError] = useState<string | null>(null);

  const matchGrants = async (query: string): Promise<GrantsMatchingResult | null> => {
    if (!query.trim()) {
      return null;
    }

    setIsMatching(true);
    setMatchingError(null);

    try {
      console.log('🔍 Starting two-step grants matching for query:', query);

      // Step 1: Get relevant sectors with improved error handling
      console.log('📋 Step 1: Identifying relevant sectors...');
      
      let sectorData;
      try {
        const { data, error } = await supabase.functions.invoke('sector-matching', {
          body: { query: query.trim() }
        });
        
        if (error) {
          console.error('Sector matching error:', error);
          throw new Error(`Sector matching failed: ${error.message}`);
        }
        
        sectorData = data;
      } catch (sectorError) {
        console.error('Sector matching failed, proceeding without sector filtering:', sectorError);
        // Continue with all sectors as fallback
        sectorData = {
          relevantSectors: [], // Empty array means no sector filtering
          explanation: 'Using all sectors due to sector matching failure'
        };
      }

      if (!sectorData) {
        throw new Error('No sector data received');
      }

      const relevantSectors = sectorData.relevantSectors || [];
      console.log('✅ Step 1 completed - relevant sectors:', relevantSectors);

      // Step 2: Match grants within relevant sectors (or all grants if sector matching failed)
      console.log('🎯 Step 2: Matching grants...');
      const { data: matchingData, error: matchingError } = await supabase.functions.invoke('grants-matching-engine', {
        body: { 
          query: query.trim(),
          relevantSectors: relevantSectors
        }
      });

      if (matchingError) {
        console.error('Grant matching error:', matchingError);
        throw new Error(`Grant matching failed: ${matchingError.message}`);
      }

      if (!matchingData) {
        throw new Error('No matching data received');
      }

      console.log('✅ Two-step grants matching completed:', {
        sectorsCount: relevantSectors.length,
        rankedCount: matchingData.rankedGrants?.length || 0,
        explanation: matchingData.explanation
      });

      return matchingData as GrantsMatchingResult;

    } catch (error) {
      console.error('❌ AI search failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'AI search failed - please try again';
      setMatchingError(errorMessage);
      
      // Return empty result with error message
      return {
        rankedGrants: [],
        explanation: errorMessage
      };
    } finally {
      setIsMatching(false);
    }
  };

  return {
    matchGrants,
    isMatching,
    matchingError
  };
};
