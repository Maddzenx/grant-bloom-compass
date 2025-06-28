
import React from 'react';
import { Grant } from '@/types/grant';
import { SortOption } from '@/components/SortingControls';
import { EnhancedFilterOptions } from '@/hooks/useFilterState';
import DiscoverHeader from '@/components/DiscoverHeader';
import { EnhancedFilterControls } from '@/components/EnhancedFilterControls';
import GrantList from '@/components/GrantList';
import GrantDetailsPanel from '@/components/GrantDetailsPanel';
import { useIsMobile } from '@/hooks/use-mobile';

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
    <div className="h-screen bg-canvas-cloud flex flex-col w-full overflow-hidden">
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
      <div className="bg-accent-lavender-10 border-b border-accent-lavender">
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
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Layout */}
        {isMobile ? (
          <>
            {/* Show list when not viewing details */}
            {!showDetails && (
              <GrantList
                grants={searchResults}
                selectedGrant={selectedGrant}
                onGrantSelect={onGrantSelect}
                onToggleBookmark={onToggleBookmark}
                searchTerm={searchTerm}
                isMobile={true}
              />
            )}

            {/* Show details when viewing a grant */}
            {showDetails && selectedGrant && (
              <GrantDetailsPanel
                selectedGrant={selectedGrant}
                onToggleBookmark={onToggleBookmark}
                isMobile={true}
                onBackToList={onBackToList}
              />
            )}
          </>
        ) : (
          /* Desktop Layout */
          <>
            {/* Left Panel - Grant List */}
            <GrantList
              grants={searchResults}
              selectedGrant={selectedGrant}
              onGrantSelect={onGrantSelect}
              onToggleBookmark={onToggleBookmark}
              searchTerm={searchTerm}
              isMobile={false}
            />

            {/* Right Panel - Grant Details */}
            <GrantDetailsPanel
              selectedGrant={selectedGrant}
              onToggleBookmark={onToggleBookmark}
              isMobile={false}
            />
          </>
        )}
      </div>
    </div>
  );
};
