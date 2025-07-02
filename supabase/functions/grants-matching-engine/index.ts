
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { EnhancedGrantScorer } from './enhancedGrantScorer.ts';
import { MatchingResponse } from './types.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();

    if (!query || typeof query !== 'string') {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!openAIApiKey) {
      console.error('OpenAI API key not configured - using fallback matching');
    }

    console.log('🔍 Enhanced Grants Matching Engine - Query:', query);

    // Fetch ALL grants from the database
    const { data: grants, error: grantsError } = await supabase
      .from('grant_call_details')
      .select('*');

    if (grantsError) {
      throw new Error(`Failed to fetch grants: ${grantsError.message}`);
    }

    if (!grants || grants.length === 0) {
      const emptyResponse: MatchingResponse = {
        rankedGrants: [],
        explanation: 'No grants found in database'
      };
      return new Response(JSON.stringify(emptyResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('📊 Processing grants with enhanced AI:', grants.length);

    // Use enhanced scorer with improved AI capabilities
    const scorer = new EnhancedGrantScorer(openAIApiKey || 'fallback');
    const scoredGrants = await scorer.scoreAllGrants(query, grants);

    // Ensure comprehensive coverage
    const allGrantIds = new Set(grants.map(g => g.id));
    const scoredGrantIds = new Set(scoredGrants.map(sg => sg.grantId));
    
    const missingGrants = grants.filter(g => !scoredGrantIds.has(g.id));
    if (missingGrants.length > 0) {
      console.log(`⚠️ Found ${missingGrants.length} grants without scores - adding enhanced fallback scores`);
      
      for (const grant of missingGrants) {
        const enhancedScore = await scorer.getFallbackScore(query, grant);
        scoredGrants.push({
          grantId: grant.id,
          relevanceScore: enhancedScore / 100,
          matchingReasons: [`Enhanced semantic analysis: ${enhancedScore}/100`]
        });
      }
    }

    // Final sort with enhanced ranking
    const finalSortedGrants = scoredGrants.sort((a, b) => b.relevanceScore - a.relevanceScore);

    const response: MatchingResponse = {
      rankedGrants: finalSortedGrants,
      explanation: `Enhanced AI analysis completed - analyzed ${finalSortedGrants.length} grants using contextual understanding and semantic matching`
    };

    console.log(`✅ Enhanced grants matching completed - scored all grants: ${finalSortedGrants.length}`);
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in enhanced grants-matching-engine:', error);
    const errorResponse: MatchingResponse = {
      rankedGrants: [],
      explanation: 'Enhanced matching temporarily unavailable - please try again'
    };
    return new Response(JSON.stringify({ 
      error: error.message,
      ...errorResponse
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
