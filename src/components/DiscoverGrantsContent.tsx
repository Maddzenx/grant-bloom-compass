import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
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
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { Filter, X, MoreHorizontal, ExternalLink, Send, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import InterestPage from '@/components/InterestPage';

// Custom hook for swipe-down gesture detection with real-time movement
const useSwipeDown = (onSwipeDown: () => void, threshold = 100) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault(); // Prevent any default behavior for immediate response
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setCurrentY(e.touches[0].clientY);
    setTranslateY(0);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    
    e.preventDefault(); // Prevent default scroll for immediate response
    
    const currentYPos = e.touches[0].clientY;
    const deltaY = currentYPos - startY;
    
    // Real-time movement - always update position with requestAnimationFrame for smoothness
    requestAnimationFrame(() => {
      setCurrentY(currentYPos);
      setTranslateY(deltaY);
    });
  }, [isDragging, startY]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    
    const deltaY = currentY - startY;
    
    if (deltaY > threshold) {
      onSwipeDown();
    } else {
      // Spring back to original position with smooth animation
      setTranslateY(0);
    }
    
    setIsDragging(false);
  }, [isDragging, currentY, startY, threshold, onSwipeDown]);

  return {
    isDragging,
    translateY,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};

// SwipeableSheetContent component for mobile swipe-down functionality with real-time movement
const SwipeableSheetContent = ({ 
  children, 
  onSwipeDown 
}: { 
  children: React.ReactNode; 
  onSwipeDown: () => void; 
}) => {
  const {
    isDragging,
    translateY,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useSwipeDown(onSwipeDown);

  return (
    <div
      className="flex flex-col h-full"
      style={{
        transform: `translateY(${translateY}px)`,
        transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        willChange: 'transform'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
};

// FilterContent component copied from FilterBar to maintain original design
const FilterContent = ({
  filters,
  onFiltersChange,
  onResetFilters,
  organizationOptions,
  fundingRange,
  onFundingRangeChange,
  deadlineValue,
  onDeadlineChange,
  industryOptions,
  eligibleApplicantOptions,
  geographicScopeOptions,
  totalGrantsCount,
  onClose
}) => (
  <div className="flex flex-col h-full">
    <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-6">

      {/* Organization Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-gray-900">Organisation</h3>
          {filters.organizations?.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-2 py-1 h-auto" 
              onClick={() => onFiltersChange({ organizations: [] })}
            >
              Återställ
            </Button>
          )}
        </div>
        <div className="space-y-3">
          {organizationOptions.map(org => (
            <label key={org} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-md transition-colors">
              <input 
                type="checkbox" 
                className="h-4 w-4 rounded border-gray-300" 
                checked={filters.organizations?.includes(org)} 
                onChange={e => {
                  const newOrgs = e.target.checked 
                    ? [...(filters.organizations || []), org] 
                    : (filters.organizations || []).filter(o => o !== org);
                  onFiltersChange({ organizations: newOrgs });
                }} 
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{org}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Deadline Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-gray-900">Deadline</h3>
          {deadlineValue?.preset && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-2 py-1 h-auto" 
              onClick={() => onDeadlineChange({ type: 'preset', preset: '' })}
            >
              Återställ
            </Button>
          )}
        </div>
        <div className="relative">
          <select className="w-full bg-gray-50 border border-gray-200 rounded-lg text-sm p-3 appearance-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors">
            <option value="">Alla deadlines</option>
            <option value="urgent">Brådskande (7 dagar)</option>
            <option value="2weeks">Nästa 2 veckor</option>
            <option value="1month">Nästa månad</option>
            <option value="3months">Nästa 3 månader</option>
          </select>
        </div>
      </div>

      {/* Industry Sector Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-gray-900">Bransch</h3>
          {filters.industrySectors?.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-2 py-1 h-auto" 
              onClick={() => onFiltersChange({ industrySectors: [] })}
            >
              Återställ
            </Button>
          )}
        </div>
        <div className="space-y-3">
          {industryOptions.map(ind => (
            <label key={ind} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-md transition-colors">
              <input 
                type="checkbox" 
                className="h-4 w-4 rounded border-gray-300" 
                checked={filters.industrySectors?.includes(ind)} 
                onChange={e => {
                  const newInds = e.target.checked 
                    ? [...(filters.industrySectors || []), ind] 
                    : (filters.industrySectors || []).filter(i => i !== ind);
                  onFiltersChange({ industrySectors: newInds });
                }} 
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{ind}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Eligible Applicant Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-gray-900">Stödberättigad sökande</h3>
          {filters.eligibleApplicants?.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-2 py-1 h-auto" 
              onClick={() => onFiltersChange({ eligibleApplicants: [] })}
            >
              Återställ
            </Button>
          )}
        </div>
        <div className="space-y-3">
          {eligibleApplicantOptions.map(app => (
            <label key={app} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-md transition-colors">
              <input 
                type="checkbox" 
                className="h-4 w-4 rounded border-gray-300" 
                checked={filters.eligibleApplicants?.includes(app)} 
                onChange={e => {
                  const newApps = e.target.checked 
                    ? [...(filters.eligibleApplicants || []), app] 
                    : (filters.eligibleApplicants || []).filter(a => a !== app);
                  onFiltersChange({ eligibleApplicants: newApps });
                }} 
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{app}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Requirements Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-gray-900">Krav</h3>
          {(filters.consortiumRequired || filters.cofinancingRequired) && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-2 py-1 h-auto" 
              onClick={() => onFiltersChange({
                consortiumRequired: null,
                cofinancingRequired: null
              })}
            >
              Återställ
            </Button>
          )}
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-md transition-colors">
            <input 
              type="checkbox" 
              className="h-4 w-4 rounded border-gray-300" 
              checked={filters.consortiumRequired === true} 
              onChange={e => onFiltersChange({
                consortiumRequired: e.target.checked ? true : null
              })} 
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">Kræver consortium</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-md transition-colors">
            <input 
              type="checkbox" 
              className="h-4 w-4 rounded border-gray-300" 
              checked={filters.cofinancingRequired === true} 
              onChange={e => onFiltersChange({
                cofinancingRequired: e.target.checked ? true : null
              })} 
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">Kræver medfinansiering</span>
          </label>
        </div>
      </div>

      {/* Geographic Scope Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-gray-900">Region</h3>
          {filters.region?.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-2 py-1 h-auto" 
              onClick={() => onFiltersChange({ region: [] })}
            >
              Återställ
            </Button>
          )}
        </div>
        <div className="space-y-3">
          {geographicScopeOptions.map(scope => (
            <label key={scope} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-md transition-colors">
              <input 
                type="checkbox" 
                className="h-4 w-4 rounded border-gray-300" 
                checked={filters.region?.includes(scope)} 
                onChange={e => {
                  const newScopes = e.target.checked 
                    ? [...(filters.region || []), scope] 
                    : (filters.region || []).filter(s => s !== scope);
                  onFiltersChange({ region: newScopes });
                }} 
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{scope}</span>
            </label>
          ))}
        </div>
      </div>
    </div>

    {/* Footer - Fixed at bottom */}
    <div className="p-6 border-t border-gray-200 bg-white flex-shrink-0">
      <div className="w-full flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4">
        <Button 
          onClick={onResetFilters} 
          className="w-full sm:w-auto font-medium text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 px-6 py-3 rounded-lg transition-all duration-200"
        >
          Återställ alla filter
        </Button>
        <Button 
          onClick={onClose}
          className="w-full sm:w-auto text-white font-semibold text-sm px-8 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md" 
          style={{ backgroundColor: '#8B5CF6' }}
        >
          Visa {totalGrantsCount} resultat
        </Button>
      </div>
    </div>
  </div>
);

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
  allOrganizations?: string[]; // New prop for all organizations from database
  allEligibleApplicants?: string[]; // New prop for all eligible applicant types from database
  allRegions?: string[]; // New prop for all region options from database
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onClearSearch?: () => void;
  onSortChange: (sortBy: SortOption) => void;
  onFiltersChange: (filters: Partial<EnhancedFilterOptions>) => void;
  onClearFilters: () => void;
  onGrantSelect: (grant: GrantListItem) => void;
  onToggleBookmark: (grantId: string) => void;
  onBackToList: () => void;
  onPageChange?: (page: number) => void;
  isAISearch?: boolean;
  onToggleSearchMode?: (isAI: boolean) => void;
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
  allOrganizations = [], // New prop with default empty array
  allEligibleApplicants = [], // New prop with default empty array
  allRegions = [], // New prop with default empty array
  pagination,
  onSearchChange,
  onSearch,
  onClearSearch,
  onSortChange,
  onFiltersChange,
  onClearFilters,
  onGrantSelect,
  onToggleBookmark,
  onBackToList,
  onPageChange,
  isAISearch = false,
  onToggleSearchMode
}: DiscoverGrantsContentProps) => {
  const [showInterestPage, setShowInterestPage] = useState(false);
  const isMobile = useIsMobile();
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [detailsOpen, setDetailsOpen] = React.useState(false);

  // Use allOrganizations from database if available, otherwise fall back to extracting from grants
  const organizationOptions = useMemo(() => {
    if (allOrganizations && allOrganizations.length > 0) {
      return allOrganizations;
    }
    // Fallback to extracting from current grants if allOrganizations is not available
    return grants.map(g => g.organization).filter(Boolean).filter((org, idx, arr) => arr.indexOf(org) === idx).sort();
  }, [allOrganizations, grants]);

  // Extract unique industry sectors from grants
  const industryOptions = useMemo(() =>
    Array.from(new Set(grants.flatMap(g => g.industry_sectors || []))).sort(),
    [grants]
  );

  // Use allEligibleApplicants from database if available, otherwise fall back to extracting from grants
  const eligibleApplicantOptions = useMemo(() => {
    if (allEligibleApplicants && allEligibleApplicants.length > 0) {
      return allEligibleApplicants;
    }
    // Fallback to extracting from current grants if allEligibleApplicants is not available
    return Array.from(new Set(grants.flatMap(g => g.eligible_organisations || []))).sort();
  }, [allEligibleApplicants, grants]);

  // Use allRegions from database if available, otherwise fall back to extracting from grants
  const geographicScopeOptions = useMemo(() => {
    if (allRegions && allRegions.length > 0) {
      return allRegions;
    }
    // Fallback to extracting from current grants if allRegions is not available
    return Array.from(new Set(grants.flatMap(g => g.geographic_scope || []))).sort();
  }, [allRegions, grants]);

  // Sort grants based on selected sort option
  const sortedGrants = useMemo(() => sortGrants(searchResults, sortBy, searchTerm), [searchResults, sortBy, searchTerm]);

  return (
    <div className="flex flex-col w-full min-h-screen bg-canvas-cloud">
         {/* Purple background section for search component */}
         <div className="w-full" style={{ backgroundColor: '#D1C9FB' }}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-16">
          {/* Title section with better spacing */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 leading-tight tracking-tight mb-2">
              Sök bland {searchMetrics?.totalInDatabase || grants.length} bidrag
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Hitta bidrag som passar ditt projekt och din organisation
            </p>
          </div>
          
          {/* Search bar section with improved spacing */}
          <div className="w-full mb-4 max-w-4xl mx-auto">
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
              isAISearch={isAISearch}
              onToggleSearchMode={onToggleSearchMode}
              onClearSearch={onClearSearch}
            />
          </div>
          
          {/* Filter and sorting row with better organization */}
          <div className="flex flex-col gap-y-2 md:flex-row md:items-center md:justify-center md:gap-x-8 w-full">
            {/* Only show FilterBar on desktop */}
            {!isMobile && (
              <div className="flex-1 max-w-4xl">
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
            )}
          </div>
        </div>
      </div>
      {/* Sorting controls and pagination info */}
      <div className="max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Pagination Info */}
          {pagination && (
            <div className="flex items-center gap-2 text-xs text-base text-gray-600">
              <span>
                Visar {(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} av {pagination.total} bidrag
              </span>
            </div>
          )}

          {/* Sorting Controls */}
          <SortingControls 
            sortBy={sortBy} 
            onSortChange={onSortChange} 
            hasSearchTerm={!!searchTerm.trim()}
            hasSemanticMatches={!!aiMatches && aiMatches.length > 0}
          />
        </div>
      </div>
      {/* Floating filter button for mobile */}
      {isMobile && (
        <>
          <button
            className={`fixed z-50 bottom-4 right-4 rounded-full shadow-md flex items-center justify-center w-12 h-12 active:scale-95 transition-all ${
              hasActiveFilters 
                ? 'bg-purple-600 text-white' 
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
            onClick={() => setFilterOpen(true)}
            aria-label="Open filters"
          >
            <Filter className="w-6 h-6" />
            {hasActiveFilters && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">!</span>
              </div>
            )}
          </button>
          <Drawer open={filterOpen} onOpenChange={setFilterOpen}>
            <DrawerContent className="h-[90%] bg-white flex flex-col">
              <DrawerHeader className="flex justify-between items-center p-4 border-b flex-shrink-0">
                <DrawerTitle>Filter</DrawerTitle>
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8">
                    <X className="w-6 h-6" />
                  </Button>
                </DrawerClose>
              </DrawerHeader>
              <div className="flex-1 overflow-y-auto">
                <FilterContent
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
                  onClose={() => setFilterOpen(false)}
                />
              </div>
            </DrawerContent>
          </Drawer>
        </>
      )}
      {/* Main Content Area - Full width with natural scrolling */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 pb-8 relative">
        {/* Backend Loading Overlay */}
        {isBackendFetching && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-20 flex items-start justify-center pt-12 animate-fade-in">
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
              onGrantSelect={grant => { 
                // If clicking on already selected grant, minimize details
                if (selectedGrant && selectedGrant.id === grant.id) {
                  setDetailsOpen(false);
                  onBackToList();
                } else {
                  onGrantSelect(grant); 
                  setDetailsOpen(true); 
                }
              }} 
              onToggleBookmark={onToggleBookmark} 
              searchTerm={searchTerm} 
              isMobile={true} 
              aiMatches={aiMatches}
              pagination={pagination}
              onPageChange={onPageChange}
            />
            <Sheet open={detailsOpen && !!selectedGrant} onOpenChange={open => { setDetailsOpen(open); if (!open) onBackToList(); }}>
              <SwipeableSheetContent 
                onSwipeDown={() => { setDetailsOpen(false); onBackToList(); }}
              >
                <SheetContent side="bottom" className="max-h-[92vh] rounded-t-2xl p-0 flex flex-col animate-slideInUp pointer-events-none">
                  {/* Mobile menu in left corner (same level as close icon) */}
                  {isMobile && (
                    <div className="absolute z-10 w-20 h-20 p-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="lg" className="h-25 w-26 p-2">
                             <MoreHorizontal className="h-9 w-9 text-black" />
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          align="start" 
                          className="bg-white border border-gray-200 shadow-lg rounded-lg p-1 min-w-[200px]"
                          sideOffset={8}
                        >
                          <DropdownMenuItem 
                            onClick={() => {
                              if (selectedGrant && 'originalUrl' in selectedGrant && typeof selectedGrant.originalUrl === 'string') {
                                window.open(selectedGrant.originalUrl, '_blank', 'noopener,noreferrer');
                              }
                            }}
                            className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer"
                          >
                            Läs mer om bidraget
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              navigator.clipboard.writeText(window.location.href);
                              toast.success("Länk kopierad till urklipp!");
                            }}
                            className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer"
                          >
                            Dela bidrag
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setShowInterestPage(true);
                            }}
                            className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer"
                          >
                            Påbörja ansökan
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
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
              </SwipeableSheetContent>
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
      
      {/* Interest Page Modal */}
      {showInterestPage && (
        <InterestPage onClose={() => setShowInterestPage(false)} />
      )}
    </div>
  );
};
