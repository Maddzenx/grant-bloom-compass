import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDraftEvaluation, EvaluationSuggestion } from '@/hooks/useDraftEvaluation';
import { ApplicationDraft } from '@/hooks/useChatAgent';
import { Grant } from '@/types/grant';
interface ReviewSuggestionsProps {
  draft?: ApplicationDraft;
  grant?: Grant;
  onApplySuggestion?: (suggestion: EvaluationSuggestion) => void;
  onHighlightSection?: (sectionKey: string) => void;
}
export const ReviewSuggestions: React.FC<ReviewSuggestionsProps> = ({
  draft,
  grant,
  onApplySuggestion,
  onHighlightSection
}) => {
  const {
    suggestions
  } = useDraftEvaluation(draft || null, grant || null);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());

  // Group suggestions by type
  const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.type]) {
      acc[suggestion.type] = [];
    }
    acc[suggestion.type].push(suggestion);
    return acc;
  }, {} as Record<string, EvaluationSuggestion[]>);
  const handleSuggestionClick = (suggestion: EvaluationSuggestion) => {
    console.log('Highlighting section:', suggestion.sectionKey);
    onHighlightSection?.(suggestion.sectionKey);
  };
  const handleAccept = (suggestion: EvaluationSuggestion) => {
    console.log('Accepting suggestion:', suggestion);
    onApplySuggestion?.(suggestion);
    setAppliedSuggestions(prev => new Set([...prev, suggestion.id]));
  };
  const handleDismiss = (suggestionId: string) => {
    console.log('Dismissed suggestion:', suggestionId);
    setAppliedSuggestions(prev => new Set([...prev, suggestionId]));
  };
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };
  const renderSuggestionsList = (suggestions: EvaluationSuggestion[]) => <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-300px)]">
      {suggestions.length === 0 ? <div className="text-sm text-gray-500 text-center py-4">
          {draft ? 'No suggestions for this category' : 'Generate a draft to see suggestions'}
        </div> : suggestions.filter(s => !appliedSuggestions.has(s.id)).map(suggestion => <div key={suggestion.id} onClick={() => handleSuggestionClick(suggestion)} className="px-[10px] py-[10px] bg-gray-50 rounded-xl">
            <div className="flex items-start justify-between mb-2">
              <div className="text-xs font-medium text-gray-600 uppercase">
                {suggestion.priority} priority
              </div>
              <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                {suggestion.sectionKey}
              </div>
            </div>
            
            <div className="text-sm text-gray-800 mb-2 font-medium">
              {suggestion.suggestion}
            </div>
            
            <div className="text-xs text-gray-600 mb-3 italic">
              {suggestion.reason}
            </div>

            {suggestion.suggestedText !== suggestion.originalText && <div className="text-xs mb-3">
                <div className="text-gray-600 mb-1">Suggested improvement:</div>
                <div className="bg-white p-2 rounded border text-gray-700">
                  {suggestion.suggestedText.length > 100 ? `${suggestion.suggestedText.substring(0, 100)}...` : suggestion.suggestedText}
                </div>
              </div>}
            
            <div className="flex gap-2" onClick={e => e.stopPropagation()}>
              <Button size="sm" onClick={() => handleAccept(suggestion)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 h-8 text-sm rounded-md">
                Apply
              </Button>
              <button onClick={() => handleDismiss(suggestion.id)} className="text-blue-600 hover:text-blue-700 text-sm font-medium px-2 py-1.5">
                Dismiss
              </button>
            </div>
          </div>)}
    </div>;
  const totalSuggestions = suggestions.filter(s => !appliedSuggestions.has(s.id)).length;
  return <div className="absolute inset-x-5 bottom-0 py-[24px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-semibold text-gray-900 text-base">Review suggestions</h3>
        <div className="bg-yellow-400 text-black text-xs font-medium px-2 py-0.5 rounded-full min-w-[24px] h-5 flex items-center justify-center">
          {totalSuggestions}
        </div>
      </div>

      {/* Tabbed Interface */}
      <Tabs defaultValue="Relevans" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4 bg-gray-50 rounded-xl">
          <TabsTrigger value="Relevans" className="text-xs bg-[#cec5f9]">
            Relevans
            {groupedSuggestions['Relevans']?.filter(s => !appliedSuggestions.has(s.id)).length > 0 && <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {groupedSuggestions['Relevans'].filter(s => !appliedSuggestions.has(s.id)).length}
              </span>}
          </TabsTrigger>
          <TabsTrigger value="Originalitet" className="text-xs">
            Originalitet
            {groupedSuggestions['Originalitet']?.filter(s => !appliedSuggestions.has(s.id)).length > 0 && <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {groupedSuggestions['Originalitet'].filter(s => !appliedSuggestions.has(s.id)).length}
              </span>}
          </TabsTrigger>
          <TabsTrigger value="Struktur" className="text-xs">
            Struktur
            {groupedSuggestions['Struktur']?.filter(s => !appliedSuggestions.has(s.id)).length > 0 && <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {groupedSuggestions['Struktur'].filter(s => !appliedSuggestions.has(s.id)).length}
              </span>}
          </TabsTrigger>
          <TabsTrigger value="Övertygelse" className="text-xs">
            Övertygelse
            {groupedSuggestions['Övertygelse']?.filter(s => !appliedSuggestions.has(s.id)).length > 0 && <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {groupedSuggestions['Övertygelse'].filter(s => !appliedSuggestions.has(s.id)).length}
              </span>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Relevans">
          {renderSuggestionsList(groupedSuggestions['Relevans'] || [])}
        </TabsContent>

        <TabsContent value="Originalitet">
          {renderSuggestionsList(groupedSuggestions['Originalitet'] || [])}
        </TabsContent>

        <TabsContent value="Struktur">
          {renderSuggestionsList(groupedSuggestions['Struktur'] || [])}
        </TabsContent>

        <TabsContent value="Övertygelse">
          {renderSuggestionsList(groupedSuggestions['Övertygelse'] || [])}
        </TabsContent>
      </Tabs>
    </div>;
};