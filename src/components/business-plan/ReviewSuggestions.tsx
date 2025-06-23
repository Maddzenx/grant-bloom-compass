
import React from 'react';
import { Button } from '@/components/ui/button';

interface ReviewSuggestion {
  id: string;
  type: 'Correctness' | 'Clarity' | 'Completeness' | 'Style';
  suggestion: string;
  word: string;
}

interface ReviewSuggestionsProps {
  suggestions?: ReviewSuggestion[];
}

export const ReviewSuggestions: React.FC<ReviewSuggestionsProps> = ({ 
  suggestions = [] 
}) => {
  // Mock data matching the image design
  const mockSuggestions: ReviewSuggestion[] = [
    { id: '1', type: 'Correctness', suggestion: 'Change the word', word: 'deeply' },
    { id: '2', type: 'Correctness', suggestion: 'Change the word', word: 'deeply' },
    { id: '3', type: 'Correctness', suggestion: 'Change the word', word: 'deeply' },
    { id: '4', type: 'Correctness', suggestion: 'Change the word', word: 'deeply' },
    { id: '5', type: 'Correctness', suggestion: 'Change the word', word: 'deeply' },
    { id: '6', type: 'Correctness', suggestion: 'Change the word', word: 'deeply' },
    { id: '7', type: 'Correctness', suggestion: 'Change the word', word: 'deeply' },
    { id: '8', type: 'Correctness', suggestion: 'Change the word', word: 'deeply' },
    { id: '9', type: 'Correctness', suggestion: 'Change the word', word: 'deeply' }
  ];

  const displaySuggestions = suggestions.length > 0 ? suggestions : mockSuggestions;

  const handleAccept = (suggestionId: string) => {
    console.log('Accepted suggestion:', suggestionId);
  };

  const handleDismiss = (suggestionId: string) => {
    console.log('Dismissed suggestion:', suggestionId);
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-semibold text-gray-900 text-base">Review suggestions</h3>
        <div className="bg-yellow-400 text-black text-xs font-medium px-2 py-0.5 rounded-full min-w-[24px] h-5 flex items-center justify-center">
          {displaySuggestions.length}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-0 mb-4 border-b border-gray-200">
        <button className="px-3 py-2 text-sm font-medium text-gray-900 border-b-2 border-blue-600 bg-white">
          Correctness
        </button>
        <button className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 bg-white">
          Correctness
        </button>
        <button className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 bg-white">
          Correctness
        </button>
        <button className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 bg-white">
          Correctness
        </button>
      </div>

      {/* Suggestions List */}
      <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-200px)]">
        {displaySuggestions.map((suggestion, index) => (
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
    </div>
  );
};
