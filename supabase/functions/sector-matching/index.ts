
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const INDUSTRY_SECTORS = [
  'Digitalisering, automatisering & AI',
  'Energi, klimat & hållbar utveckling',
  'Cirkulär ekonomi & resurshantering',
  'Bioteknik, life science & medicinteknik',
  'Vård, omsorg & folkhälsa',
  'Försvar, säkerhet & cybersäkerhet',
  'Rymdteknik & satellittillämpningar',
  'Industri 4.0, tillverkning & avancerade material',
  'Råvaror, gruv- & mineralnäringar',
  'Jordbruk, skogsbruk, vattenbruk & livsmedel',
  'Hav, marin miljö & blå ekonomi',
  'Transport, mobilitet & logistik',
  'Infrastruktur, samhällsbyggnad & smarta städer',
  'Handel, turism & besöksnäring',
  'Kultur, kreativa näringar & media',
  'Utbildning, pedagogik & livslångt lärande',
  'Arbetsmarknad, integration & social innovation',
  'Ekonomi, finans & fintech',
  'Entreprenörskap, affärsutveckling & kommersialisering',
  'Forskning, FoU-samverkan & testbäddar',
  'Offentlig förvaltning, e-tjänster & govtech',
  'Data, integritet & etik',
  'Internationalisering, export & marknadsetablering',
  'Idrott, hälsa & friluftsliv',
  'Övrigt & tvärsektoriella satsningar'
];

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

    console.log('🎯 Sector matching for query:', query);

    // Fallback sector matching for common terms
    const fallbackMatching = (searchQuery: string): string[] => {
      const lowerQuery = searchQuery.toLowerCase();
      const matches: string[] = [];
      
      // Simple keyword matching for common Swedish terms
      if (lowerQuery.includes('hav') || lowerQuery.includes('marin') || lowerQuery.includes('ocean')) {
        matches.push('Hav, marin miljö & blå ekonomi');
      }
      if (lowerQuery.includes('ai') || lowerQuery.includes('digital')) {
        matches.push('Digitalisering, automatisering & AI');
      }
      if (lowerQuery.includes('energi') || lowerQuery.includes('klimat')) {
        matches.push('Energi, klimat & hållbar utveckling');
      }
      if (lowerQuery.includes('transport') || lowerQuery.includes('mobilitet')) {
        matches.push('Transport, mobilitet & logistik');
      }
      
      return matches.length > 0 ? matches : ['Övrigt & tvärsektoriella satsningar'];
    };

    if (!openAIApiKey) {
      console.log('⚠️ OpenAI API key not configured, using fallback matching');
      const fallbackSectors = fallbackMatching(query);
      return new Response(JSON.stringify({ 
        relevantSectors: fallbackSectors,
        explanation: `Found ${fallbackSectors.length} relevant sectors using keyword matching`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = `You are an expert at categorizing business needs and research queries into relevant industry sectors.

USER QUERY: "${query}"

AVAILABLE SECTORS:
${INDUSTRY_SECTORS.map((sector, index) => `${index + 1}. ${sector}`).join('\n')}

Instructions:
- Analyze the query and identify ALL potentially relevant sectors
- It's better to include too many sectors than too few
- Consider direct matches, related fields, and cross-sector applications
- Return ONLY a JSON array of sector names (exact matches from the list above)
- If uncertain, err on the side of inclusion

Example response format:
["Digitalisering, automatisering & AI", "Energi, klimat & hållbar utveckling"]`;

    try {
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
              content: 'You are an expert sector classifier. Always respond with valid JSON array of sector names.' 
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.1,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenAI API error: ${response.status} ${errorText}`);
        throw new Error('OpenAI API failed');
      }

      const aiData = await response.json();
      const sectorsText = aiData.choices[0].message.content.trim();
      
      let relevantSectors: string[] = [];
      try {
        relevantSectors = JSON.parse(sectorsText);
        
        // Validate that all returned sectors are in our list
        relevantSectors = relevantSectors.filter(sector => 
          INDUSTRY_SECTORS.includes(sector)
        );
        
        // Ensure we have at least some sectors
        if (relevantSectors.length === 0) {
          throw new Error('No valid sectors returned');
        }
        
      } catch (parseError) {
        console.error('Failed to parse AI response:', sectorsText);
        throw new Error('Failed to parse AI response');
      }

      console.log(`✅ AI sector matching completed - found ${relevantSectors.length} relevant sectors:`, relevantSectors);

      return new Response(JSON.stringify({ 
        relevantSectors,
        explanation: `AI identified ${relevantSectors.length} relevant sectors for targeted search`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (aiError) {
      console.error('AI processing failed, using fallback:', aiError);
      // Use fallback matching when AI fails
      const fallbackSectors = fallbackMatching(query);
      console.log(`🔧 Using fallback matching - found ${fallbackSectors.length} sectors:`, fallbackSectors);
      
      return new Response(JSON.stringify({ 
        relevantSectors: fallbackSectors,
        explanation: `Found ${fallbackSectors.length} relevant sectors using keyword matching (AI unavailable)`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in sector-matching:', error);
    return new Response(JSON.stringify({ 
      error: 'Sector matching failed - please try again',
      relevantSectors: ['Övrigt & tvärsektoriella satsningar']
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
