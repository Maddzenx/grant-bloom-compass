
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

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

    console.log('🔍 AI Grant Search - Query:', query);

    // Fetch ALL grants from the database
    const { data: grants, error: grantsError } = await supabase
      .from('grant_call_details')
      .select('*');

    if (grantsError) {
      throw new Error(`Failed to fetch grants: ${grantsError.message}`);
    }

    if (!grants || grants.length === 0) {
      return new Response(JSON.stringify({ 
        rankedGrants: [],
        explanation: 'No grants found in database'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('📊 Processing ALL grants for AI scoring:', grants.length);

    // Score ALL grants individually for better control and accuracy
    const scoredGrants = [];
    
    for (const grant of grants) {
      try {
        const grantData = {
          id: grant.id,
          title: grant.title || 'N/A',
          organisation: grant.organisation || 'N/A',
          description: grant.description || 'N/A',
          subtitle: grant.subtitle || 'N/A',
          eligibility: grant.eligibility || 'N/A',
          keywords: Array.isArray(grant.keywords) ? grant.keywords.join(', ') : 'N/A',
          industry_sectors: Array.isArray(grant.industry_sectors) ? grant.industry_sectors.join(', ') : 'N/A',
          eligible_organisations: Array.isArray(grant.eligible_organisations) ? grant.eligible_organisations.join(', ') : 'N/A',
          max_grant_per_project: grant.max_grant_per_project || 'N/A',
          min_grant_per_project: grant.min_grant_per_project || 'N/A',
          application_closing_date: grant.application_closing_date || 'N/A',
          evaluation_criteria: grant.evaluation_criteria || 'N/A'
        };

        const prompt = `You are an expert Swedish grant matching system. Score how well this grant matches the user's query on a scale of 0-100.

User Query: "${query}"

Grant Details:
Title: ${grantData.title}
Organisation: ${grantData.organisation}
Description: ${grantData.description}
Subtitle: ${grantData.subtitle}
Eligibility: ${grantData.eligibility}
Keywords: ${grantData.keywords}
Industry Sectors: ${grantData.industry_sectors}
Eligible Organisations: ${grantData.eligible_organisations}
Funding Range: ${grantData.min_grant_per_project} - ${grantData.max_grant_per_project}
Closing Date: ${grantData.application_closing_date}
Evaluation Criteria: ${grantData.evaluation_criteria}

Consider:
- Relevance to user's project/need
- Eligibility match
- Industry/sector alignment
- Funding purpose match
- Keywords relevance

Return ONLY a number between 0-100. Higher scores for better matches.`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { 
                role: 'system', 
                content: 'You are an expert grant matching assistant. Always respond with only a number between 0-100.' 
              },
              { role: 'user', content: prompt }
            ],
            temperature: 0.1,
            max_tokens: 10,
          }),
        });

        if (!response.ok) {
          console.error(`OpenAI API error for grant ${grant.id}:`, response.status);
          // Use fallback score for failed requests
          scoredGrants.push({
            grantId: grant.id,
            relevanceScore: 0.5,
            matchingReasons: ['API error - fallback score applied']
          });
          continue;
        }

        const aiData = await response.json();
        const scoreText = aiData.choices[0].message.content.trim();
        
        // Parse the score
        let score = 50; // Default fallback
        try {
          const parsedScore = parseInt(scoreText);
          if (!isNaN(parsedScore) && parsedScore >= 0 && parsedScore <= 100) {
            score = parsedScore;
          }
        } catch (parseError) {
          console.error(`Failed to parse score for grant ${grant.id}:`, scoreText);
        }

        scoredGrants.push({
          grantId: grant.id,
          relevanceScore: score / 100, // Convert to 0-1 scale for frontend compatibility
          matchingReasons: [`AI match score: ${score}/100`]
        });

        console.log(`✅ Scored grant ${grant.id}: ${score}/100`);

      } catch (error) {
        console.error(`Error scoring grant ${grant.id}:`, error);
        // Add fallback score for failed grants
        scoredGrants.push({
          grantId: grant.id,
          relevanceScore: 0.5,
          matchingReasons: ['Scoring error - fallback score applied']
        });
      }
    }

    // Sort by relevance score (highest first)
    scoredGrants.sort((a, b) => b.relevanceScore - a.relevanceScore);

    const response = {
      rankedGrants: scoredGrants,
      explanation: `AI evaluated all ${scoredGrants.length} grants and ranked them by relevance to your query.`
    };

    console.log('✅ AI search completed successfully - scored all grants');
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-grant-search function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      rankedGrants: [],
      explanation: 'Search temporarily unavailable'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
