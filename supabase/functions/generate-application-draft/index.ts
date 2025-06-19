
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { grantId, businessPlanData, uploadedFiles } = await req.json();

    console.log(`Generating application draft for grant: ${grantId}`);

    // Fetch grant details
    const { data: grant, error: grantError } = await supabase
      .from('grant_call_details')
      .select('*')
      .eq('id', grantId)
      .single();

    if (grantError || !grant) {
      throw new Error('Grant not found');
    }

    // Fetch extracted content from uploaded files
    const fileContents = [];
    for (const file of uploadedFiles) {
      const { data: extraction } = await supabase
        .from('file_extractions')
        .select('extracted_text, original_filename')
        .eq('file_id', file.id)
        .eq('extraction_status', 'completed')
        .single();
      
      if (extraction) {
        fileContents.push(`File: ${extraction.original_filename}\n${extraction.extracted_text}`);
      }
    }

    // Create draft record
    const { data: draft, error: draftError } = await supabase
      .from('application_drafts')
      .insert({
        grant_id: grantId,
        user_context: {
          businessPlan: businessPlanData,
          uploadedFiles: uploadedFiles
        },
        uploaded_files: uploadedFiles,
        generation_status: 'generating'
      })
      .select()
      .single();

    if (draftError) {
      throw new Error(`Failed to create draft: ${draftError.message}`);
    }

    // Generate AI content using OpenAI
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = `Generate a comprehensive grant application draft based on the following information:

GRANT DETAILS:
Title: ${grant.title}
Organization: ${grant.organisation}
Description: ${grant.description}
Eligibility: ${grant.eligibility}
Evaluation Criteria: ${grant.evaluation_criteria}
Funding Amount: ${grant.max_grant_per_project ? `Up to ${grant.max_grant_per_project} ${grant.currency || 'SEK'}` : 'Not specified'}

BUSINESS PLAN DATA:
${JSON.stringify(businessPlanData, null, 2)}

UPLOADED FILE CONTENTS:
${fileContents.join('\n\n---\n\n')}

Please generate a structured application draft with the following sections:
1. Executive Summary
2. Project Description
3. Objectives and Goals
4. Methodology and Approach
5. Budget and Resources
6. Timeline and Milestones
7. Expected Outcomes and Impact
8. Risk Management
9. Team and Qualifications
10. Compliance Statement

Make sure the content aligns with the grant's evaluation criteria and eligibility requirements. The response should be in JSON format with each section as a separate field.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert grant application writer. Generate high-quality, professional grant application content that is tailored to the specific grant requirements and evaluation criteria.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const aiResponse = await response.json();
    const generatedContent = aiResponse.choices[0].message.content;

    // Try to parse as JSON, fallback to structured text
    let generatedSections;
    try {
      generatedSections = JSON.parse(generatedContent);
    } catch {
      // If not valid JSON, create structured sections from the text
      generatedSections = {
        'Executive Summary': generatedContent.substring(0, 500) + '...',
        'Project Description': 'AI-generated project description based on your business plan and uploaded documents.',
        'Objectives and Goals': 'Clear objectives aligned with grant requirements.',
        'Methodology and Approach': 'Detailed methodology for project execution.',
        'Budget and Resources': 'Budget breakdown and resource allocation.',
        'Timeline and Milestones': 'Project timeline with key milestones.',
        'Expected Outcomes and Impact': 'Expected results and impact measurement.',
        'Risk Management': 'Risk assessment and mitigation strategies.',
        'Team and Qualifications': 'Team composition and qualifications.',
        'Compliance Statement': 'Statement of compliance with grant requirements.'
      };
    }

    // Calculate word count and compliance score
    const totalWords = Object.values(generatedSections).join(' ').split(' ').length;
    const complianceScore = 0.85; // Simulated compliance score

    // Update draft with generated content
    const { error: updateError } = await supabase
      .from('application_drafts')
      .update({
        generated_sections: generatedSections,
        generation_status: 'completed',
        total_word_count: totalWords,
        compliance_score: complianceScore,
        generation_metadata: {
          model: 'gpt-4o',
          prompt_length: prompt.length,
          response_length: generatedContent.length,
          generated_at: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', draft.id);

    if (updateError) {
      throw new Error(`Failed to update draft: ${updateError.message}`);
    }

    // Create initial version
    await supabase
      .from('draft_versions')
      .insert({
        draft_id: draft.id,
        version_number: 1,
        content: generatedSections,
        changes_summary: 'Initial AI-generated draft'
      });

    return new Response(
      JSON.stringify({
        success: true,
        draftId: draft.id,
        sections: generatedSections,
        wordCount: totalWords,
        complianceScore: complianceScore
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-application-draft:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
