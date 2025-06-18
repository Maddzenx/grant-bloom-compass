
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Grant } from '@/types/grant';

export const useGrants = () => {
  return useQuery({
    queryKey: ['grants'],
    queryFn: async (): Promise<Grant[]> => {
      console.log('Fetching grants from Supabase...');
      
      const { data, error } = await supabase
        .from('grant_call_details')
        .select('*');

      if (error) {
        console.error('Error fetching grants:', error);
        throw error;
      }

      console.log('Grants fetched successfully:', data);
      return data || [];
    },
  });
};
