
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

      console.log('🔍 Supabase query result:', { data, error, dataLength: data?.length });

      if (error) {
        console.error('❌ Supabase query error:', error);
        throw new Error(`Failed to fetch grants: ${error.message}`);
      }

      if (!data || !Array.isArray(data)) {
        console.warn('⚠️ No data returned or data is not an array:', data);
        return [];
      }

      console.log('🔍 Raw data sample:', data[0]);

      const transformedGrants = data.map((grant, index) => {
        try {
          const transformed = transformSupabaseGrant(grant);
          if (index === 0) {
            console.log('🔍 Transformation sample:', { original: grant, transformed });
          }
          return transformed;
        } catch (transformError) {
          console.error('❌ Transform error for grant:', grant.id, transformError);
          // Return a fallback grant object instead of throwing
          return {
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
        }
      });

      console.log('🔍 Final transformed grants count:', transformedGrants.length);
      return transformedGrants;
    },
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  });
};
