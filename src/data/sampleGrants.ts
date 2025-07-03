
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
        max_grant_per_project: 5000000,
        min_grant_per_project: 500000,
        total_funding_amount: 50000000,
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
        original_url: 'https://www.vinnova.se/example-grant-1'
      },
      {
        title: 'Green Technology Development Fund',
        organisation: 'Energimyndigheten',
        description: 'Funding for development of renewable energy and energy efficiency technologies.',
        subtitle: 'Advancing green technology solutions',
        eligibility: 'Companies and research organizations working on renewable energy projects',
        application_closing_date: '2024-11-15',
        application_opening_date: '2024-08-01',
        max_grant_per_project: 10000000,
        min_grant_per_project: 1000000,
        total_funding_amount: 100000000,
        currency: 'SEK',
        keywords: ['renewable energy', 'green technology', 'energy efficiency'],
        contact_name: 'Erik Eriksson',
        contact_title: 'Senior Advisor',
        contact_email: 'erik.eriksson@energimyndigheten.se',
        contact_phone: '+46 16 544 200',
        eligible_cost_categories: ['R&D costs', 'demonstration projects', 'equipment'],
        evaluation_criteria: 'Environmental impact, commercial potential, technical innovation',
        application_process: 'Application deadline November 15th, decision in February',
        eligible_organisations: ['companies', 'research organizations', 'universities'],
        industry_sectors: ['energy', 'environment', 'technology'],
        original_url: 'https://www.energimyndigheten.se/example-grant-2'
      },
      {
        title: 'Digital Transformation Initiative', 
        organisation: 'Tillväxtverket',
        description: 'Support for companies implementing digital solutions to improve competitiveness.',
        subtitle: 'Digitizing Swedish businesses',
        eligibility: 'Swedish companies looking to implement digital transformation projects',
        application_closing_date: '2024-10-30',
        application_opening_date: '2024-07-15',
        max_grant_per_project: 2000000,
        min_grant_per_project: 200000,
        total_funding_amount: 25000000,
        currency: 'SEK',
        keywords: ['digitalization', 'digital transformation', 'competitiveness'],
        contact_name: 'Maria Svensson',
        contact_title: 'Business Development Manager',
        contact_email: 'maria.svensson@tillvaxtverket.se',
        contact_phone: '+46 8 681 91 00',
        eligible_cost_categories: ['software', 'training', 'consulting', 'hardware'],
        evaluation_criteria: 'Digital maturity, business impact, implementation plan',
        application_process: 'Rolling applications, quarterly decisions',
        eligible_organisations: ['SMEs', 'large enterprises', 'startups'],
        industry_sectors: ['retail', 'manufacturing', 'services', 'logistics'],
        original_url: 'https://www.tillvaxtverket.se/example-grant-3'
      }
    ])
    .select();
  
  console.log('🔄 Insert result:', { insertData, insertError });
  
  if (insertError) {
    console.error('❌ Error inserting sample data:', insertError);
    return null;
  }
  
  return insertData;
};
