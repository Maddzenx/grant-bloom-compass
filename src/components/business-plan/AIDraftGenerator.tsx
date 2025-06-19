
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useApplicationDrafts } from '@/hooks/useApplicationDrafts';
import { Grant } from '@/types/grant';
import { Section, UploadedFile } from '@/types/businessPlan';

interface AIDraftGeneratorProps {
  grant?: Grant;
  sections: Section[];
  uploadedFiles: UploadedFile[];
}

export const AIDraftGenerator: React.FC<AIDraftGeneratorProps> = ({
  grant,
  sections,
  uploadedFiles
}) => {
  const { isGenerating, generateDraft, extractFileContent, drafts } = useApplicationDrafts();
  const [extractionProgress, setExtractionProgress] = useState(0);

  const handleGenerateDraft = async () => {
    if (!grant) {
      return;
    }

    // First extract content from uploaded files
    console.log('Starting file content extraction...');
    setExtractionProgress(0);
    
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      try {
        await extractFileContent({
          fileId: file.id,
          fileName: file.name,
          fileType: file.type
        });
        setExtractionProgress(((i + 1) / uploadedFiles.length) * 50);
      } catch (error) {
        console.error(`Failed to extract content from ${file.name}:`, error);
      }
    }

    // Generate business plan data from sections
    const businessPlanData = sections.reduce((acc, section) => {
      acc[section.title] = section.fields.reduce((fieldAcc, field) => {
        fieldAcc[field.label] = field.value;
        return fieldAcc;
      }, {} as Record<string, string>);
      return acc;
    }, {} as Record<string, Record<string, string>>);

    // Generate the application draft
    console.log('Generating application draft...');
    setExtractionProgress(75);
    
    generateDraft({
      grantId: grant.id,
      businessPlanData,
      uploadedFiles
    });

    setExtractionProgress(100);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'generating':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const latestDraft = drafts.find(draft => draft.grant_id === grant?.id);

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          AI Application Draft Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-purple-700 mb-2">
            Generate a professional application draft using AI based on your business plan and uploaded documents.
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary">{sections.length} sections</Badge>
            <Badge variant="secondary">{uploadedFiles.length} files</Badge>
            {grant && <Badge variant="outline">{grant.organization}</Badge>}
          </div>
        </div>

        {isGenerating && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Generating application draft...</span>
              <span>{extractionProgress}%</span>
            </div>
            <Progress value={extractionProgress} className="w-full" />
          </div>
        )}

        {latestDraft && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(latestDraft.generation_status)}
                <span className="text-sm font-medium">Latest Draft</span>
                <Badge 
                  variant={latestDraft.generation_status === 'completed' ? 'default' : 'secondary'}
                >
                  {latestDraft.generation_status}
                </Badge>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(latestDraft.updated_at).toLocaleDateString()}
              </span>
            </div>
            
            {latestDraft.generation_status === 'completed' && (
              <div className="flex gap-4 text-sm text-gray-600">
                <span>{latestDraft.total_word_count} words</span>
                <span>{Math.round((latestDraft.compliance_score || 0) * 100)}% compliance</span>
                <span>{Object.keys(latestDraft.generated_sections || {}).length} sections</span>
              </div>
            )}
          </div>
        )}

        <Button 
          onClick={handleGenerateDraft}
          disabled={isGenerating || !grant || uploadedFiles.length === 0}
          className="w-full bg-purple-600 hover:bg-purple-700"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Generating Draft...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Application Draft
            </>
          )}
        </Button>

        {uploadedFiles.length === 0 && (
          <p className="text-sm text-gray-500 text-center">
            Upload some files first to generate a more comprehensive draft
          </p>
        )}
      </CardContent>
    </Card>
  );
};
