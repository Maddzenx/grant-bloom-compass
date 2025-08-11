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
  return <div className="flex flex-col h-full" style={{
    transform: `translateY(${translateY}px)`,
    transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    willChange: 'transform'
  }} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      {children}
    </div>;
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
}) => <div className="flex flex-col h-full">
    <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-6">

      {/* Organization Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-gray-900">Organisation{filters.organizations?.length ? ` (${filters.organizations.length})` : ''}</h3>
          {filters.organizations?.length > 0 && <Button variant="ghost" size="sm" className="text-xs text-[#7D54F4] hover:bg-[#E5DEFD] px-2 py-1 h-auto" onClick={() => onFiltersChange({
          organizations: []
        })}>
              Återställ
            </Button>}
        </div>
        <div className="space-y-3">
          {organizationOptions.map(org => <label key={org} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-md transition-colors">
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300" checked={filters.organizations?.includes(org)} onChange={e => {
            const newOrgs = e.target.checked ? [...(filters.organizations || []), org] : (filters.organizations || []).filter(o => o !== org);
            onFiltersChange({
              organizations: newOrgs
            });
          }} />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{org}</span>
            </label>)}
        </div>
      </div>

      {/* Deadline Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-gray-900">Deadline{deadlineValue?.preset || deadlineValue?.type === 'custom' ? ' (1)' : ''}</h3>
          {deadlineValue?.preset && <Button variant="ghost" size="sm" className="text-xs px-2 py-1 h-auto hover:bg-[#E5DEFD] text-[#7D54F4]" onClick={() => onDeadlineChange({
          type: 'preset',
          preset: ''
        })}>
              Återställ
            </Button>}
        </div>
        <div className="relative">
          <select className="w-full bg-gray-50 border border-gray-200 rounded-lg text-sm p-3 appearance-none focus:ring-2 focus:ring-[#7D54F4] focus:border-[#7D54F4] transition-colors">
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
          <h3 className="text-base font-semibold text-gray-900">Bransch{filters.industrySectors?.length ? ` (${filters.industrySectors.length})` : ''}</h3>
          {filters.industrySectors?.length > 0 && <Button variant="ghost" size="sm" className="text-xs px-2 py-1 h-auto hover:bg-[#E5DEFD] text-[#7D54F4]" onClick={() => onFiltersChange({
          industrySectors: []
        })}>
              Återställ
            </Button>}
        </div>
        <div className="space-y-3">
          {industryOptions.map(ind => <label key={ind} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-md transition-colors">
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300" checked={filters.industrySectors?.includes(ind)} onChange={e => {
            const newInds = e.target.checked ? [...(filters.industrySectors || []), ind] : (filters.industrySectors || []).filter(i => i !== ind);
            onFiltersChange({
              industrySectors: newInds
            });
          }} />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{ind}</span>
            </label>)}
        </div>
      </div>

      {/* Eligible Applicant Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-gray-900">Stödberättigad sökande{filters.eligibleApplicants?.length ? ` (${filters.eligibleApplicants.length})` : ''}</h3>
          {filters.eligibleApplicants?.length > 0 && <Button variant="ghost" size="sm" className="text-xs text-[#7D54F4] hover:bg-[#E5DEFD] px-2 py-1 h-auto" onClick={() => onFiltersChange({
          eligibleApplicants: []
        })}>
              Återställ
            </Button>}
        </div>
        <div className="space-y-3">
          {eligibleApplicantOptions.map(app => <label key={app} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-md transition-colors">
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300" checked={filters.eligibleApplicants?.includes(app)} onChange={e => {
            const newApps = e.target.checked ? [...(filters.eligibleApplicants || []), app] : (filters.eligibleApplicants || []).filter(a => a !== app);
            onFiltersChange({
              eligibleApplicants: newApps
            });
          }} />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{app}</span>
            </label>)}
        </div>
      </div>

      {/* Requirements Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-gray-900">Krav{filters.consortiumRequired || filters.cofinancingRequired ? ' (1)' : ''}</h3>
          {(filters.consortiumRequired || filters.cofinancingRequired) && <Button variant="ghost" size="sm" className="text-xs text-[#7D54F4] hover:bg-[#E5DEFD] px-2 py-1 h-auto" onClick={() => onFiltersChange({
          consortiumRequired: null,
          cofinancingRequired: null
        })}>
              Återställ
            </Button>}
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-md transition-colors">
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300" checked={filters.consortiumRequired === true} onChange={e => onFiltersChange({
            consortiumRequired: e.target.checked ? true : null
          })} />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">Kräver konsortium</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-md transition-colors">
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300" checked={filters.cofinancingRequired === true} onChange={e => onFiltersChange({
            cofinancingRequired: e.target.checked ? true : null
          })} />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">Kräver medfinansiering</span>
          </label>
        </div>
      </div>

      {/* Geographic Scope Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-gray-900">Region{filters.region?.length ? ` (${filters.region.length})` : ''}</h3>
          {filters.region?.length > 0 && <Button variant="ghost" size="sm" className="text-xs text-[#7D54F4] hover:bg-[#E5DEFD] px-2 py-1 h-auto" onClick={() => onFiltersChange({
          region: []
        })}>
              Återställ
            </Button>}
        </div>
        <div className="space-y-3">
          {geographicScopeOptions.map(scope => <label key={scope} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-md transition-colors">
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300" checked={filters.region?.includes(scope)} onChange={e => {
            const newScopes = e.target.checked ? [...(filters.region || []), scope] : (filters.region || []).filter(s => s !== scope);
            onFiltersChange({
              region: newScopes
            });
          }} />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{scope}</span>
            </label>)}
        </div>
      </div>
    </div>

    {/* Footer - Fixed at bottom */}
    <div className="p-6 border-t border-gray-200 bg-white flex-shrink-0">
      <div className="w-full flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4">
        <Button onClick={onResetFilters} className="w-full sm:w-auto font-medium text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 px-6 py-3 rounded-lg transition-all duration-200">
          Återställ alla filter
        </Button>
        <Button onClick={onClose} className="w-full sm:w-auto text-white font-semibold text-sm px-8 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md" style={{
        backgroundColor: '#7D54F4'
      }}>
          Visa {totalGrantsCount} resultat
        </Button>
      </div>
    </div>
  </div>;
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
  allOrganizations = [],
  // New prop with default empty array
  allEligibleApplicants = [],
  // New prop with default empty array
  allRegions = [],
  // New prop with default empty array
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
  const [listScrollTop, setListScrollTop] = React.useState<number | null>(null);

  // Use allOrganizations from database if available, otherwise fall back to extracting from grants
  const organizationOptions = useMemo(() => {
    if (allOrganizations && allOrganizations.length > 0) {
      return allOrganizations;
    }
    // Fallback to extracting from current grants if allOrganizations is not available
    return grants.map(g => g.organization).filter(Boolean).filter((org, idx, arr) => arr.indexOf(org) === idx).sort();
  }, [allOrganizations, grants]);

  // Extract unique industry sectors from grants
  const industryOptions = useMemo(() => Array.from(new Set(grants.flatMap(g => g.industry_sectors || []))).sort(), [grants]);

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

  // Last updated timestamp (updates when fetching/searching completes)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
  useEffect(() => {
    if (!isBackendFetching && !isSearching) {
      setLastUpdated(new Date());
    }
  }, [isBackendFetching, isSearching, sortedGrants.length]);

  // Active filter count for compact summary (approximation)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    count += filters.organizations?.length || 0;
    count += filters.industrySectors?.length || 0;
    count += filters.eligibleApplicants?.length || 0;
    count += filters.region?.length || 0;
    if (filters.deadline && (filters.deadline.preset || filters.deadline.type === 'custom')) count += 1;
    if (filters.consortiumRequired === true) count += 1;
    if (filters.cofinancingRequired === true) count += 1;
    return count;
  }, [filters]);
  return <div className="flex flex-col w-full min-h-screen bg-canvas-cloud">
         {/* Background section for search component (brand-tinted subtle) */}
         <div className="w-full border-b border-zinc-200" style={{
      backgroundColor: '#F3EFFD'
    }}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-12 md:py-20">
          {/* Title section with better spacing */}
          <div className="mb-8 text-center">
            <h1 className="type-display text-zinc-900 leading-tight tracking-tight mb-2 font-['Source_Sans_3']">
              Sök bland {searchMetrics?.totalInDatabase || grants.length} bidrag
            </h1>
            {/* Subtitle */}
            <p className="type-body md:type-title text-zinc-700 max-w-2xl mx-auto font-['Source_Sans_3']">
              Hitta bidrag som passar ditt projekt och din organisation
            </p>
            {lastUpdated && (
              <p className="text-sm text-zinc-500 mt-2">
                Senast uppdaterad: {lastUpdated.toLocaleDateString('sv-SE')} {lastUpdated.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
          
          {/* Search bar section with improved spacing */}
          <div className="w-full mb-4 max-w-4xl mx-auto" role="search" aria-label="Sök bidrag">
            <DiscoverHeader searchTerm={searchTerm} onSearchChange={onSearchChange} onSearch={onSearch} sortBy={sortBy} onSortChange={onSortChange} totalGrants={searchResults.length} suggestions={suggestions} isSearching={isSearching} searchMetrics={searchMetrics} isAISearch={isAISearch} onToggleSearchMode={onToggleSearchMode} onClearSearch={onClearSearch} />
          </div>

          {/* Compact active filter summary under sticky search (mobile) */}
          {isMobile && activeFilterCount > 0 && <div className="w-full mb-3 max-w-4xl mx-auto px-1">
              <button onClick={() => setFilterOpen(true)} className="w-full flex items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white hover:bg-zinc-50 py-2" aria-label={`Aktiva filter: ${activeFilterCount}`}>
                <span className="type-secondary text-zinc-700">Aktiva filter:</span>
                <span className="inline-flex items-center justify-center min-w-[1.75rem] h-7 px-2 rounded-full bg-zinc-100 text-zinc-800 type-body">
                  {activeFilterCount}
                </span>
              </button>
            </div>}
            
          {/* Filter and sorting row with better organization */}
          <div className="flex flex-col gap-y-2 md:flex-row md:items-center md:justify-center md:gap-x-8 w-full">
            {/* Only show FilterBar on desktop */}
            {!isMobile && <div className="flex-1 max-w-4xl">
                <FilterBar filters={filters} onFiltersChange={onFiltersChange} onResetFilters={onClearFilters} organizationOptions={organizationOptions} fundingRange={filters.fundingRange} onFundingRangeChange={range => onFiltersChange({
              fundingRange: range
            })} deadlineValue={filters.deadline} onDeadlineChange={val => onFiltersChange({
              deadline: val
            })} industryOptions={industryOptions} eligibleApplicantOptions={eligibleApplicantOptions} geographicScopeOptions={geographicScopeOptions} totalGrantsCount={searchResults.length} />
              </div>}
          </div>
        </div>
      </div>
      {/* Sorting controls and pagination info */}
      <div className="max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Pagination Info */}
          {pagination && <div className="flex items-center gap-3">
              <span className="type-body text-gray-600">
                Visar {(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} av {pagination.total} bidrag
              </span>
              {hasActiveFilters && <button className="type-secondary text-[#7D54F4] hover:opacity-90 underline" onClick={onClearFilters} aria-label="Rensa alla filter">
                  Rensa alla
                </button>}
            </div>}

          {/* Sorting Controls */}
          <SortingControls sortBy={sortBy} onSortChange={onSortChange} hasSearchTerm={!!searchTerm.trim()} hasSemanticMatches={!!aiMatches && aiMatches.length > 0} />
        </div>
      </div>
      {/* Floating filter button for mobile */}
      {isMobile && <>
          <button className={`fixed z-50 right-4 rounded-full shadow-md flex items-center justify-center w-12 h-12 active:scale-95 transition-all ${hasActiveFilters ? 'bg-[#7D54F4] text-white' : 'bg-white text-gray-600 border border-gray-200'}`} style={{
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)'
      }} onClick={() => setFilterOpen(true)} aria-label="Open filters">
            <Filter className="w-5 h-5" />
            {hasActiveFilters && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">!</span>
              </div>}
          </button>
          <Drawer open={filterOpen} onOpenChange={setFilterOpen}>
            <DrawerContent className="h-[90%] bg-white flex flex-col">
              <SwipeableSheetContent onSwipeDown={() => setFilterOpen(false)}>
                <DrawerHeader className="flex justify-between items-center p-4 border-b flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <DrawerTitle>Filter</DrawerTitle>
                    <Button variant="ghost" size="sm" className="type-secondary" onClick={onClearFilters}>Rensa alla</Button>
                  </div>
                  <DrawerClose asChild>
                    <Button variant="ghost" size="icon" aria-label="Stäng"> 
                      <X className="h-5 w-5" />
                    </Button>
                  </DrawerClose>
                </DrawerHeader>
                <div className="flex-1 overflow-y-auto p-4">
                  <FilterContent filters={filters} onFiltersChange={onFiltersChange} onResetFilters={onClearFilters} organizationOptions={organizationOptions} fundingRange={filters.fundingRange} onFundingRangeChange={range => onFiltersChange({
                fundingRange: range
              })} deadlineValue={filters.deadline} onDeadlineChange={val => onFiltersChange({
                deadline: val
              })} industryOptions={industryOptions} eligibleApplicantOptions={eligibleApplicantOptions} geographicScopeOptions={geographicScopeOptions} totalGrantsCount={searchResults.length} onClose={() => setFilterOpen(false)} />
                </div>
              </SwipeableSheetContent>
            </DrawerContent>
          </Drawer>
        </>}
      {/* Main Content Area - Full width with natural scrolling */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 pb-8 relative">
        {/* Backend Loading Overlay */}
        {isBackendFetching && <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-20 flex items-start justify-center pt-12 animate-fade-in">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 px-6 py-4 flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#7D54F4]"></div>
              <span className="text-sm font-medium text-gray-700">Uppdaterar resultat...</span>
            </div>
          </div>}
        {/* Mobile Layout */}
        {isMobile ? <>
            {/* Show list always, details as modal sheet */}
            <GrantList grants={sortedGrants} selectedGrant={selectedGrant} onGrantSelect={grant => {
          // If clicking on already selected grant, minimize details
          if (selectedGrant && selectedGrant.id === grant.id) {
            setDetailsOpen(false);
            onBackToList();
          } else {
            onGrantSelect(grant);
            setDetailsOpen(true);
          }
        }} onToggleBookmark={onToggleBookmark} searchTerm={searchTerm} isMobile={true} aiMatches={aiMatches} pagination={pagination} onPageChange={onPageChange} isLoadingList={Boolean(isSearching || isBackendFetching)} onScrollPositionChange={top => setListScrollTop(top)} restoreScrollTop={listScrollTop} />
            <Sheet open={detailsOpen && !!selectedGrant} onOpenChange={open => {
          setDetailsOpen(open);
          if (!open) onBackToList();
        }}>
              <SwipeableSheetContent onSwipeDown={() => {
            setDetailsOpen(false);
            onBackToList();
          }}>
                                  <SheetContent side="bottom" className="max-h-[92vh] rounded-t-2xl p-0 flex flex-col animate-slideInUp">
                  {/* Mobile menu in left corner (same level as close icon) */}
                  {isMobile && <div className="absolute z-10 w-20 h-20 p-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="lg" className="h-25 w-26 p-2">
                             <MoreHorizontal className="h-9 w-9 text-black" />
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="bg-white border border-gray-200 shadow-lg rounded-lg p-1 min-w-[200px]" sideOffset={8}>
                          <DropdownMenuItem onClick={() => {
                      if (selectedGrant && 'originalUrl' in selectedGrant && typeof selectedGrant.originalUrl === 'string') {
                        window.open(selectedGrant.originalUrl, '_blank', 'noopener,noreferrer');
                      }
                    }} className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer">
                            Läs mer om bidraget
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Länk kopierad till urklipp!");
                    }} className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer">
                            Dela bidrag
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                      setShowInterestPage(true);
                    }} className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer">
                            Påbörja ansökan
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>}
                  <div className="flex flex-col items-center pt-3 pb-2 pointer-events-auto">
                    <div className="w-12 h-1.5 rounded-full bg-gray-300 mb-2" />
                  </div>
                  <div className="flex-1 overflow-y-auto px-0 pb-4 pointer-events-auto">
                    <GrantDetailsPanel selectedGrant={selectedGrant} onToggleBookmark={onToggleBookmark} isMobile={true} onBackToList={() => {
                  setDetailsOpen(false);
                  onBackToList();
                }} />
                  </div>
                </SheetContent>
              </SwipeableSheetContent>
            </Sheet>
          </> : (/* Desktop Layout - Split panel with sticky details */
      <div className="flex gap-4 h-full">
            {/* Grant List - Full width when no details, 1/3 width when details shown */}
            <div className={`transition-all duration-300 ${showDetails ? 'w-1/3 min-w-0' : 'w-full'}`}>
              <GrantList grants={sortedGrants} selectedGrant={selectedGrant} onGrantSelect={onGrantSelect} onToggleBookmark={onToggleBookmark} searchTerm={searchTerm} isMobile={false} aiMatches={aiMatches} pagination={pagination} onPageChange={onPageChange} isLoadingList={Boolean(isSearching || isBackendFetching)} onScrollPositionChange={top => setListScrollTop(top)} restoreScrollTop={listScrollTop} />
            </div>

            {/* Grant Details Panel - Sticky and full viewport height */}
            {showDetails && selectedGrant && <div className="w-2/3 min-w-0">
                <div className="sticky top-16 h-[calc(100vh-4rem)]">
                  <GrantDetailsPanel selectedGrant={selectedGrant} onToggleBookmark={onToggleBookmark} isMobile={false} onBackToList={() => {
              onBackToList();
            }} sortBy={sortBy} onSortChange={onSortChange} />
                </div>
              </div>}
          </div>)}
      </div>
      
      {/* Interest Page Modal */}
      {showInterestPage && <InterestPage onClose={() => setShowInterestPage(false)} />}
    </div>;
};