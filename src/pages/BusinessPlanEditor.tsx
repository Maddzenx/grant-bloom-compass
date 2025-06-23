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

  // Handle applying suggestions from the review section
  const handleApplySuggestion = (suggestion: any) => {
    // Apply the suggestion to the corresponding field
    updateFieldValue(suggestion.sectionKey, suggestion.fieldId, suggestion.suggestedText);
  };
  if (!draft || !grant) {
    navigate('/chat');
    return null;
  }
  return <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 bg-[#f8f4ec] sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/chat')} className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Förhandsgranska</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">Download Application</Button>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Auto-saved
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6 bg-[#f8f4ec]">
          <div className="max-w-4xl">
            <EditableBusinessPlanContent draft={draft} sections={sections} onUpdateField={updateFieldValue} />
          </div>
        </div>

        {/* Right Sidebar - Review suggestions (sticky) */}
        <div className="w-80 bg-[#f8f4ec]">
          <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-hidden">
            <div className="border-l border-gray-200 p-6 h-full">
              <ReviewSuggestions draft={draft} grant={grant} onApplySuggestion={handleApplySuggestion} />
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default BusinessPlanEditor;