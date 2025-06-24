
import React, { useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApplicationDraft } from '@/hooks/useChatAgent';
import { Grant } from '@/types/grant';
import { useBusinessPlanEditor } from '@/hooks/useBusinessPlanEditor';
import { EditableBusinessPlanContent } from '@/components/business-plan/EditableBusinessPlanContent';
import { ReviewSuggestions } from '@/components/business-plan/ReviewSuggestions';
import { EvaluationSuggestion } from '@/hooks/useDraftEvaluation';

const BusinessPlanEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [highlightedSection, setHighlightedSection] = useState<string>('');
  const sectionRefsRef = useRef<Record<string, HTMLTextAreaElement | null>>({});

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

  // Handle section reference storage using useCallback to prevent re-renders
  const handleSectionRef = useCallback((sectionKey: string, ref: HTMLTextAreaElement | null) => {
    sectionRefsRef.current[sectionKey] = ref;
  }, []);

  // Handle highlighting when suggestion is clicked
  const handleHighlightSection = useCallback((sectionKey: string) => {
    setHighlightedSection(sectionKey);

    // Focus and scroll to the section
    const textarea = sectionRefsRef.current[sectionKey];
    if (textarea) {
      textarea.focus();
      textarea.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }

    // Clear highlight after a few seconds
    setTimeout(() => {
      setHighlightedSection('');
    }, 3000);
  }, []);

  // Handle applying suggestions with proper field mapping
  const handleApplySuggestion = useCallback((suggestion: EvaluationSuggestion) => {
    console.log('Applying suggestion:', suggestion);

    // Map section keys to the correct field structure
    const sectionFieldMap: Record<string, {
      sectionId: string;
      fieldId: string;
      draftKey: keyof ApplicationDraft['sections'];
    }> = {
      'utmaning': {
        sectionId: 'utmaning',
        fieldId: 'utmaning_beskrivning',
        draftKey: 'problemformulering'
      },
      'losning': {
        sectionId: 'losning',
        fieldId: 'losning_beskrivning',
        draftKey: 'mal_och_resultat'
      },
      'immaterial': {
        sectionId: 'immaterial',
        fieldId: 'immaterial_beskrivning',
        draftKey: 'immaterial'
      },
      'marknad': {
        sectionId: 'marknad',
        fieldId: 'marknad_beskrivning',
        draftKey: 'malgrupp'
      },
      'kommersialisering': {
        sectionId: 'kommersialisering',
        fieldId: 'kommersiell_strategi',
        draftKey: 'kommersialisering'
      }
    };

    const fieldMapping = sectionFieldMap[suggestion.sectionKey];
    if (fieldMapping) {
      // Update the field with the suggested text
      updateFieldValue(fieldMapping.sectionId, fieldMapping.fieldId, suggestion.suggestedText);

      // Also update the draft object directly for immediate UI feedback
      if (draft && draft.sections) {
        draft.sections[fieldMapping.draftKey] = suggestion.suggestedText;
      }
    }
  }, [updateFieldValue, draft]);

  if (!draft || !grant) {
    navigate('/chat');
    return null;
  }

  const formatLastSaved = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#f8f4ec] sticky top-0 z-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/chat')} className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Förhandsgranska</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
              Download Application
            </Button>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {autoSaved ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Auto-saved</span>
                  {lastSaved && <span className="text-xs text-gray-400">({formatLastSaved(lastSaved)})</span>}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-gray-400 animate-pulse" />
                  <span>Saving...</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="w-full md:basis-[65%] flex-1 py-[12.5px] sm:px-4 sm:py-4 md:px-6 md:py-6 bg-[#f8f4ec] my-0 px-[5px]">
          <div className="max-w-4xl">
            <EditableBusinessPlanContent 
              draft={draft} 
              sections={sections} 
              onUpdateField={updateFieldValue} 
              highlightedSection={highlightedSection} 
              onSectionRef={handleSectionRef} 
            />
          </div>
        </div>

        {/* Right Sidebar - Review suggestions (sticky) */}
        <div className="w-full md:basis-[35%] max-w-100 py-[12.5px] sm:px-4 sm:py-4 md:px-6 md:py-6 bg-[#f8f4ec] px-[5px]">
          <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-hidden">
            <div className="h-full bg-white rounded-xl">
              <ReviewSuggestions 
                draft={draft} 
                grant={grant} 
                onApplySuggestion={handleApplySuggestion} 
                onHighlightSection={handleHighlightSection} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPlanEditor;
