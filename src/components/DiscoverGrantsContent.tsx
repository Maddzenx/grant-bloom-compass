
import React from 'react';
import { Grant } from '@/types/grant';
import { SortOption } from '@/components/SortingControls';
import { EnhancedFilterOptions } from '@/hooks/useFilterState';
import DiscoverHeader from '@/components/DiscoverHeader';
import { EnhancedFilterControls } from '@/components/EnhancedFilterControls';
import GrantList from '@/components/GrantList';
import GrantDetailsPanel from '@/components/GrantDetailsPanel';
import { useIsMobile } from '@/hooks/use-mobile';
import { AIGrantMatch } from '@/hooks/useAIGrantSearch';

interface DiscoverGrantsContentProps {
  grants: Grant[];
  searchResults: Grant[];
  selectedGrant: Grant | null;
  showDetails: boolean;
  searchTerm: string;
  sortBy: SortOption;
  filters: EnhancedFilterOptions;
  hasActiveFilters: boolean;
  suggestions: string[];
  isSearching: boolean;
  searchMetrics: any;
  aiMatches?: AIGrantMatch[];
  onSearchChange: (value: string) => void;
  onSortChange: (sortBy: SortOption) => void;
  onFiltersChange: (filters: Partial<EnhancedFilterOptions>) => void;
  onClearFilters: () => void;
  onGrantSelect: (grant: Grant) => void;
  onToggleBookmark: (grantId: string) => void;
  onBackToList: () => void;
}

export const DiscoverGrantsContent = ({
  grants,
  searchResults,
  selectedGrant,
  showDetails,
  searchTerm,
  sortBy,
  filters,
  hasActiveFilters,
  suggestions,
  isSearching,
  searchMetrics,
  aiMatches,
  onSearchChange,
  onSortChange,
  onFiltersChange,
  onClearFilters,
  onGrantSelect,
  onToggleBookmark,
  onBackToList,
}: DiscoverGrantsContentProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-white">
      {/* Main container with proper padding */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        {/* Enhanced Search Header */}
        <DiscoverHeader
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          sortBy={sortBy}
          onSortChange={onSortChange}
          totalGrants={searchResults.length}
          suggestions={suggestions}
          isSearching={isSearching}
          searchMetrics={searchMetrics}
        />

        {/* Enhanced Filter Controls */}
        <div className="mb-6">
          <EnhancedFilterControls
            filters={filters}
            onFiltersChange={onFiltersChange}
            onClearAll={onClearFilters}
            grants={grants}
            filteredGrants={searchResults}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex gap-6">
          {/* Mobile Layout */}
          {isMobile ? (
            <>
              {/* Show list when not viewing details */}
              {!showDetails && (
                <div className="w-full">
                  <GrantList
                    grants={searchResults}
                    selectedGrant={selectedGrant}
                    onGrantSelect={onGrantSelect}
                    onToggleBookmark={onToggleBookmark}
                    searchTerm={searchTerm}
                    isMobile={true}
                    aiMatches={aiMatches}
                  />
                </div>
              )}

              {/* Show details when viewing a grant */}
              {showDetails && selectedGrant && (
                <div className="w-full">
                  <GrantDetailsPanel
                    selectedGrant={selectedGrant}
                    onToggleBookmark={onToggleBookmark}
                    isMobile={true}
                    onBackToList={onBackToList}
                  />
                </div>
              )}
            </>
          ) : (
            /* Desktop Layout */
            <>
              {/* Left Panel - Grant List */}
              <div className="w-[400px] flex-shrink-0">
                <GrantList
                  grants={searchResults}
                  selectedGrant={selectedGrant}
                  onGrantSelect={onGrantSelect}
                  onToggleBookmark={onToggleBookmark}
                  searchTerm={searchTerm}
                  isMobile={false}
                  aiMatches={aiMatches}
                />
              </div>

              {/* Right Panel - Grant Details */}
              <div className="flex-1">
                <GrantDetailsPanel
                  selectedGrant={selectedGrant}
                  onToggleBookmark={onToggleBookmark}
                  isMobile={false}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
