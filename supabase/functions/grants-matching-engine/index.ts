
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

    // Fetch all grants from the database
    const { data: grants, error: grantsError } = await supabase
      .from('grant_call_details')
      .select('*')
      .limit(10); // For now, limit to 10 for testing

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

    console.log('📊 Processing grants:', grants.length);

    // Score all grants using the GrantScorer
    const scorer = new GrantScorer(openAIApiKey);
    const scoredGrants = await scorer.scoreAllGrants(query, grants);

    const response: MatchingResponse = {
      rankedGrants: scoredGrants,
      explanation: `Matched ${scoredGrants.length} grants using 0-100 scoring system`
    };

    console.log('✅ Grants matching completed successfully');
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
