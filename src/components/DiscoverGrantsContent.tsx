import React, { useMemo } from 'react';
import { Grant } from '@/types/grant';
import { SortOption } from '@/components/SortingControls';
import { EnhancedFilterOptions } from '@/hooks/useFilterState';
import DiscoverHeader from '@/components/DiscoverHeader';
import { EnhancedFilterControls } from '@/components/EnhancedFilterControls';
import GrantList from '@/components/GrantList';
import GrantDetailsPanel from '@/components/GrantDetailsPanel';
import { useIsMobile } from '@/hooks/use-mobile';
import { AIGrantMatch } from '@/hooks/useAIGrantSearch';
import { FilterBar } from './FilterBar';
import SortingControls from '@/components/SortingControls';
import { sortGrants } from '@/utils/grantSorting';

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

  // Extract unique organizations from grants
  const organizationOptions = useMemo(() =>
    grants.map(g => g.organization).filter(Boolean).filter((org, idx, arr) => arr.indexOf(org) === idx).sort(),
    [grants]
  );

  // Extract unique industry sectors from grants
  const industryOptions = useMemo(() =>
    Array.from(new Set(grants.flatMap(g => g.industry_sectors || []))).sort(),
    [grants]
  );

  // Extract unique eligible applicant types from grants
  const eligibleApplicantOptions = useMemo(() =>
    Array.from(new Set(grants.flatMap(g => g.eligible_organisations || []))).sort(),
    [grants]
  );

  // Extract unique geographic scopes from grants
  const geographicScopeOptions = useMemo(() =>
    Array.from(new Set(grants.flatMap(g => g.geographic_scope || []))).sort(),
    [grants]
  );

  // Sort grants based on selected sort option
  const sortedGrants = useMemo(() => sortGrants(searchResults, sortBy, searchTerm), [searchResults, sortBy, searchTerm]);

  return (
    <div className="flex flex-col w-full min-h-screen bg-canvas-cloud">
      {/* Search bar and filter/sort row grouped, left-aligned with main content */}
      <div className="w-full bg-canvas-cloud pt-6 pb-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
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
          {/* Filter and sorting row */}
          <div className="flex flex-row items-center justify-between w-full mt-0 gap-x-8">
            <div className="flex-1 min-w-0">
              <FilterBar
                filters={filters}
                onFiltersChange={onFiltersChange}
                onResetFilters={onClearFilters}
                organizationOptions={organizationOptions}
                fundingRange={filters.fundingRange}
                onFundingRangeChange={range => onFiltersChange({ fundingRange: range })}
                deadlineValue={filters.deadline}
                onDeadlineChange={val => onFiltersChange({ deadline: val })}
                industryOptions={industryOptions}
                eligibleApplicantOptions={eligibleApplicantOptions}
                geographicScopeOptions={geographicScopeOptions}
              />
            </div>
            <div className="w-auto ml-auto flex-shrink-0">
              <SortingControls sortBy={sortBy} onSortChange={onSortChange} />
            </div>
          </div>
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
                grants={sortedGrants} 
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
                grants={sortedGrants} 
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
                <div className="sticky top-0 h-[calc(100vh-0rem)]">
                  <GrantDetailsPanel 
                    selectedGrant={selectedGrant} 
                    onToggleBookmark={onToggleBookmark} 
                    isMobile={false} 
                    onBackToList={onBackToList}
                    sortBy={sortBy}
                    onSortChange={onSortChange}
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
