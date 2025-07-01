
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

interface GrantCandidate {
  id: string;
  title: string;
  subtitle: string;
  organisation: string;
  description: string;
  keywords: string[];
  industry_sectors: string[];
  eligibility: string;
  geographic_scope: string;
  min_grant_per_project: number;
  max_grant_per_project: number;
  application_opening_date: string;
  application_closing_date: string;
}

const formatCandidatesForPrompt = (candidates: GrantCandidate[]): string => {
  return candidates.map((candidate, index) => `
[${index + 1}] id:${candidate.id}
Title: ${candidate.title || 'N/A'}
Subtitle: ${candidate.subtitle || 'N/A'}
Organisation: ${candidate.organisation || 'N/A'}
Description: ${candidate.description || 'N/A'}
Keywords: ${Array.isArray(candidate.keywords) ? candidate.keywords.join(', ') : 'N/A'}
Industry sectors: ${Array.isArray(candidate.industry_sectors) ? candidate.industry_sectors.join(', ') : 'N/A'}
Eligibility: ${candidate.eligibility || 'N/A'}
Geographic scope: ${candidate.geographic_scope || 'N/A'}
Funding range: ${candidate.min_grant_per_project || 'N/A'}–${candidate.max_grant_per_project || 'N/A'}
Application window: ${candidate.application_opening_date || 'N/A'} → ${candidate.application_closing_date || 'N/A'}
`).join('\n');
};

const buildPrompt = (userInput: string, candidates: GrantCandidate[]): string => {
  const candidatesText = formatCandidatesForPrompt(candidates);
  
  return `You are an expert Swedish/English grants-matching engine.
Your task is to map one arbitrary user funding request—ranging from a single
sentence to a full text document—to the most relevant grant calls in our
database **grant_call_details**.

WORKFLOW (follow exactly):

1.  **If the user input exceeds 3 000 characters**  
    • Summarise it in ≤ 200 words that preserve research topic, sector,
      budget, geography, and applicant type.  
    • Use that summary for all later steps while retaining nuance from the
      full text.

2.  **For each candidate grant call** (already filtered to the 10 highest
    cosine-similarity matches via pre-computed embeddings):  
    • Read *all* metadata fields: *title, subtitle, description, keywords,
      industry sectors, eligibility rules, geographic scope, funding range,
      application window.*  
    • Judge how well the call satisfies the user on **five axes**  
      *(topic, sector, geography, eligibility, funding).*  
    • Collapse your judgement into a single integer **relevance score 1-10**
      using this rubric:  
        10 – Perfect fit on every axis  
        7-9 – Good fit with minor caveats  
        4-6 – Partially relevant; user may still care  
        1-3 – Essentially irrelevant

3.  **Output** *only* a valid JSON object—nothing else:
    \`\`\`json
    {
      "scores": {
        "<grant_id>": <1-10>,
        …
      }
    }
    \`\`\`
    • Every candidate must receive a score.  
    • Do **not** include commentary, explanations, or extra keys.

USER:
USER INPUT:
"""
${userInput}
"""

CANDIDATES:
${candidatesText}`;
};

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
      return new Response(JSON.stringify({ 
        rankedGrants: [],
        explanation: 'No grants found in database'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('📊 Processing grants:', grants.length);

    // Build the structured prompt
    const prompt = buildPrompt(query, grants);

    console.log('🤖 Sending request to OpenAI...');

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
            content: 'You are an expert grants matching assistant. Always respond with valid JSON only, following the exact format specified.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiData = await response.json();
    const aiResponse = aiData.choices[0].message.content;

    console.log('🤖 OpenAI response received');

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      // Fallback: return grants with neutral scoring
      parsedResponse = {
        scores: grants.reduce((acc: any, grant: any) => {
          acc[grant.id] = 5;
          return acc;
        }, {})
      };
    }

    // Convert scores to rankedGrants format expected by frontend
    const rankedGrants = Object.entries(parsedResponse.scores).map(([grantId, score]) => ({
      grantId,
      relevanceScore: (score as number) / 10, // Convert 1-10 to 0-1 scale
      matchingReasons: [`AI relevance score: ${score}/10`]
    }));

    // Sort by relevance score descending
    rankedGrants.sort((a, b) => b.relevanceScore - a.relevanceScore);

    console.log('✅ Grants matching completed successfully');
    return new Response(JSON.stringify({
      rankedGrants,
      explanation: `Matched ${rankedGrants.length} grants using structured scoring system`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in grants-matching-engine function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      rankedGrants: [],
      explanation: 'Matching temporarily unavailable'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
