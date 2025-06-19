
-- Create table for storing extracted content from uploaded files
CREATE TABLE public.file_extractions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_id TEXT NOT NULL, -- References the uploaded file ID from the frontend
  original_filename TEXT NOT NULL,
  file_type TEXT NOT NULL,
  extracted_text TEXT,
  extraction_method TEXT, -- 'pdf_parse', 'ocr', 'direct'
  extraction_status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for storing application drafts
CREATE TABLE public.application_drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  grant_id UUID, -- References grant_call_details
  user_context JSONB, -- Store business plan data and user inputs
  uploaded_files JSONB, -- Store file references and extracted content
  generated_sections JSONB, -- Store the AI-generated content sections
  generation_status TEXT DEFAULT 'pending', -- 'pending', 'generating', 'completed', 'failed'
  generation_metadata JSONB, -- Store AI model used, prompts, etc.
  total_word_count INTEGER,
  compliance_score NUMERIC(3,2), -- 0.00 to 1.00
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for draft versions (version control)
CREATE TABLE public.draft_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  draft_id UUID REFERENCES public.application_drafts(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content JSONB NOT NULL,
  changes_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for file_extractions
ALTER TABLE public.file_extractions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own file extractions" 
  ON public.file_extractions 
  FOR SELECT 
  USING (true); -- Make public for now, can be restricted later

CREATE POLICY "Users can create file extractions" 
  ON public.file_extractions 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update their own file extractions" 
  ON public.file_extractions 
  FOR UPDATE 
  USING (true);

-- Add RLS policies for application_drafts
ALTER TABLE public.application_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own application drafts" 
  ON public.application_drafts 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create application drafts" 
  ON public.application_drafts 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update their own application drafts" 
  ON public.application_drafts 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Users can delete their own application drafts" 
  ON public.application_drafts 
  FOR DELETE 
  USING (true);

-- Add RLS policies for draft_versions
ALTER TABLE public.draft_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own draft versions" 
  ON public.draft_versions 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create draft versions" 
  ON public.draft_versions 
  FOR INSERT 
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_file_extractions_file_id ON public.file_extractions(file_id);
CREATE INDEX idx_file_extractions_status ON public.file_extractions(extraction_status);
CREATE INDEX idx_application_drafts_grant_id ON public.application_drafts(grant_id);
CREATE INDEX idx_application_drafts_status ON public.application_drafts(generation_status);
CREATE INDEX idx_draft_versions_draft_id ON public.draft_versions(draft_id);
