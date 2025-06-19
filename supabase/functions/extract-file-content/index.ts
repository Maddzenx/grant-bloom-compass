
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { fileId, fileName, fileType } = await req.json();

    console.log(`Processing file: ${fileName} (${fileType})`);

    // Insert initial record
    const { data: extraction, error: insertError } = await supabase
      .from('file_extractions')
      .insert({
        file_id: fileId,
        original_filename: fileName,
        file_type: fileType,
        extraction_status: 'processing'
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to create extraction record: ${insertError.message}`);
    }

    // For now, we'll implement basic text extraction simulation
    // In a real implementation, you would use libraries like pdf-parse for PDFs
    // and OCR services for images
    let extractedText = '';
    let extractionMethod = 'simulated';

    if (fileType === 'application/pdf') {
      extractedText = `[PDF Content Extracted from ${fileName}]\n\nThis is simulated extracted text from a PDF document. In a real implementation, this would contain the actual text content extracted from the PDF file using a library like pdf-parse.`;
      extractionMethod = 'pdf_parse';
    } else if (fileType.startsWith('image/')) {
      extractedText = `[Image Text Extracted from ${fileName}]\n\nThis is simulated OCR text extraction from an image file. In a real implementation, this would use an OCR service to extract text from the image.`;
      extractionMethod = 'ocr';
    } else {
      extractedText = `[Content from ${fileName}]\n\nText content extracted from file.`;
      extractionMethod = 'direct';
    }

    // Update the extraction record with results
    const { error: updateError } = await supabase
      .from('file_extractions')
      .update({
        extracted_text: extractedText,
        extraction_method: extractionMethod,
        extraction_status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', extraction.id);

    if (updateError) {
      throw new Error(`Failed to update extraction: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        extractionId: extraction.id,
        extractedText: extractedText.substring(0, 200) + '...' // Preview only
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in extract-file-content:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
