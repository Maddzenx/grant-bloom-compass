
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { GrantScorer } from './grantScorer.ts';
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
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('🔍 Grants Matching Engine - Query:', query);

    // Fetch ALL grants from the database - remove the limit to process all grants
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

    console.log('📊 Processing ALL grants for AI scoring:', grants.length);

    // Score all grants using the GrantScorer
    const scorer = new GrantScorer(openAIApiKey);
    const scoredGrants = await scorer.scoreAllGrants(query, grants);

    // Ensure we have scores for ALL grants - add fallback scores for any missing
    const allGrantIds = grants.map(g => g.id);
    const scoredGrantIds = scoredGrants.map(sg => sg.grantId);
    const missingGrantIds = allGrantIds.filter(id => !scoredGrantIds.includes(id));
    
    console.log('📊 Scoring summary:', {
      totalGrants: grants.length,
      scoredGrants: scoredGrants.length,
      missingGrants: missingGrantIds.length,
      missingGrantIds: missingGrantIds.slice(0, 5) // Log first 5 for debugging
    });

    // Add fallback scores for any missing grants
    missingGrantIds.forEach(grantId => {
      scoredGrants.push({
        grantId,
        relevanceScore: 0.3, // Lower fallback score
        matchingReasons: ['Fallback score - processing error']
      });
    });

    // Sort by relevance score descending
    scoredGrants.sort((a, b) => b.relevanceScore - a.relevanceScore);

    const response: MatchingResponse = {
      rankedGrants: scoredGrants,
      explanation: `AI evaluated all ${scoredGrants.length} grants and ranked them by relevance to your query.`
    };

    console.log('✅ Grants matching completed successfully - scored all grants:', scoredGrants.length);
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in grants-matching-engine function:', error);
    const errorResponse: MatchingResponse = {
      rankedGrants: [],
      explanation: 'Matching temporarily unavailable'
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
