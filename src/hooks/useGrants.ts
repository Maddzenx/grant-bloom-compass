
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Grant } from '@/types/grant';
import { transformSupabaseGrant } from '@/utils/grantTransform';

export const useGrants = () => {
  return useQuery({
    queryKey: ['grants'],
    queryFn: async (): Promise<Grant[]> => {
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

      if (error) {
        throw new Error(`Failed to fetch grants: ${error.message}`);
      }

      if (!data || !Array.isArray(data)) {
        return [];
      }

      return data.map(transformSupabaseGrant);
    },
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  });
};
