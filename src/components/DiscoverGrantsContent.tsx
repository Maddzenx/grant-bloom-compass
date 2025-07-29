import React, { useMemo } from 'react';
import { GrantListItem } from '@/types/grant';
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
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Filter, X } from 'lucide-react';

interface DiscoverGrantsContentProps {
  grants: GrantListItem[];
  searchResults: GrantListItem[];
  selectedGrant: GrantListItem | null;
  showDetails: boolean;
  searchTerm: string;
  sortBy: SortOption;
  filters: EnhancedFilterOptions;
  hasActiveFilters: boolean;
  suggestions: string[];
  isSearching: boolean;
  isBackendFetching?: boolean;
  searchMetrics: any;
  aiMatches?: AIGrantMatch[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onSortChange: (sortBy: SortOption) => void;
  onFiltersChange: (filters: Partial<EnhancedFilterOptions>) => void;
  onClearFilters: () => void;
  onGrantSelect: (grant: GrantListItem) => void;
  onToggleBookmark: (grantId: string) => void;
  onBackToList: () => void;
  onPageChange?: (page: number) => void;
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
  isBackendFetching = false,
  searchMetrics,
  aiMatches,
  pagination,
  onSearchChange,
  onSearch,
  onSortChange,
  onFiltersChange,
  onClearFilters,
  onGrantSelect,
  onToggleBookmark,
  onBackToList,
  onPageChange
}: DiscoverGrantsContentProps) => {
  const isMobile = useIsMobile();
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [detailsOpen, setDetailsOpen] = React.useState(false);

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
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
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
          <div className="flex flex-col gap-y-2 md:flex-row md:items-center md:justify-between md:gap-x-8 w-full mt-0">
            <div className="flex-1 min-w-0 overflow-x-auto">
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
                totalGrantsCount={searchResults.length}
              />
            </div>
            {/* Sorting controls: below filter bar on mobile, right on desktop */}
            <div className="w-full md:w-auto md:ml-auto flex-shrink-0">
              <SortingControls 
                sortBy={sortBy} 
                onSortChange={onSortChange} 
                hasSearchTerm={!!searchTerm.trim()}
                hasSemanticMatches={!!aiMatches && aiMatches.length > 0}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Floating filter button for mobile */}
      {isMobile && (
        <>
          <button
            className="fixed z-50 bottom-5 right-5 bg-black text-white rounded-full shadow-lg flex items-center justify-center w-14 h-14 active:scale-95 transition-all"
            style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.18)' }}
            onClick={() => setFilterOpen(true)}
            aria-label="Open filters"
          >
            <Filter className="w-7 h-7" />
          </button>
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetContent side="bottom" className="max-h-[90vh] rounded-t-2xl p-0 flex flex-col">
              <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b border-gray-200">
                <span className="text-lg font-semibold">Filter</span>
                <button onClick={() => setFilterOpen(false)} className="p-2 rounded-full hover:bg-canvas-bg">
                  <span className="sr-only">Close</span>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 pb-24 pt-2">
                <EnhancedFilterControls
                  filters={filters}
                  onFiltersChange={onFiltersChange}
                  onClearAll={onClearFilters}
                  grants={grants}
                  filteredGrants={searchResults}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex gap-2 px-4 py-4 z-50">
                <button
                  className="flex-1 bg-canvas-bg text-black rounded-full py-3 font-medium text-base active:scale-95 transition-all"
                  onClick={() => { onClearFilters(); setFilterOpen(false); }}
                >
                  Clear all
                </button>
                <button
                  className="flex-1 bg-black text-white rounded-full py-3 font-medium text-base active:scale-95 transition-all"
                  onClick={() => setFilterOpen(false)}
                >
                  Show {searchResults.length}
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </>
      )}
      {/* Main Content Area - Full width with natural scrolling */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 pb-8 relative">
        {/* Backend Loading Overlay */}
        {isBackendFetching && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-40 flex items-start justify-center pt-12 animate-fade-in">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 px-6 py-4 flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-sm font-medium text-gray-700">Uppdaterar resultat...</span>
            </div>
          </div>
        )}
        {/* Mobile Layout */}
        {isMobile ? (
          <>
            {/* Show list always, details as modal sheet */}
            <GrantList 
              grants={sortedGrants} 
              selectedGrant={selectedGrant} 
              onGrantSelect={grant => { onGrantSelect(grant); setDetailsOpen(true); }} 
              onToggleBookmark={onToggleBookmark} 
              searchTerm={searchTerm} 
              isMobile={true} 
              aiMatches={aiMatches}
              pagination={pagination}
              onPageChange={onPageChange}
            />
            <Sheet open={detailsOpen && !!selectedGrant} onOpenChange={open => { setDetailsOpen(open); if (!open) onBackToList(); }}>
              <SheetContent side="bottom" className="max-h-[92vh] rounded-t-2xl p-0 flex flex-col animate-slideInUp pointer-events-none">
                <div className="flex flex-col items-center pt-3 pb-2 pointer-events-auto">
                  <div className="w-12 h-1.5 rounded-full bg-gray-300 mb-2" />
                </div>
                <div className="flex-1 overflow-y-auto px-0 pb-4 pointer-events-auto">
                  <GrantDetailsPanel 
                    selectedGrant={selectedGrant} 
                    onToggleBookmark={onToggleBookmark} 
                    isMobile={true} 
                    onBackToList={() => { setDetailsOpen(false); onBackToList(); }} 
                  />
                </div>
              </SheetContent>
            </Sheet>
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
                pagination={pagination}
                onPageChange={onPageChange}
              />
            </div>

            {/* Grant Details Panel - Sticky and full viewport height */}
            {showDetails && selectedGrant && (
              <div className="w-2/3 min-w-0">
                <div className="sticky top-16 h-[calc(100vh-4rem)]">
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
