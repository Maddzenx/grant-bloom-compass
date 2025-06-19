
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, FileText, Download, Edit } from 'lucide-react';
import { useApplicationDrafts } from '@/hooks/useApplicationDrafts';

const DraftViewer = () => {
  const { draftId } = useParams<{ draftId: string }>();
  const navigate = useNavigate();
  const { fetchDraft } = useApplicationDrafts();
  
  const { data: draft, isLoading, error } = fetchDraft(draftId!);

  if (isLoading) {
    return (
      <div className="flex-1 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !draft) {
    return (
      <div className="flex-1 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto p-6">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-600">Failed to load draft or draft not found.</p>
              <Button onClick={() => navigate('/editor')} className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Editor
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'generating':
        return 'bg-blue-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/editor')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Editor
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Application Draft</h1>
              <p className="text-gray-600 mt-1">
                Generated on {formatDate(draft.created_at)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={getStatusColor(draft.generation_status)}>
                {draft.generation_status}
              </Badge>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Draft Metadata */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Draft Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600">Total Word Count</p>
                <p className="text-2xl font-bold text-gray-900">
                  {draft.total_word_count?.toLocaleString() || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Compliance Score</p>
                <div className="flex items-center gap-2 mt-1">
                  <Progress 
                    value={(draft.compliance_score || 0) * 100} 
                    className="flex-1" 
                  />
                  <span className="text-lg font-semibold">
                    {Math.round((draft.compliance_score || 0) * 100)}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sections Generated</p>
                <p className="text-2xl font-bold text-gray-900">
                  {draft.generated_sections ? Object.keys(draft.generated_sections).length : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generated Sections */}
        {draft.generated_sections && Object.keys(draft.generated_sections).length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Generated Sections</h2>
            {Object.entries(draft.generated_sections).map(([sectionTitle, content]) => (
              <Card key={sectionTitle}>
                <CardHeader>
                  <CardTitle className="text-xl">{sectionTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    {typeof content === 'string' ? (
                      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {content}
                      </div>
                    ) : (
                      <pre className="text-sm text-gray-600 bg-gray-50 p-4 rounded">
                        {JSON.stringify(content, null, 2)}
                      </pre>
                    )}
                  </div>
                  <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                    <span>
                      Word count: {typeof content === 'string' ? content.split(' ').length : 'N/A'}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit Section
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-600">No sections have been generated yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DraftViewer;
