
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ApplicationDraft {
  id: string;
  grant_id: string | null;
  user_context: any;
  uploaded_files: any;
  generated_sections: any; // Changed from Record<string, string> to any to match Json type
  generation_status: 'pending' | 'generating' | 'completed' | 'failed';
  generation_metadata: any;
  total_word_count: number | null;
  compliance_score: number | null;
  created_at: string;
  updated_at: string;
}

export const useApplicationDrafts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  const extractFileContent = useMutation({
    mutationFn: async ({ fileId, fileName, fileType }: { fileId: string, fileName: string, fileType: string }) => {
      console.log('Extracting content from file:', fileName);
      
      const { data, error } = await supabase.functions.invoke('extract-file-content', {
        body: { fileId, fileName, fileType }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Content Extracted",
        description: "File content has been successfully extracted for analysis."
      });
    },
    onError: (error) => {
      console.error('File extraction error:', error);
      toast({
        title: "Extraction Failed",
        description: "Failed to extract content from the file.",
        variant: "destructive"
      });
    }
  });

  const generateDraft = useMutation({
    mutationFn: async ({ grantId, businessPlanData, uploadedFiles }: {
      grantId: string;
      businessPlanData: any;
      uploadedFiles: any[];
    }) => {
      setIsGenerating(true);
      console.log('Generating application draft for grant:', grantId);
      
      const { data, error } = await supabase.functions.invoke('generate-application-draft', {
        body: { grantId, businessPlanData, uploadedFiles }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setIsGenerating(false);
      queryClient.invalidateQueries({ queryKey: ['application-drafts'] });
      toast({
        title: "Draft Generated",
        description: `Application draft created successfully with ${data.wordCount} words and ${Math.round(data.complianceScore * 100)}% compliance score.`
      });
    },
    onError: (error) => {
      setIsGenerating(false);
      console.error('Draft generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate application draft. Please try again.",
        variant: "destructive"
      });
    }
  });

  const fetchDrafts = useQuery({
    queryKey: ['application-drafts'],
    queryFn: async (): Promise<ApplicationDraft[]> => {
      const { data, error } = await supabase
        .from('application_drafts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const fetchDraft = (draftId: string) => {
    return useQuery({
      queryKey: ['application-draft', draftId],
      queryFn: async (): Promise<ApplicationDraft> => {
        const { data, error } = await supabase
          .from('application_drafts')
          .select('*')
          .eq('id', draftId)
          .single();

        if (error) throw error;
        return data;
      },
      enabled: !!draftId
    });
  };

  return {
    drafts: fetchDrafts.data || [],
    isLoadingDrafts: fetchDrafts.isLoading,
    isGenerating,
    extractFileContent: extractFileContent.mutate,
    generateDraft: generateDraft.mutate,
    fetchDraft,
    refetchDrafts: fetchDrafts.refetch
  };
};
