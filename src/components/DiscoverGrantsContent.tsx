
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
  onSearch: () => void;
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
  onSearch,
  onSortChange,
  onFiltersChange,
  onClearFilters,
  onGrantSelect,
  onToggleBookmark,
  onBackToList,
}: DiscoverGrantsContentProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="h-screen bg-canvas-cloud flex flex-col w-full overflow-hidden">
      {/* Enhanced Search Header with horizontal padding */}
      <div className="px-4 sm:px-6 lg:px-8">
        <DiscoverHeader
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          onSearch={onSearch}
          sortBy={sortBy}
          onSortChange={onSortChange}
          totalGrants={searchResults.length}
          suggestions={suggestions}
          isSearching={isSearching}
          searchMetrics={searchMetrics}
        />
      </div>

      {/* Enhanced Filter Controls with horizontal padding */}
      <div className="bg-accent-lavender-10 border-b border-accent-lavender px-4 sm:px-6 lg:px-8">
        <EnhancedFilterControls
          filters={filters}
          onFiltersChange={onFiltersChange}
          onClearAll={onClearFilters}
          grants={grants}
          filteredGrants={searchResults}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Main Content Area with horizontal padding */}
      <div className="flex flex-1 overflow-hidden px-4 sm:px-6 lg:px-8">
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
            <div className="flex-1">
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
  );
};
