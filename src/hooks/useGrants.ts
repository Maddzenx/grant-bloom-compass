
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Grant } from '@/types/grant';
import { transformSupabaseGrant } from '@/utils/grantTransform';

export const useGrants = () => {
  return useQuery({
    queryKey: ['grants'],
    queryFn: async (): Promise<Grant[]> => {
      console.log('🔍 Starting grants fetch...');
      
      const { data, error } = await supabase
        .from('grant_call_details')
        .select(`
          id,
          title,
          organisation,
          description,
          subtitle,
          eligibility,
          application_closing_date,
          max_grant_per_project,
          min_grant_per_project,
          total_funding_amount,
          currency,
          keywords,
          contact_name,
          contact_title,
          contact_email,
          contact_phone,
          eligible_cost_categories,
          information_webinar_dates,
          application_templates_names,
          other_templates_names,
          evaluation_criteria,
          application_process,
          eligible_organisations,
          industry_sectors
        `)
        .order('created_at', { ascending: false });

      console.log('🔍 Supabase query result:', { 
        data, 
        error, 
        dataLength: data?.length,
        firstItem: data?.[0]
      });

      if (error) {
        console.error('❌ Supabase query error:', error);
        throw new Error(`Failed to fetch grants: ${error.message}`);
      }

      if (!data || !Array.isArray(data)) {
        console.warn('⚠️ No data returned or data is not an array:', data);
        return [];
      }

      if (data.length === 0) {
        console.warn('⚠️ Data array is empty - no grants in database');
        return [];
      }

      console.log('🔍 Raw data sample:', JSON.stringify(data[0], null, 2));

      const transformedGrants: Grant[] = [];

      for (let i = 0; i < data.length; i++) {
        const grant = data[i];
        try {
          console.log(`🔄 Transforming grant ${i + 1}/${data.length}:`, grant.id);
          const transformed = transformSupabaseGrant(grant);
          transformedGrants.push(transformed);
          
          if (i === 0) {
            console.log('🔍 First transformation result:', JSON.stringify(transformed, null, 2));
          }
        } catch (transformError) {
          console.error('❌ Transform error for grant:', grant.id, transformError);
          
          // Create a fallback grant object
          const fallbackGrant: Grant = {
            id: grant.id,
            title: grant.title || 'Untitled Grant',
            organization: grant.organisation || 'Unknown Organization',
            description: grant.description || grant.subtitle || 'No description available',
            fundingAmount: 'Not specified',
            deadline: 'Not specified',
            tags: [],
            qualifications: grant.eligibility || 'Not specified',
            aboutGrant: grant.subtitle || grant.description || 'No information available',
            whoCanApply: grant.eligibility || 'Not specified',
            importantDates: [],
            fundingRules: [],
            generalInfo: [],
            requirements: [],
            contact: {
              name: grant.contact_name || '',
              organization: grant.contact_title || '',
              email: grant.contact_email || '',
              phone: grant.contact_phone || ''
            },
            templates: [],
            evaluationCriteria: grant.evaluation_criteria || '',
            applicationProcess: grant.application_process || ''
          };
          
          transformedGrants.push(fallbackGrant);
        }
      }

      console.log('✅ Final transformed grants:', {
        originalCount: data.length,
        transformedCount: transformedGrants.length,
        sampleTitles: transformedGrants.slice(0, 3).map(g => g.title)
      });

      return transformedGrants;
    },
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  });
};
