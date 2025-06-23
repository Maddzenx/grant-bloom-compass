
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ReviewSuggestion {
  id: string;
  type: 'Relevans' | 'Originalitet' | 'Struktur' | 'Övertygelse';
  suggestion: string;
  word: string;
}

interface ReviewSuggestionsProps {
  suggestions?: ReviewSuggestion[];
}

export const ReviewSuggestions: React.FC<ReviewSuggestionsProps> = ({ 
  suggestions = [] 
}) => {
  // Mock data with the new categories
  const mockSuggestions: ReviewSuggestion[] = [
    { id: '1', type: 'Relevans', suggestion: 'Change the word', word: 'deeply' },
    { id: '2', type: 'Relevans', suggestion: 'Change the word', word: 'significantly' },
    { id: '3', type: 'Originalitet', suggestion: 'Change the word', word: 'innovative' },
    { id: '4', type: 'Originalitet', suggestion: 'Change the word', word: 'unique' },
    { id: '5', type: 'Struktur', suggestion: 'Change the word', word: 'organize' },
    { id: '6', type: 'Struktur', suggestion: 'Change the word', word: 'structure' },
    { id: '7', type: 'Övertygelse', suggestion: 'Change the word', word: 'compelling' },
    { id: '8', type: 'Övertygelse', suggestion: 'Change the word', word: 'persuasive' },
    { id: '9', type: 'Relevans', suggestion: 'Change the word', word: 'relevant' }
  ];

  const displaySuggestions = suggestions.length > 0 ? suggestions : mockSuggestions;

  // Group suggestions by type
  const groupedSuggestions = displaySuggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.type]) {
      acc[suggestion.type] = [];
    }
    acc[suggestion.type].push(suggestion);
    return acc;
  }, {} as Record<string, ReviewSuggestion[]>);

  const handleAccept = (suggestionId: string) => {
    console.log('Accepted suggestion:', suggestionId);
  };

  const handleDismiss = (suggestionId: string) => {
    console.log('Dismissed suggestion:', suggestionId);
  };

  const renderSuggestionsList = (suggestions: ReviewSuggestion[]) => (
    <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-300px)]">
      {suggestions.map((suggestion) => (
        <div 
          key={suggestion.id}
          className="bg-gray-50 rounded-lg p-3 border border-gray-200"
        >
          <div className="text-sm text-gray-600 mb-1">
            {suggestion.suggestion}
          </div>
          <div className="font-medium text-gray-900 mb-3">
            {suggestion.word}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleAccept(suggestion.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 h-8 text-sm rounded-md"
            >
              Accept
            </Button>
            <button
              onClick={() => handleDismiss(suggestion.id)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium px-2 py-1.5"
            >
              Dismiss
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-semibold text-gray-900 text-base">Review suggestions</h3>
        <div className="bg-yellow-400 text-black text-xs font-medium px-2 py-0.5 rounded-full min-w-[24px] h-5 flex items-center justify-center">
          {displaySuggestions.length}
        </div>
      </div>

      {/* Tabbed Interface */}
      <Tabs defaultValue="Relevans" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="Relevans" className="text-xs">Relevans</TabsTrigger>
          <TabsTrigger value="Originalitet" className="text-xs">Originalitet</TabsTrigger>
          <TabsTrigger value="Struktur" className="text-xs">Struktur</TabsTrigger>
          <TabsTrigger value="Övertygelse" className="text-xs">Övertygelse</TabsTrigger>
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
    </div>
  );
};
