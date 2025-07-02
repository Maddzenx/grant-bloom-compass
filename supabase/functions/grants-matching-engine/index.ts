
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
      console.error('OpenAI API key not configured');
      const errorResponse: MatchingResponse = {
        rankedGrants: [],
        explanation: 'AI search failed - please try again'
      };
      return new Response(JSON.stringify(errorResponse), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('🔍 AI Grants Matching Engine - Query:', query);

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

    console.log('📊 Processing grants with AI:', grants.length);

    // Use AI scorer for all grants
    const scorer = new EnhancedGrantScorer(openAIApiKey);
    const scoredGrants = await scorer.scoreAllGrants(query, grants);

    // Sort by relevance score
    const finalSortedGrants = scoredGrants.sort((a, b) => b.relevanceScore - a.relevanceScore);

    const response: MatchingResponse = {
      rankedGrants: finalSortedGrants,
      explanation: `AI analysis completed - analyzed ${finalSortedGrants.length} grants using contextual understanding and semantic matching`
    };

    console.log(`✅ AI grants matching completed - scored grants: ${finalSortedGrants.length}`);
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in grants-matching-engine:', error);
    const errorResponse: MatchingResponse = {
      rankedGrants: [],
      explanation: 'AI search failed - please try again'
    };
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
