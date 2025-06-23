
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/gif'
      ];

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF, Word document, text file, or image.",
          variant: "destructive"
        });
        return null;
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive"
        });
        return null;
      }

      console.log('Uploading file:', file.name, file.type, file.size);

      // Call the extract-file-content edge function
      const { data, error } = await supabase.functions.invoke('extract-file-content', {
        body: {
          fileId: crypto.randomUUID(),
          fileName: file.name,
          fileType: file.type
        }
      });

      if (error) {
        console.error('File processing error:', error);
        toast({
          title: "Upload Error",
          description: "Failed to process file. Please try again.",
          variant: "destructive"
        });
        return null;
      }

      console.log('File processing result:', data);
      toast({
        title: "Upload Complete",
        description: `File "${file.name}" has been successfully processed.`,
      });

      return data.extractedText;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [toast]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      return uploadFile(file);
    }
    return Promise.resolve(null);
  }, [uploadFile]);

  return {
    isUploading,
    uploadFile,
    handleFileSelect
  };
};
