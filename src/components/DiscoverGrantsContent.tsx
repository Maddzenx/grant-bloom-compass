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
  onBackToList
}: DiscoverGrantsContentProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col w-full min-h-screen bg-canvas-cloud">
      {/* Enhanced Search Header */}
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

      {/* Enhanced Filter Controls */}
      <div className="bg-canvas-cloud">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EnhancedFilterControls 
            filters={filters} 
            onFiltersChange={onFiltersChange} 
            onClearAll={onClearFilters} 
            grants={grants} 
            filteredGrants={searchResults} 
            hasActiveFilters={hasActiveFilters} 
          />
        </div>
      </div>

      {/* Main Content Area - Full width with natural scrolling */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-8 relative">
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
                aiMatches={aiMatches} 
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
          /* Desktop Layout - Split panel with sticky details */
          <div className="flex gap-4 h-full">
            {/* Grant List - Full width when no details, 1/3 width when details shown */}
            <div className={`transition-all duration-300 ${
              showDetails ? 'w-1/3 min-w-0' : 'w-full'
            }`}>
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

            {/* Grant Details Panel - Sticky and full viewport height */}
            {showDetails && selectedGrant && (
              <div className="w-2/3 min-w-0">
                <div className="sticky top-24 h-[calc(100vh-6rem)]">
                  <GrantDetailsPanel 
                    selectedGrant={selectedGrant} 
                    onToggleBookmark={onToggleBookmark} 
                    isMobile={false} 
                    onBackToList={onBackToList} 
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
