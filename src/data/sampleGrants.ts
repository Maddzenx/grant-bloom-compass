
import { supabase } from '@/integrations/supabase/client';

export const insertSampleGrantsData = async () => {
  const { data: insertData, error: insertError } = await supabase
    .from('grant_call_details')
    .insert([
      {
        title: 'Innovation Grant for SMEs',
        organisation: 'Vinnova',
        description: 'This grant supports small and medium enterprises in developing innovative solutions for sustainable technology.',
        subtitle: 'Supporting innovation in Swedish SMEs',
        eligibility: 'Small and medium enterprises registered in Sweden with less than 250 employees',
        application_closing_date: '2024-12-31',
        application_opening_date: '2024-07-01',
        max_funding_per_project: 5000000,
        min_funding_per_project: 500000,
        total_funding_per_call: 50000000,
        currency: 'SEK',
        keywords: ['innovation', 'SME', 'technology', 'sustainability'],
        contact_name: 'Anna Andersson',
        contact_title: 'Program Manager',
        contact_email: 'anna.andersson@vinnova.se',
        contact_phone: '+46 8 123 456 78',
        eligible_cost_categories: ['personnel costs', 'equipment', 'materials', 'travel'],
        evaluation_criteria: 'Innovation potential, market impact, technical feasibility, team competence',
        application_process: 'Online application through Vinnova portal, two-stage evaluation process',
        eligible_organisations: ['small enterprises', 'medium enterprises', 'research institutes'],
        industry_sectors: ['technology', 'manufacturing', 'healthcare', 'environment'],
        original_url: 'https://www.vinnova.se/example-grant-1',
        cofinancing_required: true,
        cofinancing_level_min: 20.0,
        cofinancing_level_max: 50.0,
        program: 'Innovation Program',
        grant_type: 'Innovation Grant'
      },
      {
        title: 'Green Technology Development Fund',
        organisation: 'Formas',
        description: 'Funding for research and development of green technologies and sustainable solutions.',
        subtitle: 'Advancing green technology innovation',
        eligibility: 'Research institutions, universities, and companies with R&D capabilities',
        application_closing_date: '2024-11-30',
        application_opening_date: '2024-06-01',
        max_funding_per_project: 10000000,
        min_funding_per_project: 1000000,
        total_funding_per_call: 100000000,
        currency: 'SEK',
        keywords: ['green technology', 'sustainability', 'R&D', 'environment'],
        contact_name: 'Erik Eriksson',
        contact_title: 'Research Coordinator',
        contact_email: 'erik.eriksson@formas.se',
        contact_phone: '+46 8 775 40 00',
        eligible_cost_categories: ['research costs', 'equipment', 'personnel', 'travel'],
        evaluation_criteria: 'Scientific quality, environmental impact, innovation potential',
        application_process: 'Two-stage application process with peer review',
        eligible_organisations: ['universities', 'research institutes', 'companies'],
        industry_sectors: ['environmental technology', 'energy', 'transportation'],
        original_url: 'https://www.formas.se/example-grant-2',
        cofinancing_required: false,
        program: 'Green Technology Program',
        grant_type: 'Research Grant'
      },
      {
        title: 'Digital Transformation Support',
        organisation: 'Tillväxtverket',
        description: 'Support for SMEs to implement digital transformation initiatives.',
        subtitle: 'Accelerating digital adoption in Swedish businesses',
        eligibility: 'Small and medium enterprises with digital transformation needs',
        application_closing_date: '2024-10-15',
        application_opening_date: '2024-05-01',
        max_funding_per_project: 2000000,
        min_funding_per_project: 200000,
        total_funding_per_call: 25000000,
        currency: 'SEK',
        keywords: ['digital transformation', 'SME', 'technology adoption', 'automation'],
        contact_name: 'Maria Svensson',
        contact_title: 'Digital Advisor',
        contact_email: 'maria.svensson@tillvaxtverket.se',
        contact_phone: '+46 8 681 91 00',
        eligible_cost_categories: ['software licenses', 'consulting', 'training', 'equipment'],
        evaluation_criteria: 'Digital maturity, business impact, implementation plan',
        application_process: 'Online application with digital readiness assessment',
        eligible_organisations: ['small enterprises', 'medium enterprises'],
        industry_sectors: ['manufacturing', 'retail', 'services', 'technology'],
        original_url: 'https://www.tillvaxtverket.se/example-grant-3',
        cofinancing_required: true,
        cofinancing_level_min: 30.0,
        program: 'Digital Transformation Program',
        grant_type: 'Digitalization Grant'
      }
    ])
    .select();

  if (insertError) {
    console.error('❌ Error inserting sample data:', insertError);
    return null;
  }

  console.log('✅ Sample data inserted successfully:', insertData);
  return insertData;
};
