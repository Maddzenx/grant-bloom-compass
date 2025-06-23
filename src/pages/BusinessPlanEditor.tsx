
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApplicationDraft } from '@/hooks/useChatAgent';
import { Grant } from '@/types/grant';
import { useBusinessPlanEditor } from '@/hooks/useBusinessPlanEditor';
import { BusinessPlanHeader } from '@/components/business-plan/BusinessPlanHeader';
import { EditableBusinessPlanContent } from '@/components/business-plan/EditableBusinessPlanContent';
import { ReviewSuggestions } from '@/components/business-plan/ReviewSuggestions';

const BusinessPlanEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    draft,
    grant
  } = location.state as {
    draft: ApplicationDraft;
    grant: Grant;
  } || {};

  const {
    sections,
    uploadedFiles,
    autoSaved,
    overallCompletion,
    lastSaved,
    updateFieldValue,
    toggleSectionCompletion,
    removeFile,
    addFiles,
    exportBusinessPlan
  } = useBusinessPlanEditor(grant);

  if (!draft || !grant) {
    navigate('/chat');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/chat')} className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Business plan editor</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
              Review
            </Button>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Auto-saved
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl">
            <EditableBusinessPlanContent 
              draft={draft}
              sections={sections}
              onUpdateField={updateFieldValue}
            />
          </div>
        </div>

        {/* Right Sidebar - Review suggestions */}
        <div className="w-80 bg-white border-l border-gray-200 p-6">
          <ReviewSuggestions />
        </div>
      </div>
    </div>
  );
};

export default BusinessPlanEditor;
