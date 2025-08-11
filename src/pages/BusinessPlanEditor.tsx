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
  // If no draft or grant data is provided, show the business plan editor directly
  if (!draft || !grant) {
    // Initialize expandedSections for standalone view
    const [standaloneExpandedSections, setStandaloneExpandedSections] = useState<Record<string, boolean>>({});
    
    // Initialize completed sections state - only user-marked completions
    const [completedSections, setCompletedSections] = useState<Record<string, boolean>>({});
    
    const toggleStandaloneSectionExpansion = useCallback((sectionKey: string) => {
      setStandaloneExpandedSections(prev => ({
        ...prev,
        [sectionKey]: !prev[sectionKey]
      }));
    }, []);
    
    const toggleSectionCompletion = useCallback((sectionKey: string) => {
      setCompletedSections(prev => ({
        ...prev,
        [sectionKey]: !prev[sectionKey]
      }));
    }, []);
    
    // Review suggestions state
    const [activeTab, setActiveTab] = useState('Korrekt');
    const [suggestions, setSuggestions] = useState([
      { 
        id: 1, 
        type: 'Ändra ordet', 
        suggestion: 'djupt', 
        status: 'pending',
        description: 'Ändra "djupt" till ett mer specifikt ord',
        category: 'Korrekt'
      },
      { 
        id: 2, 
        type: 'Förbättra mening', 
        suggestion: 'signifikant', 
        status: 'pending',
        description: 'Förbättra meningen för att vara mer tydlig',
        category: 'Grammatik'
      },
      { 
        id: 3, 
        type: 'Lägg till detalj', 
        suggestion: 'konkret', 
        status: 'pending',
        description: 'Lägg till mer konkreta detaljer',
        category: 'Tydlighet'
      },
      { 
        id: 4, 
        type: 'Stilförbättring', 
        suggestion: 'professionell', 
        status: 'pending',
        description: 'Gör texten mer professionell',
        category: 'Stil'
      }
    ]);
    
    const handleAcceptSuggestion = useCallback((suggestionId: number) => {
      setSuggestions(prev => prev.map(s => 
        s.id === suggestionId ? { ...s, status: 'accepted' } : s
      ));
    }, []);
    
    const handleRejectSuggestion = useCallback((suggestionId: number) => {
      setSuggestions(prev => prev.map(s => 
        s.id === suggestionId ? { ...s, status: 'rejected' } : s
      ));
    }, []);
    
    const filteredSuggestions = suggestions.filter(s => s.category === activeTab);
    const pendingSuggestions = suggestions.filter(s => s.status === 'pending');
    const progressPercentage = suggestions.length > 0 ? 
      ((suggestions.length - pendingSuggestions.length) / suggestions.length) * 100 : 0;
    
    // File upload state
    const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({
      'project': [],
      'grant': []
    });
    
    const handleFileUpload = useCallback((category: 'project' | 'grant', files: FileList | null) => {
      if (!files) return;
      
      const fileArray = Array.from(files);
      setUploadedFiles(prev => ({
        ...prev,
        [category]: [...prev[category], ...fileArray]
      }));
    }, []);
    
    const removeFile = useCallback((category: 'project' | 'grant', index: number) => {
      setUploadedFiles(prev => ({
        ...prev,
        [category]: prev[category].filter((_, i) => i !== index)
      }));
    }, []);
    
    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    // Drag and drop state
    const [dragStates, setDragStates] = useState<Record<string, boolean>>({
      'project': false,
      'grant': false
    });
    
    const handleDragOver = useCallback((e: React.DragEvent, category: 'project' | 'grant') => {
      e.preventDefault();
      setDragStates(prev => ({ ...prev, [category]: true }));
    }, []);
    
    const handleDragLeave = useCallback((e: React.DragEvent, category: 'project' | 'grant') => {
      e.preventDefault();
      setDragStates(prev => ({ ...prev, [category]: false }));
    }, []);
    
    const handleDrop = useCallback((e: React.DragEvent, category: 'project' | 'grant') => {
      e.preventDefault();
      setDragStates(prev => ({ ...prev, [category]: false }));
      
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFileUpload(category, files);
      }
    }, [handleFileUpload]);

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                           {/* Header Section */}
                 <div className="mb-8">
                   <div className="flex items-center justify-between mb-4">
                     <div>
                       <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Skriv din ansökan här
                       </h1>
                       <p className="text-lg text-gray-600 mb-1">
                       Ansökan till utlysningen Innovativa Startups 2025
                       </p>
                      
                     </div>
                   </div>
                   

                                   </div>

                                   {/* Main Content Grid */}
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   {/* Left Column - Main Content */}
                   <div className="lg:col-span-2">
                     {/* Section Jump Menu */}
                     <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                       <div className="flex items-center justify-between mb-3">
                         <h3 className="text-sm font-medium text-gray-700">Snabbnavigation</h3>
                       </div>
                                               <div className="grid grid-cols-3 gap-2">
                          {[
                            { key: 'dokument', title: 'Dokument', completed: completedSections['dokument'] || false },
                            { key: 'projektinformation', title: 'Projektinfo', completed: completedSections['projektinformation'] || false },
                            { key: 'koordinator', title: 'Koordinator', completed: completedSections['koordinator'] || false },
                            { key: 'budget', title: 'Budget', completed: completedSections['budget'] || false },
                            { key: 'kontaktuppgifter', title: 'Kontakt', completed: completedSections['kontaktuppgifter'] || false },
                            { key: 'om_foretaget', title: 'Företag', completed: completedSections['om_foretaget'] || false },
                            { key: 'potential', title: 'Potential', completed: completedSections['potential'] || false },
                            { key: 'genomforande', title: 'Genomförande', completed: completedSections['genomforande'] || false },
                            { key: 'team', title: 'Team', completed: completedSections['team'] || false },
                            { key: 'bilagor', title: 'Bilagor', completed: completedSections['bilagor'] || false }
                          ].map((section) => (
                           <button
                             key={section.key}
                             onClick={() => {
                               // Expand the target section
                               setStandaloneExpandedSections(prev => ({
                                 ...prev,
                                 [section.key]: true
                               }));
                               
                                                               // Scroll to the section with better positioning
                                setTimeout(() => {
                                  const sectionElement = document.querySelector(`[data-section-key="${section.key}"]`) as HTMLElement;
                                  if (sectionElement) {
                                    // Calculate the target scroll position with proper offset
                                    const headerHeight = 80; // Approximate header height
                                    const sectionOffset = 20; // Additional spacing
                                    const totalOffset = headerHeight + sectionOffset;
                                    
                                    const elementTop = sectionElement.offsetTop;
                                    const targetPosition = elementTop - totalOffset;
                                    
                                    window.scrollTo({
                                      top: targetPosition,
                                      behavior: 'smooth'
                                    });
                                    
                                    // Add a subtle highlight effect to the section
                                    sectionElement.style.transition = 'box-shadow 0.3s ease';
                                    sectionElement.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.3)';
                                    
                                    setTimeout(() => {
                                      sectionElement.style.boxShadow = '';
                                    }, 2000);
                                  }
                                }, 100);
                             }}
                             className={`text-xs px-3 py-2 rounded-md transition-colors ${
                               standaloneExpandedSections[section.key]
                                 ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                 : section.completed 
                                   ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                   : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                             }`}
                           >
                             {section.title}
                           </button>
                         ))}
                       </div>
                     </div>
                             <div className="space-y-4">
                 {[
                   {
                     key: 'dokument',
                     title: 'Dokument & Bilagor',
                     description: 'Ladda upp dokument som stödjer din ansökan',
                     completed: completedSections['dokument'] || false
                   },
                   {
                     key: 'projektinformation',
                     title: 'Projektinformation',
                     description: 'Grundläggande information om projektet',
                     completed: completedSections['projektinformation'] || false
                   },
                  {
                    key: 'koordinator',
                    title: 'Koordinator, projektparter och finansiärer',
                    description: 'Information om projektets koordinator och samarbetspartners',
                    completed: completedSections['koordinator'] || false
                  },
                  {
                    key: 'budget',
                    title: 'Budget',
                    description: 'Ekonomisk planering och budgetöversikt',
                    completed: completedSections['budget'] || false
                  },
                  {
                    key: 'kontaktuppgifter',
                    title: 'Kontaktuppgifter',
                    description: 'Kontaktinformation för projektet',
                    completed: completedSections['kontaktuppgifter'] || false
                  },
                  {
                    key: 'om_foretaget',
                    title: 'Om företaget',
                    description: 'Beskrivning av företaget och dess bakgrund',
                    completed: completedSections['om_foretaget'] || false
                  },
                  {
                    key: 'potential',
                    title: 'Potential',
                    description: 'Projektets potential och förväntade resultat',
                    completed: completedSections['potential'] || false
                  },
                  {
                    key: 'genomforande',
                    title: 'Genomförande',
                    description: 'Plan för projektets genomförande',
                    completed: completedSections['genomforande'] || false
                  },
                  {
                    key: 'team',
                    title: 'Team',
                    description: 'Information om projektteamet och kompetenser',
                    completed: completedSections['team'] || false
                  },
                  {
                    key: 'bilagor',
                    title: 'Bilagor',
                    description: 'Bifogade dokument och tilläggsinformation',
                    completed: completedSections['bilagor'] || false
                  }
                ].map((section, index) => (
                  <div 
                    key={section.key} 
                    data-section-key={section.key}
                    className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow mb-4 overflow-hidden"
                  >
                    <div 
                      className="p-6 cursor-pointer"
                      onClick={() => toggleStandaloneSectionExpansion(section.key)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
                            {index + 1}
                          </div>
                                                           <div className="flex-1">
                                   <h3 className="text-lg font-semibold text-gray-900 mb-1">{section.title}</h3>
                                   <p className="text-gray-600 text-sm">{section.description}</p>
                                   {section.completed && (
                                     <div className="flex items-center gap-1 mt-2">
                                       <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                         <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                         </svg>
                                         Slutförd
                                       </span>
                                     </div>
                                   )}
                                 </div>
                        </div>
                        <div className="ml-4 flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSectionCompletion(section.key);
                            }}
                            className="hover:scale-110 transition-transform"
                          >
                            {section.completed ? (
                              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            ) : (
                              <div className="w-6 h-6 flex items-center justify-center">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
                                </svg>
                              </div>
                            )}
                          </button>
                          <svg 
                            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                              standaloneExpandedSections[section.key] ? 'rotate-180' : ''
                            }`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                                         {/* Expandable Content */}
                     {standaloneExpandedSections[section.key] && (
                       <div className="px-6 pb-6 border-t border-gray-100">
                         <div className="pt-4">
                                                       {section.key === 'dokument' ? (
                              // Special content for Dokument section
                              <div className="space-y-6">
                                {/* Project Documents Section */}
                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Dokument om projektet</h3>
                                  <p className="text-sm text-gray-600 mb-4">Ladda upp dokument som beskriver ditt projekt, företag och team</p>
                                  
                                  {/* File Upload Area */}
                                  <div 
                                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                                      dragStates.project 
                                        ? 'border-blue-400 bg-blue-50' 
                                        : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                    onDragOver={(e) => handleDragOver(e, 'project')}
                                    onDragLeave={(e) => handleDragLeave(e, 'project')}
                                    onDrop={(e) => handleDrop(e, 'project')}
                                  >
                                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <h4 className="text-base font-medium text-gray-900 mb-2">
                                      {dragStates.project ? 'Släpp filer här' : 'Ladda upp projektdokument'}
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-3">
                                      {dragStates.project ? 'Släpp för att ladda upp' : 'Affärsplan, finansiella rapporter, CV, referenser'}
                                    </p>
                                    <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
                                      Välj filer
                                      <input
                                        type="file"
                                        multiple
                                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                                        className="hidden"
                                        onChange={(e) => handleFileUpload('project', e.target.files)}
                                      />
                                    </label>
                                    <p className="text-xs text-gray-500 mt-2">PDF, DOC, DOCX, XLS, XLSX (max 25 MB)</p>
                                  </div>
                                  
                                  {/* Uploaded Files List */}
                                  {uploadedFiles.project.length > 0 && (
                                    <div className="mt-4">
                                      <h5 className="text-sm font-medium text-gray-700 mb-3">Uppladdade filer:</h5>
                                      <div className="space-y-2">
                                        {uploadedFiles.project.map((file, index) => (
                                          <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                                            <div className="flex items-center gap-3">
                                              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                              </svg>
                                              <div>
                                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                              </div>
                                            </div>
                                            <button
                                              onClick={() => removeFile('project', index)}
                                              className="text-red-500 hover:text-red-700 transition-colors"
                                            >
                                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                              </svg>
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Grant Call Documents Section */}
                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Dokument om bidragsutlysningen</h3>
                                  <p className="text-sm text-gray-600 mb-4">Ladda upp dokument relaterade till bidragsutlysningen och ansökningskrav</p>
                                  
                                  {/* File Upload Area */}
                                  <div 
                                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                                      dragStates.grant 
                                        ? 'border-green-400 bg-green-50' 
                                        : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                    onDragOver={(e) => handleDragOver(e, 'grant')}
                                    onDragLeave={(e) => handleDragLeave(e, 'grant')}
                                    onDrop={(e) => handleDrop(e, 'grant')}
                                  >
                                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <h4 className="text-base font-medium text-gray-900 mb-2">
                                      {dragStates.grant ? 'Släpp filer här' : 'Ladda upp utlysningsdokument'}
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-3">
                                      {dragStates.grant ? 'Släpp för att ladda upp' : 'Utlysningstext, riktlinjer, formulär, certifikat'}
                                    </p>
                                    <label className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
                                      Välj filer
                                      <input
                                        type="file"
                                        multiple
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        className="hidden"
                                        onChange={(e) => handleFileUpload('grant', e.target.files)}
                                      />
                                    </label>
                                    <p className="text-xs text-gray-500 mt-2">PDF, DOC, DOCX, JPG, PNG (max 25 MB)</p>
                                  </div>
                                  
                                  {/* Uploaded Files List */}
                                  {uploadedFiles.grant.length > 0 && (
                                    <div className="mt-4">
                                      <h5 className="text-sm font-medium text-gray-700 mb-3">Uppladdade filer:</h5>
                                      <div className="space-y-2">
                                        {uploadedFiles.grant.map((file, index) => (
                                          <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                                            <div className="flex items-center gap-3">
                                              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                              </svg>
                                              <div>
                                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                              </div>
                                            </div>
                                            <button
                                              onClick={() => removeFile('grant', index)}
                                              className="text-red-500 hover:text-red-700 transition-colors"
                                            >
                                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                              </svg>
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>


                              </div>
                           ) : section.key === 'projektinformation' ? (
                            // Special content for Projektinformation section
                            <div className="space-y-6">
                              {/* Continuation of Previous Project */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Är ansökan en fortsättning på tidigare projekt, ange diarienummer i fältet nedan.
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    placeholder="ÅÅÅÅ-NNNNN"
                                    className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                  />
                                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Frivillig</span>
                                </div>
                              </div>

                              {/* Seeking Other Funding */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Söker ni även bidrag för detta projekt (helt eller delvis) i någon annan utlysning hos Vinnova eller hos någon annan finansiär?
                                </label>
                                <div className="flex gap-4">
                                  <label className="flex items-center">
                                    <input type="radio" name="other-funding" className="mr-2" />
                                    <span className="text-sm">Ja</span>
                                  </label>
                                  <label className="flex items-center">
                                    <input type="radio" name="other-funding" className="mr-2" defaultChecked />
                                    <span className="text-sm">Nej</span>
                                  </label>
                                </div>
                              </div>

                              {/* Project Title in Swedish */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                  Projekttitel på svenska
                                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                  </svg>
                                </label>
                                <input
                                  type="text"
                                  defaultValue="Test"
                                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                />
                                <div className="text-xs text-gray-500 mt-1">196 tecken kvar</div>
                              </div>

                              {/* Project Title in English */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                  Projekttitel på engelska
                                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                  </svg>
                                </label>
                                <input
                                  type="text"
                                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                />
                                <div className="text-xs text-gray-500 mt-1">200 tecken kvar</div>
                              </div>

                              {/* Project Duration */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Startdatum</label>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      placeholder="ÅÅÅÅ-MM-DD"
                                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent pr-10"
                                    />
                                    <svg className="w-5 h-5 text-gray-400 absolute right-3 top-3" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Slutdatum</label>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      placeholder="ÅÅÅÅ-MM-DD"
                                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent pr-10"
                                    />
                                    <svg className="w-5 h-5 text-gray-400 absolute right-3 top-3" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                </div>
                              </div>

                              {/* Project Summary in Swedish */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Projektsammanfattning - skriv på svenska
                                </label>
                                <textarea
                                  className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                  placeholder="Skriv din text här..."
                                />
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-gray-500">1500 tecken kvar</span>
                                  <button className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md transition-colors">
                                    Översätt texten
                                  </button>
                                </div>
                              </div>

                              {/* Project Summary in English */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                  Projektsammanfattning - skriv på engelska
                                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                  </svg>
                                </label>
                                <textarea
                                  className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                  placeholder="Skriv din text här..."
                                />
                                <div className="text-xs text-gray-500 mt-1">1500 tecken kvar</div>
                              </div>

                              {/* Project Goals */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Mål för projektet
                                </label>
                                <textarea
                                  className="w-full h-24 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                  placeholder="Skriv din text här..."
                                />
                                <div className="text-xs text-gray-500 mt-1">150 tecken kvar</div>
                              </div>

                              {/* Gender Perspective */}
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Köns och/eller genusperspektiv</h4>
                                <p className="text-sm text-gray-600 mb-4">
                                  Vinnova arbetar för att främja jämställdhet och inkludera köns- och genusperspektiv i alla projekt. 
                                  <a href="#" className="text-blue-600 hover:underline"> Läs mer här om kön- och genusperspektiv.</a>
                                </p>
                                <p className="text-sm text-gray-600 mb-4">
                                  Observera att vi inte efterfrågar information om projektgruppens sammansättning (kvinnor/män).
                                </p>
                                <p className="text-sm text-gray-600 mb-4">
                                  Frågorna om köns- och/eller genusperspektiv ställs till alla sökande men ingår inte alltid i bedömningen. Se aktuell utlysningstext för mer information om vad som bedöms.
                                </p>
                                
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Finns det köns- och/eller genusperspektiv?
                                </label>
                                <div className="flex gap-4 mb-4">
                                  <label className="flex items-center">
                                    <input type="radio" name="gender-perspective" className="mr-2" />
                                    <span className="text-sm">Ja</span>
                                  </label>
                                  <label className="flex items-center">
                                    <input type="radio" name="gender-perspective" className="mr-2" />
                                    <span className="text-sm">Nej</span>
                                  </label>
                                </div>

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Motivera ditt svar gällande köns- och/eller genusperspektiv
                                </label>
                                <textarea
                                  className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                  placeholder="Skriv din text här..."
                                />
                                <div className="text-xs text-gray-500 mt-1">1500 tecken kvar</div>
                              </div>

                              {/* Confidentiality */}
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Sekretess</h4>
                                <div className="flex items-center gap-2 mb-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Finns det uppgifter om affärs- och driftsförhållanden som skulle kunna leda till skada om de offentliggörs?
                                  </label>
                                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Frivillig</span>
                                </div>
                                <div className="flex gap-4">
                                  <label className="flex items-center">
                                    <input type="radio" name="confidentiality" className="mr-2" />
                                    <span className="text-sm">Ja</span>
                                  </label>
                                  <label className="flex items-center">
                                    <input type="radio" name="confidentiality" className="mr-2" />
                                    <span className="text-sm">Nej</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          ) : section.key === 'kontaktuppgifter' ? (
                            // Special content for Kontaktuppgifter section
                            <div className="space-y-6">
                              {/* Project Manager Section */}
                              <div>
                                <p className="text-sm text-gray-600 mb-4">
                                  Ange den person som den koordinerande projektparten (koordinatorn) utsett till projektledare.
                                </p>
                                
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                  <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-sm font-medium text-gray-700">Projektledare</h4>
                                    <div className="text-right">
                                      <button className="border border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-4 py-2 rounded-md transition-colors text-sm">
                                        Hämta mina uppgifter
                                      </button>
                                      <p className="text-xs text-gray-500 mt-1">Hämtas från 'Min profil'</p>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">Förnamn</label>
                                      <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">Efternamn</label>
                                      <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">E-post</label>
                                    <input
                                      type="email"
                                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                    />
                                  </div>
                                  
                                  <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobilnummer</label>
                                    <div className="flex gap-2">
                                      <select className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent">
                                        <option value="+46">+46</option>
                                        <option value="+47">+47</option>
                                        <option value="+45">+45</option>
                                      </select>
                                      <input
                                        type="tel"
                                        className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                        placeholder="Mobilnummer"
                                      />
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Kön</label>
                                    <div className="flex gap-4">
                                      <label className="flex items-center">
                                        <input type="radio" name="gender-project-manager" className="mr-2" />
                                        <span className="text-sm">Kvinna</span>
                                      </label>
                                      <label className="flex items-center">
                                        <input type="radio" name="gender-project-manager" className="mr-2" />
                                        <span className="text-sm">Man</span>
                                      </label>
                                      <label className="flex items-center">
                                        <input type="radio" name="gender-project-manager" className="mr-2" />
                                        <span className="text-sm">Annat</span>
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Signatory Section */}
                              <div>
                                <p className="text-sm text-gray-600 mb-4">
                                  Ange koordinatorns firmatecknare/prefekt.
                                </p>
                                
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                  <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-sm font-medium text-gray-700">Firmatecknare</h4>
                                    <div className="text-right">
                                      <button className="border border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-4 py-2 rounded-md transition-colors text-sm">
                                        Hämta mina uppgifter
                                      </button>
                                      <p className="text-xs text-gray-500 mt-1">Hämtas från 'Min profil'</p>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">Förnamn</label>
                                      <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">Efternamn</label>
                                      <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                      />
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">E-post</label>
                                    <input
                                      type="email"
                                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : section.key === 'koordinator' ? (
                            // Special content for Koordinator section
                            <div className="space-y-6">
                              {/* Instructional Text */}
                              <div className="text-sm text-gray-700 leading-relaxed">
                                I det här steget anges koordinerande projektpart och övriga projektparter som ska delta i projektet. Även projektparter som inte söker stöd från Vinnova ska läggas till. Om det finns andra finansiärer än Vinnova ska dessa läggas till under respektive projektpart. Organisationsuppgifterna kommer från en extern datakälla. Budgeten anges i nästa steg i ansökan.
                              </div>
                              
                              {/* Koordinerande projektpart Section */}
                              <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-lg font-semibold text-gray-900">
                                    Koordinerande projektpart
                                  </h4>
                                  <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                </div>
                                
                                {/* Add Coordinator Button */}
                                <button className="border border-green-500 text-green-600 bg-white hover:bg-green-50 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                  Lägg till koordinator
                                </button>
                              </div>
                            </div>
                          ) : section.key === 'om_foretaget' ? (
                            // Special content for Om företaget section
                            <div className="space-y-6">
                              {/* Ownership Information */}
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                  Ange de ägare (privatpersoner och/eller företag) som äger 25% eller mer.
                                </h4>
                                <p className="text-sm text-gray-600 mb-4">Sökande företags ägare</p>
                                
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                  <div className="flex justify-between items-center mb-4">
                                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors text-sm">
                                      Lägg till
                                    </button>
                                    <span className="text-sm text-gray-500">0/100</span>
                                  </div>
                                  <p className="text-xs text-gray-500">Lägg till 1-100</p>
                                </div>
                              </div>

                              {/* Company Ownership Questions */}
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Åger sökande företag något annat företag?
                                  </label>
                                  <div className="flex gap-4">
                                    <label className="flex items-center">
                                      <input type="radio" name="company-ownership" className="mr-2" />
                                      <span className="text-sm">Ja</span>
                                    </label>
                                    <label className="flex items-center">
                                      <input type="radio" name="company-ownership" className="mr-2" />
                                      <span className="text-sm">Nej</span>
                                    </label>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Åger företagets ägare andra företag?
                                  </label>
                                  <div className="flex gap-4">
                                    <label className="flex items-center">
                                      <input type="radio" name="owner-ownership" className="mr-2" />
                                      <span className="text-sm">Ja</span>
                                    </label>
                                    <label className="flex items-center">
                                      <input type="radio" name="owner-ownership" className="mr-2" />
                                      <span className="text-sm">Nej</span>
                                    </label>
                                  </div>
                                </div>
                              </div>

                              {/* Financial Information for 2024 */}
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                  Ekonomiska uppgifter för 2024
                                </h4>
                                <p className="text-sm text-gray-600 mb-4">
                                  Om ett bokslut för räkenskapsåret 2024 ännu inte har upprättats, uppskatta värdena baserat på en balansrapport och en resultatrapport. Alla belopp ska anges i svenska kronor (SEK).
                                </p>

                                {/* Net Sales */}
                                <div className="mb-6">
                                  <h5 className="text-sm font-medium text-gray-700 mb-2">Nettoomsättning</h5>
                                  <p className="text-sm text-gray-600 mb-3">
                                    Ange företagets totala försäljningsintäkter från varor och tjänster, efter avdrag för rabatter, moms och andra skatter.
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="number"
                                      className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                      placeholder="0"
                                    />
                                    <span className="text-sm text-gray-600">SEK</span>
                                  </div>
                                </div>

                                {/* Balance Sheet Total */}
                                <div className="mb-6">
                                  <h5 className="text-sm font-medium text-gray-700 mb-2">Balansomslutning</h5>
                                  <p className="text-sm text-gray-600 mb-3">
                                    Ange summan av företagets totala tillgångar eller summan av skulder och eget kapital enligt balansräkningen.
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="number"
                                      className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                      placeholder="0"
                                    />
                                    <span className="text-sm text-gray-600">SEK</span>
                                  </div>
                                </div>

                                {/* Stock Exchange Listing */}
                                <div className="mb-6">
                                  <h5 className="text-sm font-medium text-gray-700 mb-2">Börsnotering</h5>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Är det sökande företaget börsnoterat?
                                  </label>
                                  <div className="flex gap-4">
                                    <label className="flex items-center">
                                      <input type="radio" name="stock-exchange" className="mr-2" />
                                      <span className="text-sm">Ja</span>
                                    </label>
                                    <label className="flex items-center">
                                      <input type="radio" name="stock-exchange" className="mr-2" />
                                      <span className="text-sm">Nej</span>
                                    </label>
                                  </div>
                                </div>

                                {/* Dividend Payout */}
                                <div className="mb-6">
                                  <h5 className="text-sm font-medium text-gray-700 mb-2">Vinstutdelning</h5>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Har det sökande företaget, eller dess koncern om det ingår i en sådan, delat ut vinst?
                                  </label>
                                  <div className="flex gap-4">
                                    <label className="flex items-center">
                                      <input type="radio" name="dividend" className="mr-2" />
                                      <span className="text-sm">Ja</span>
                                    </label>
                                    <label className="flex items-center">
                                      <input type="radio" name="dividend" className="mr-2" />
                                      <span className="text-sm">Nej</span>
                                    </label>
                                  </div>
                                </div>

                                {/* Independent Company Start */}
                                <div>
                                  <h5 className="text-sm font-medium text-gray-700 mb-2">Självständig företagsstart</h5>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Har sökande företag tagit över annat företags verksamhet eller bildats genom fusion?
                                  </label>
                                  <div className="flex gap-4">
                                    <label className="flex items-center">
                                      <input type="radio" name="independent-start" className="mr-2" />
                                      <span className="text-sm">Ja</span>
                                    </label>
                                    <label className="flex items-center">
                                      <input type="radio" name="independent-start" className="mr-2" />
                                      <span className="text-sm">Nej</span>
                                    </label>
                                  </div>
                                </div>
                                                             </div>
                             </div>
                           ) : section.key === 'potential' ? (
                             // Special content for Potential section
                             <div className="space-y-6">
                               {/* Problemet */}
                               <div>
                                 <h4 className="text-sm font-medium text-gray-700 mb-2">Problemet</h4>
                                 <label className="block text-sm font-medium text-gray-700 mb-2">
                                   Vilket problem löser ni, eller vilket behov tillfredsställer ni – och för vilka målgrupper?
                                 </label>
                                 <textarea
                                   className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                   placeholder="Skriv din text här..."
                                 />
                                 <div className="text-xs text-gray-500 mt-1">2000 tecken kvar</div>
                               </div>

                               {/* Lösningen */}
                               <div>
                                 <h4 className="text-sm font-medium text-gray-700 mb-2">Lösningen</h4>
                                 <label className="block text-sm font-medium text-gray-700 mb-2">
                                   Beskriv er tänkta lösning och i vilket sammanhang den ska användas. Vad gör er lösning ny eller annorlunda jämfört med andra som finns i dag?
                                 </label>
                                 <textarea
                                   className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                   placeholder="Skriv din text här..."
                                 />
                                 <div className="text-xs text-gray-500 mt-1">2000 tecken kvar</div>
                               </div>

                               {/* Behov och nytta */}
                               <div>
                                 <h4 className="text-sm font-medium text-gray-700 mb-2">Behov och nytta</h4>
                                 <label className="block text-sm font-medium text-gray-700 mb-2">
                                   Vilken nytta skapar er lösning – för kunderna, för användarna och för samhället? Hur vet ni att behovet är viktigt?
                                 </label>
                                 <textarea
                                   className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                   placeholder="Skriv din text här..."
                                 />
                                 <div className="text-xs text-gray-500 mt-1">2000 tecken kvar</div>
                               </div>

                               {/* Affärsmodellen */}
                               <div>
                                 <h4 className="text-sm font-medium text-gray-700 mb-2">Affärsmodellen</h4>
                                 <label className="block text-sm font-medium text-gray-700 mb-2">
                                   Vilka är era viktigaste målgrupper och hur ser marknaden ut? Beskriv den tänkta affärsmodellen. Hur tänker ni sälja, marknadsföra och expandera verksamheten nationellt och internationellt?
                                 </label>
                                 <textarea
                                   className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                   placeholder="Skriv din text här..."
                                 />
                                 <div className="text-xs text-gray-500 mt-1">2000 tecken kvar</div>
                               </div>

                               {/* Konkurrenskraften */}
                               <div>
                                 <h4 className="text-sm font-medium text-gray-700 mb-2">Konkurrenskraften</h4>
                                 <label className="block text-sm font-medium text-gray-700 mb-2">
                                   Vad är det som ger er ett försprång jämfört med konkurrenterna och hur skyddar ni det som gör ert företag starkt? Vilken plan har ni för era immateriella tillgångar inom företaget?
                                 </label>
                                 <textarea
                                   className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                   placeholder="Skriv din text här..."
                                 />
                                 <div className="text-xs text-gray-500 mt-1">2000 tecken kvar</div>
                               </div>
                             </div>
                           ) : section.key === 'genomforande' ? (
                             // Special content for Genomförande section
                             <div className="space-y-6">
                               {/* Project Setup */}
                               <div>
                                 <h4 className="text-sm font-medium text-gray-700 mb-2">Projektets upplägg</h4>
                                 <p className="text-sm text-gray-600 mb-4">
                                   Beskriv projektets upplägg i arbetspaket med aktiviteter och team. Ange samtliga arbetspaket nedan genom att klicka på Lägg till och fyll i alla uppgifter.
                                 </p>
                                 
                                 <div className="bg-white border border-gray-200 rounded-lg p-6">
                                   <div className="flex justify-between items-center mb-4">
                                     <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors text-sm">
                                       Lägg till
                                     </button>
                                     <span className="text-sm text-gray-500">0/100</span>
                                   </div>
                                   <p className="text-xs text-gray-500">Lägg till 1-100</p>
                                 </div>
                               </div>

                               {/* Information Security */}
                               <div>
                                 <h4 className="text-sm font-medium text-gray-700 mb-2">Informationssäkerhet</h4>
                                 <label className="block text-sm font-medium text-gray-700 mb-2">
                                   Beskriv hur ni skyddar information och data som har värde för företaget?
                                 </label>
                                 <textarea
                                   className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                   placeholder="Skriv din text här..."
                                 />
                                 <div className="text-xs text-gray-500 mt-1">1000 tecken kvar</div>
                               </div>

                               {/* Implementation and Follow-up */}
                               <div>
                                 <h4 className="text-sm font-medium text-gray-700 mb-2">Implementering och uppföljning</h4>
                                 <label className="block text-sm font-medium text-gray-700 mb-2">
                                   Beskriv hur ni tänker följa upp och utvärdera det pågående arbetet för att säkerställa att projektet leder till önskat resultat?
                                 </label>
                                 <textarea
                                   className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                   placeholder="Skriv din text här..."
                                 />
                                 <div className="text-xs text-gray-500 mt-1">1000 tecken kvar</div>
                               </div>

                               {/* Commercialization Plan */}
                               <div>
                                 <h4 className="text-sm font-medium text-gray-700 mb-2">Kommersialiseringsplan</h4>
                                 <label className="block text-sm font-medium text-gray-700 mb-2">
                                   Hur tänker ni ta er lösning vidare efter projektets slut? Hur ska ni kunna växa och nå ut till fler kunder eller användare?
                                 </label>
                                 <textarea
                                   className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                   placeholder="Skriv din text här..."
                                 />
                                 <div className="text-xs text-gray-500 mt-1">2000 tecken kvar</div>
                               </div>

                               {/* Financing Plan */}
                               <div>
                                 <h4 className="text-sm font-medium text-gray-700 mb-2">Finansieringsplan</h4>
                                 <label className="block text-sm font-medium text-gray-700 mb-2">
                                   Beskriv hur Vinnovas finansiering skulle kunna komplettera pågående och planerade finansierings- och utvecklingsinitiativ? Förklara varför ingen annan än Vinnova kan finansiera projektet?
                                 </label>
                                 <textarea
                                   className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                   placeholder="Skriv din text här..."
                                 />
                                 <div className="text-xs text-gray-500 mt-1">2000 tecken kvar</div>
                               </div>
                             </div>
                           ) : section.key === 'team' ? (
                             // Special content for Team section
                             <div className="space-y-6">
                               {/* Experience and Competence */}
                               <div>
                                 <h4 className="text-sm font-medium text-gray-700 mb-2">Erfarenhet och kompetens</h4>
                                 <label className="block text-sm font-medium text-gray-700 mb-2">
                                   Vilken erfarenhet och kompetens har teamet, och hur ser ni till att alla är engagerade och delaktiga i att genomföra projektet och att driva projektet framåt?
                                 </label>
                                 <textarea
                                   className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                   placeholder="Skriv din text här..."
                                 />
                                 <div className="text-xs text-gray-500 mt-1">1000 tecken kvar</div>
                               </div>

                               {/* Gender Equality */}
                               <div>
                                 <h4 className="text-sm font-medium text-gray-700 mb-2">Jämställdhet</h4>
                                 <label className="block text-sm font-medium text-gray-700 mb-2">
                                   Vilken plan har ni för att få jämställd fördelning av makt och inflytande mellan kvinnor och män i projektet?
                                 </label>
                                 <textarea
                                   className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                   placeholder="Skriv din text här..."
                                 />
                                 <div className="text-xs text-gray-500 mt-1">1000 tecken kvar</div>
                               </div>

                               {/* Network */}
                               <div>
                                 <h4 className="text-sm font-medium text-gray-700 mb-2">Nätverk</h4>
                                 <label className="block text-sm font-medium text-gray-700 mb-2">
                                   Vilka externa resurser, experter och nätverk har ni tillgång till, och hur bidrar dessa till projektets utveckling och genomförande?
                                 </label>
                                 <textarea
                                   className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                   placeholder="Skriv din text här..."
                                 />
                                 <div className="text-xs text-gray-500 mt-1">2000 tecken kvar</div>
                               </div>

                               {/* Ownership */}
                               <div>
                                 <h4 className="text-sm font-medium text-gray-700 mb-2">Ägarskap</h4>
                                 <label className="block text-sm font-medium text-gray-700 mb-2">
                                   På vilket sätt är grundarna drivande i företagets utveckling? Beskriv deras roll, engagemang och vilka beslut eller insatser de ansvarar för?
                                 </label>
                                 <textarea
                                   className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                   placeholder="Skriv din text här..."
                                 />
                                 <div className="text-xs text-gray-500 mt-1">2000 tecken kvar</div>
                               </div>

                               {/* Competence Provision */}
                               <div>
                                 <h4 className="text-sm font-medium text-gray-700 mb-2">Kompetensförsörjning</h4>
                                 <label className="block text-sm font-medium text-gray-700 mb-2">
                                   Hur arbetar ni för att säkerställa att rätt personer är med i teamet – nu och framöver? Beskriv eventuella kompetensbrister ni ser och hur ni planerar att hantera dessa?
                                 </label>
                                 <textarea
                                   className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                   placeholder="Skriv din text här..."
                                 />
                                 <div className="text-xs text-gray-500 mt-1">2000 tecken kvar</div>
                               </div>

                               {/* Project Team Members */}
                               <div>
                                 <h4 className="text-sm font-medium text-gray-700 mb-2">
                                   Ange uppgifter om de medlemmar som ingår i projektteamet.
                                 </h4>
                                 
                                 <div className="bg-white border border-gray-200 rounded-lg p-6">
                                   <div className="flex justify-between items-center mb-4">
                                     <h5 className="text-sm font-medium text-gray-700">Medlem i projektteam</h5>
                                     <span className="text-sm text-gray-500">0/100</span>
                                   </div>
                                   <div className="flex justify-between items-center">
                                     <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors text-sm">
                                       Lägg till
                                     </button>
                                     <p className="text-xs text-gray-500">Lägg till 1-100</p>
                                   </div>
                                 </div>
                               </div>

                               {/* Board Members */}
                               <div>
                                 <h4 className="text-sm font-medium text-gray-700 mb-2">
                                   Ange samtliga ledamöter i företagets styrelse.
                                 </h4>
                                 
                                 <div className="bg-white border border-gray-200 rounded-lg p-6">
                                   <div className="flex justify-between items-center mb-4">
                                     <h5 className="text-sm font-medium text-gray-700">Styrelseledamot</h5>
                                     <span className="text-sm text-gray-500">0/100</span>
                                   </div>
                                   <div className="flex justify-between items-center">
                                     <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors text-sm">
                                       Lägg till
                                     </button>
                                     <p className="text-xs text-gray-500">Lägg till 1-100</p>
                                   </div>
                                 </div>
                               </div>
                             </div>
                           ) : section.key === 'bilagor' ? (
                             // Special content for Bilagor section
                             <div className="space-y-6">
                               {/* Main Heading */}
                               <div>
                                 <h4 className="text-sm font-medium text-gray-700 mb-4">
                                   Här kan du ladda upp bilagor.
                                 </h4>
                               </div>

                               {/* Instructions Section */}
                               <div className="space-y-4">
                                 <p className="text-sm text-gray-600">
                                   Vissa utlysningar har särskilda regler när det gäller omfattningen på ansökan, vilka gäller före våra allmänna villkor. Kontrollera därför alltid vad utlysningstexten säger om vilka bilagor som är obligatoriska.
                                 </p>
                                 <p className="text-sm text-gray-600">
                                   Information om vilka filtyper som är tillåtna att ladda upp som bilaga finns i{' '}
                                   <a href="#" className="text-[#8B5CF6] hover:underline">Frågor och svar</a>
                                 </p>
                               </div>

                               {/* Password Protection Warning */}
                               <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                 <div className="flex justify-between items-start mb-2">
                                   <h5 className="text-sm font-medium text-gray-700">Lösenordsskydd fungerar inte</h5>
                                   <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                                     Visa mindre
                                     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                       <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                     </svg>
                                   </button>
                                 </div>
                                 <p className="text-sm text-gray-600">
                                   När du laddar upp filer är det viktigt att de inte är låsta eller lösenordsskyddade. Kravet på olåsta filer beror på att ansökan/rapporter och alla bilagor slås ihop till ett dokument. Detta fungerar inte för uppladdade låsta filer.
                                 </p>
                               </div>

                               {/* Specific Attachment Type */}
                               <div>
                                 <div className="flex justify-between items-center mb-2">
                                   <h5 className="text-sm font-medium text-gray-700">Intyg om stöd av mindre betydelse</h5>
                                   <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Frivillig</span>
                                 </div>
                                 <p className="text-sm text-gray-600 mb-4">25 MB max filstorlek.</p>

                                 {/* File Upload Area */}
                                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                                   <div className="flex flex-col items-center">
                                     <svg className="w-12 h-12 text-gray-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
                                       <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                     </svg>
                                     <button className="text-green-500 hover:text-green-600 font-medium mb-2">
                                       Ladda upp
                                     </button>
                                     <p className="text-sm text-gray-500">eller släpp filer här</p>
                                   </div>
                                 </div>
                               </div>

                               {/* Additional Upload Areas */}
                               <div className="space-y-4">
                                 {/* Financial Statements */}
                                 <div>
                                   <div className="flex justify-between items-center mb-2">
                                     <h5 className="text-sm font-medium text-gray-700">Bokslut</h5>
                                     <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Frivillig</span>
                                   </div>
                                   <p className="text-sm text-gray-600 mb-4">25 MB max filstorlek.</p>
                                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                     <div className="flex flex-col items-center">
                                       <svg className="w-8 h-8 text-gray-400 mb-2" fill="currentColor" viewBox="0 0 20 20">
                                         <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                       </svg>
                                       <button className="text-green-500 hover:text-green-600 font-medium text-sm">
                                         Ladda upp
                                       </button>
                                       <p className="text-xs text-gray-500">eller släpp filer här</p>
                                     </div>
                                   </div>
                                 </div>

                                 {/* Other Documents */}
                                 <div>
                                   <div className="flex justify-between items-center mb-2">
                                     <h5 className="text-sm font-medium text-gray-700">Övriga dokument</h5>
                                     <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Frivillig</span>
                                   </div>
                                   <p className="text-sm text-gray-600 mb-4">25 MB max filstorlek.</p>
                                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                     <div className="flex flex-col items-center">
                                       <svg className="w-8 h-8 text-gray-400 mb-2" fill="currentColor" viewBox="0 0 20 20">
                                         <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                       </svg>
                                       <button className="text-green-500 hover:text-green-600 font-medium text-sm">
                                         Ladda upp
                                       </button>
                                       <p className="text-xs text-gray-500">eller släpp filer här</p>
                                     </div>
                                   </div>
                                 </div>
                               </div>
                               
                               {/* Next Section Button */}
                               <div className="mt-6 pt-4 border-t border-gray-100">
                                 <div className="flex items-center justify-between">
                                   <span className="text-sm text-gray-500">Nästa sektion: Koordinator, projektparter och finansiärer</span>
                                   <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                                     Nästa sektion
                                     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                       <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                     </svg>
                                   </button>
                                 </div>
                               </div>
                             </div>
                           ) : (
                            // Default content for other sections
                            <>
                              <textarea
                                className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                placeholder="Skriv din text här..."
                              />
                              <div className="mt-3 flex justify-between items-center">
                                <span className="text-xs text-gray-500">0 / 500 tecken</span>
                                <button className="bg-gray-500 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded-md transition-colors">
                                  Spara
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Review Suggestions */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-100 shadow-lg sticky top-20 overflow-hidden">
                {/* Review Suggestions Header */}
                <div className="bg-[#f0f1f3] px-6 py-5 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Granska förslag</h3>
                    <div className="bg-[#8B5CF6] text-white text-xs font-medium px-2 py-1 rounded-full">
                      {pendingSuggestions.length}
                    </div>
                  </div>
                  
                  {/* Tabs */}
                  <div className="flex space-x-1 mb-4">
                    {['Korrekt', 'Grammatik', 'Stil', 'Tydlighet'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-colors ${
                          activeTab === tab ? 'bg-white text-[#8B5CF6]' : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-[#8B5CF6] h-1 rounded-full transition-all duration-300" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Suggestions List */}
                <div className="p-6 bg-[#f0f1f3]">
                  <div className="space-y-4">
                    {filteredSuggestions.length > 0 ? (
                      filteredSuggestions.map((suggestion) => (
                        <div 
                          key={suggestion.id} 
                          className={`bg-white rounded-lg p-4 border border-gray-200 transition-all duration-200 ${
                            suggestion.status === 'accepted' ? 'border-green-200 bg-green-50' :
                            suggestion.status === 'rejected' ? 'border-red-200 bg-red-50' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-xs font-medium text-gray-500">{suggestion.type}</span>
                            <span className="text-xs text-gray-400">Förslag {suggestion.id}</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-3">{suggestion.description}</p>
                          {suggestion.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleAcceptSuggestion(suggestion.id)}
                                className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs px-3 py-1 rounded-md transition-colors"
                              >
                                Acceptera
                              </button>
                              <button 
                                onClick={() => handleRejectSuggestion(suggestion.id)}
                                className="text-gray-600 border border-gray-300 text-xs px-3 py-1 rounded-md transition-colors hover:bg-gray-50"
                              >
                                Avvisa
                              </button>
                            </div>
                          )}
                          {suggestion.status === 'accepted' && (
                            <div className="flex items-center gap-2 text-green-600">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <span className="text-xs font-medium">Accepterat</span>
                            </div>
                          )}
                          {suggestion.status === 'rejected' && (
                            <div className="flex items-center gap-2 text-red-600">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                              <span className="text-xs font-medium">Avvisat</span>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-gray-500">Inga förslag i denna kategori</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const formatLastSaved = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleTimeString('sv-SE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 px-6 py-4 bg-[#f0f1f3]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/chat')} className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Förhandsgranska</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="default" size="sm" className="bg-[#cec5f9]">
              Download Application
            </Button>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {autoSaved ? <>
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Auto-saved</span>
                  {lastSaved && <span className="text-xs text-gray-400">({formatLastSaved(lastSaved)})</span>}
                </> : <>
                  <Save className="w-4 h-4 text-gray-400 animate-pulse" />
                  <span>Saving...</span>
                </>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex bg-[#f0f1f3]">
        {/* Main Content */}
        <div className="w-full max-w-3xl mx-auto py-[12.5px] sm:px-4 sm:py-4 my-0 px-[5px] bg-[#f0f1f3] md:py-[22px] md:px-[24px]">
          <div className="max-w-4xl">
            <EditableBusinessPlanContent draft={draft} sections={sections} onUpdateField={updateFieldValue} highlightedSection={highlightedSection} onSectionRef={handleSectionRef} />
          </div>
        </div>

        {/* Right Sidebar - Review suggestions (sticky) */}
        <div className="w-full md:basis-[35%] max-w-100 sm:px-4 sm:py-4 md:px-6 md:py-6 px-[5px] bg-[#f0f1f3] py-[20px]">
          <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-hidden bg-white">
            <div className="bg-[000000]hover:bg-[#C5E858]text-gray-900font-newsreaderfont-semiboldtext-lgpx-8py-4rounded-fulltransition-allduration-200hover:scale-105hover:drop-shadow-lg bg-white">
              <ReviewSuggestions draft={draft} grant={grant} onApplySuggestion={handleApplySuggestion} onHighlightSection={handleHighlightSection} />
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default BusinessPlanEditor;