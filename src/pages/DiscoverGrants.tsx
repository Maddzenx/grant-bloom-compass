
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useGrants } from "@/hooks/useGrants";
import { Grant } from "@/types/grant";
import { useEnhancedSearch } from "@/hooks/useEnhancedSearch";
import { useFilterState } from "@/hooks/useFilterState";
import { SortOption } from "@/components/SortingControls";
import DiscoverHeader from "@/components/DiscoverHeader";
import { EnhancedFilterControls } from "@/components/EnhancedFilterControls";
import GrantList from "@/components/GrantList";
import GrantDetailsPanel from "@/components/GrantDetailsPanel";
import { useIsMobile } from "@/hooks/use-mobile";

const DiscoverGrants = () => {
  const {
    data: grants = [],
    isLoading,
    error,
    isError,
    refetch
  } = useGrants();
  
  const isMobile = useIsMobile();
  
  console.log('DiscoverGrants render state:', { 
    grantsCount: grants?.length || 0, 
    isLoading, 
    error: error?.message, 
    isError 
  });
  
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("none");
  const [bookmarkedGrants, setBookmarkedGrants] = useState<Set<string>>(new Set());
  const [showDetails, setShowDetails] = useState(false);

  // Enhanced filter state
  const {
    filters,
    updateFilters,
    clearFilters,
    hasActiveFilters,
  } = useFilterState();

  // Apply filters to grants
  const filteredGrants = useMemo(() => {
    return grants.filter(grant => {
      // Organization filter
      if (filters.organizations.length > 0) {
        if (!filters.organizations.includes(grant.organization)) {
          return false;
        }
      }

      // Funding range filter
      if (filters.fundingRange.min !== null || filters.fundingRange.max !== null) {
        const amount = parseFundingAmount(grant.fundingAmount);
        if (filters.fundingRange.min && amount < filters.fundingRange.min) return false;
        if (filters.fundingRange.max && amount > filters.fundingRange.max) return false;
      }

      // Deadline filter
      if (filters.deadline.preset || filters.deadline.customRange?.start) {
        if (!isGrantWithinDeadline(grant, filters.deadline)) {
          return false;
        }
      }

      // Tags filter
      if (filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag =>
          grant.tags.some(grantTag => grantTag.toLowerCase().includes(tag.toLowerCase()))
        );
        if (!hasMatchingTag) return false;
      }

      return true;
    });
  }, [grants, filters]);

  // Enhanced search hook
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    suggestions,
    searchMetrics,
    isSearching,
  } = useEnhancedSearch({
    grants: filteredGrants,
    filters: { organization: '', minFunding: '', maxFunding: '', deadline: '' }, // Legacy format for compatibility
    sortBy,
  });

  const toggleBookmark = useCallback((grantId: string) => {
    setBookmarkedGrants(prev => {
      const newSet = new Set(prev);
      if (newSet.has(grantId)) {
        newSet.delete(grantId);
      } else {
        newSet.add(grantId);
      }
      return newSet;
    });
  }, []);

  // Auto-select first grant when grants are loaded or search changes
  useEffect(() => {
    if (searchResults.length > 0 && !selectedGrant) {
      console.log('Auto-selecting first grant:', searchResults[0]);
      setSelectedGrant(searchResults[0]);
    } else if (searchResults.length > 0 && selectedGrant && !searchResults.find(g => g.id === selectedGrant.id)) {
      console.log('Current selection not in filtered results, selecting first filtered grant');
      setSelectedGrant(searchResults[0]);
    } else if (searchResults.length === 0) {
      console.log('No grants available, clearing selection');
      setSelectedGrant(null);
    }
  }, [searchResults, selectedGrant]);

  const handleGrantSelect = useCallback((grant: Grant) => {
    console.log('Grant selected:', grant);
    setSelectedGrant(grant);
    if (isMobile) {
      setShowDetails(true);
    }
  }, [isMobile]);

  const handleToggleBookmark = useCallback((grantId: string) => {
    toggleBookmark(grantId);
  }, [toggleBookmark]);

  const handleRefresh = useCallback(() => {
    console.log('Refreshing grants data...');
    refetch();
  }, [refetch]);

  const handleBackToList = useCallback(() => {
    setShowDetails(false);
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f4ec] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600 mb-2">Laddar bidrag...</div>
          <div className="text-sm text-gray-500">Hämtar data från databasen...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (isError || error) {
    console.error('Error state:', { isError, error });
    return (
      <div className="min-h-screen bg-[#f8f4ec] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-lg text-red-600 mb-2">Problem med att ladda bidrag</div>
          <div className="text-sm text-gray-600 mb-4">
            {error?.message || 'Ett oväntat fel inträffade vid hämtning av data'}
          </div>
          <div className="space-x-2">
            <button 
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Försök igen
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Ladda om sidan
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show no data state
  if (!isLoading && (!grants || grants.length === 0)) {
    console.log('No data state - grants:', grants);
    return (
      <div className="min-h-screen bg-[#f8f4ec] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-lg text-gray-600 mb-2">Inga bidrag hittades</div>
          <div className="text-sm text-gray-500 mb-4">Det finns för närvarande inga bidrag tillgängliga i databasen</div>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Uppdatera data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#f8f4ec] flex flex-col w-full overflow-hidden">
      {/* Enhanced Search Header */}
      <DiscoverHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalGrants={searchResults.length}
        suggestions={suggestions}
        isSearching={isSearching}
        searchMetrics={searchMetrics}
      />

      {/* Enhanced Filter Controls */}
      <EnhancedFilterControls
        filters={filters}
        onFiltersChange={updateFilters}
        onClearAll={clearFilters}
        grants={grants}
        filteredGrants={searchResults}
        hasActiveFilters={hasActiveFilters}
      />

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
                bookmarkedGrants={bookmarkedGrants}
                onGrantSelect={handleGrantSelect}
                onToggleBookmark={handleToggleBookmark}
                searchTerm={searchTerm}
                isMobile={true}
              />
            )}

            {/* Show details when viewing a grant */}
            {showDetails && selectedGrant && (
              <GrantDetailsPanel
                selectedGrant={selectedGrant}
                bookmarkedGrants={bookmarkedGrants}
                onToggleBookmark={handleToggleBookmark}
                isMobile={true}
                onBackToList={handleBackToList}
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
              bookmarkedGrants={bookmarkedGrants}
              onGrantSelect={handleGrantSelect}
              onToggleBookmark={handleToggleBookmark}
              searchTerm={searchTerm}
              isMobile={false}
            />

            {/* Right Panel - Grant Details */}
            <GrantDetailsPanel
              selectedGrant={selectedGrant}
              bookmarkedGrants={bookmarkedGrants}
              onToggleBookmark={handleToggleBookmark}
              isMobile={false}
            />
          </>
        )}
      </div>
    </div>
  );
};

// Helper functions
const parseFundingAmount = (fundingAmount: string): number => {
  const match = fundingAmount.match(/(\d+(?:[.,]\d+)?)\s*M?SEK/i);
  if (match) {
    const amount = parseFloat(match[1].replace(',', '.'));
    return fundingAmount.includes('M') ? amount * 1000000 : amount;
  }
  
  const numbers = fundingAmount.match(/\d+(?:\s*\d+)*/g);
  if (!numbers) return 0;
  
  const firstNumber = numbers[0].replace(/\s/g, '');
  return parseInt(firstNumber, 10) || 0;
};

const isGrantWithinDeadline = (grant: Grant, deadlineFilter: any): boolean => {
  if (grant.deadline === 'Ej specificerat') return false;
  
  // Parse Swedish date format
  const months: { [key: string]: number } = {
    'januari': 0, 'februari': 1, 'mars': 2, 'april': 3, 'maj': 4, 'juni': 5,
    'juli': 6, 'augusti': 7, 'september': 8, 'oktober': 9, 'november': 10, 'december': 11
  };
  
  const parts = grant.deadline.toLowerCase().split(' ');
  if (parts.length < 3) return false;
  
  const day = parseInt(parts[0], 10);
  const month = months[parts[1]];
  const year = parseInt(parts[2], 10);
  
  if (isNaN(day) || month === undefined || isNaN(year)) return false;
  
  const deadlineDate = new Date(year, month, day);
  const today = new Date();
  
  if (deadlineFilter.type === 'preset' && deadlineFilter.preset) {
    const presetDays: { [key: string]: number } = {
      'urgent': 7,
      '2weeks': 14,
      '1month': 30,
      '3months': 90,
      '6months': 180,
      '1year': 365,
    };
    
    const days = presetDays[deadlineFilter.preset];
    if (days) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + days);
      return deadlineDate >= today && deadlineDate <= targetDate;
    }
  }
  
  if (deadlineFilter.type === 'custom' && deadlineFilter.customRange) {
    const { start, end } = deadlineFilter.customRange;
    if (start && deadlineDate < start) return false;
    if (end && deadlineDate > end) return false;
    return true;
  }
  
  return true;
};

export default DiscoverGrants;
