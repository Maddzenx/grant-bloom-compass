
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Grant } from '@/types/grant';
import { transformSupabaseGrant } from '@/utils/grantTransform';

export const useGrants = () => {
  return useQuery({
    queryKey: ['grants'],
    queryFn: async (): Promise<Grant[]> => {
      console.log('🔥 useGrants queryFn starting - Fetching grants from Supabase...');
      
      try {
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

        console.log('🔥 Supabase query completed');
        console.log('🔥 Supabase error:', error);
        console.log('🔥 Supabase data:', data);
        console.log('🔥 Data type:', typeof data);
        console.log('🔥 Data is array:', Array.isArray(data));
        console.log('🔥 Data length:', data?.length || 'undefined');

        if (error) {
          console.error('🔥 Supabase error details:', error);
          throw new Error(`Failed to fetch grants: ${error.message}`);
        }

        if (!data) {
          console.log('🔥 No data returned from Supabase - data is null/undefined');
          return [];
        }

        if (!Array.isArray(data)) {
          console.error('🔥 Data is not an array:', data);
          return [];
        }

        if (data.length === 0) {
          console.log('🔥 Empty array returned from Supabase - no grants in database');
          return [];
        }

        console.log('🔥 Starting data transformation for', data.length, 'grants');
        
        // Transform the data with better error handling
        const transformedGrants = data
          .map((item, index) => {
            try {
              console.log(`🔥 Transforming grant ${index + 1}:`, item.title || 'No title');
              const transformed = transformSupabaseGrant(item);
              console.log(`🔥 Successfully transformed grant ${index + 1}:`, { 
                id: transformed.id, 
                title: transformed.title,
                organization: transformed.organization 
              });
              return transformed;
            } catch (transformError) {
              console.error(`🔥 Error transforming grant ${index + 1}:`, transformError, item);
              return null;
            }
          })
          .filter((grant): grant is Grant => grant !== null);
        
        console.log('🔥 Final transformed grants count:', transformedGrants.length);
        console.log('🔥 Sample transformed grants:', transformedGrants.slice(0, 2));
        
        return transformedGrants;
      } catch (fetchError) {
        console.error('🔥 Critical error in useGrants queryFn:', fetchError);
        throw fetchError;
      }
    },
    staleTime: 60000, // 1 minute cache
    gcTime: 300000, // 5 minutes
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    enabled: true,
  });
};
