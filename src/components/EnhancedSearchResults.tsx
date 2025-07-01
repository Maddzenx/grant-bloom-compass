
import React from 'react';
import { SearchResult } from '@/utils/searchEngine/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Clock, TrendingUp, Users, AlertCircle } from 'lucide-react';

interface EnhancedSearchResultsProps {
  searchResult: SearchResult;
  onGrantSelect: (grant: any) => void;
  onFeedback: (feedback: any) => void;
}

export const EnhancedSearchResults: React.FC<EnhancedSearchResultsProps> = ({
  searchResult,
  onGrantSelect,
  onFeedback
}) => {
  const handleResultClick = (grant: any, index: number) => {
    onFeedback({
      type: 'click',
      target: grant.id,
      rating: 1
    });
    onGrantSelect(grant);
  };

  return (
    <div className="space-y-6">
      {/* Search Summary */}
      {searchResult.summary.answerText && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Search Summary</h3>
              <p className="text-blue-800">{searchResult.summary.answerText}</p>
              
              {searchResult.summary.keyFindings.length > 0 && (
                <div className="mt-3">
                  <h4 className="font-medium text-blue-900 mb-1">Key Findings:</h4>
                  <ul className="text-sm text-blue-700 list-disc list-inside">
                    {searchResult.summary.keyFindings.map((finding, index) => (
                      <li key={index}>{finding}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Search Clusters */}
      {searchResult.summary.clusters.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Result Categories
          </h3>
          <div className="flex flex-wrap gap-2">
            {searchResult.summary.clusters.map((cluster, index) => (
              <Badge key={index} variant="outline" className="px-3 py-1">
                {cluster.label} ({cluster.count})
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Search Results */}
      <div className="space-y-4">
        {searchResult.items.map((result, index) => (
          <Card 
            key={result.grant.id} 
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleResultClick(result.grant, index)}
          >
            <div className="space-y-3">
              {/* Header with confidence score */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {result.grant.title}
                  </h3>
                  <p className="text-sm text-gray-600">{result.grant.organization}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    className={`${
                      result.confidence > 0.8 ? 'bg-green-100 text-green-800' :
                      result.confidence > 0.6 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {Math.round(result.confidence * 100)}% match
                  </Badge>
                </div>
              </div>

              {/* Snippet */}
              <p className="text-gray-700">{result.snippet}</p>

              {/* Matched Fields */}
              {result.matchedFields.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {result.matchedFields.map((field, fieldIndex) => (
                    <Badge key={fieldIndex} variant="secondary" className="text-xs">
                      {field.field}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Reasoning */}
              {result.reasoning.length > 0 && (
                <div className="text-xs text-gray-500">
                  <details>
                    <summary className="cursor-pointer hover:text-gray-700">
                      Why this matches (click to expand)
                    </summary>
                    <ul className="mt-1 list-disc list-inside">
                      {result.reasoning.map((reason, reasonIndex) => (
                        <li key={reasonIndex}>{reason}</li>
                      ))}
                    </ul>
                  </details>
                </div>
              )}

              {/* Funding info */}
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-blue-600">
                  {result.grant.fundingAmount}
                </span>
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{result.grant.deadline}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Search Suggestions */}
      {searchResult.suggestions.length > 0 && (
        <Card className="p-4 bg-gray-50">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Search Suggestions
          </h3>
          <div className="space-y-2">
            {searchResult.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{suggestion.query}</span>
                <Badge variant="outline" className="text-xs">
                  {suggestion.type}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Search Metadata */}
      <div className="text-xs text-gray-500 text-center">
        Found {searchResult.items.length} results in {searchResult.processingTime}ms
        {searchResult.confidence < 0.5 && (
          <span className="text-yellow-600 ml-2">
            • Low confidence results, consider refining your search
          </span>
        )}
      </div>
    </div>
  );
};
