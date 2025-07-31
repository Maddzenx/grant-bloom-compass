import React, { useState, useMemo } from "react";
import { GrantListItem } from "@/types/grant";
import { EnhancedFilterOptions } from "@/hooks/useFilterState";
import { FilterChips } from "./FilterChips";
import { FilterHeader } from "./filters/FilterHeader";
import { FilterGrid } from "./filters/FilterGrid";
import { FilterActions } from "./filters/FilterActions";
import { parseFundingAmount, calculateActiveFilterCount, processOrganizationOptions } from "@/utils/filterHelpers";

interface EnhancedFilterControlsProps {
  filters: EnhancedFilterOptions;
  onFiltersChange: (filters: Partial<EnhancedFilterOptions>) => void;
  onClearAll: () => void;
  grants: GrantListItem[];
  filteredGrants: GrantListItem[];
  hasActiveFilters: boolean;
}

export const EnhancedFilterControls = ({
  filters,
  onFiltersChange,
  onClearAll,
  grants,
  filteredGrants,
  hasActiveFilters
}: EnhancedFilterControlsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [pendingFilters, setPendingFilters] = useState<EnhancedFilterOptions>(filters);

  // Process organizations with grant counts
  const organizationOptions = useMemo(() => processOrganizationOptions(grants), [grants]);

  // Calculate grants in current funding range
  const grantsInFundingRange = useMemo(() => {
    if (!pendingFilters.fundingRange.min && !pendingFilters.fundingRange.max) {
      return grants.length;
    }
    return grants.filter(grant => {
      const amount = parseFundingAmount(grant.fundingAmount);
      const min = pendingFilters.fundingRange.min;
      const max = pendingFilters.fundingRange.max;
      if (min && amount < min) return false;
      if (max && amount > max) return false;
      return true;
    }).length;
  }, [grants, pendingFilters.fundingRange]);

  const handleRemoveFilter = (filterType: string, value?: string) => {
    switch (filterType) {
      case 'organizations':
        if (value) {
          onFiltersChange({
            organizations: filters.organizations.filter(org => org !== value)
          });
        }
        break;
      case 'fundingRange':
        onFiltersChange({
          fundingRange: {
            min: null,
            max: null
          }
        });
        break;
      case 'deadline':
        onFiltersChange({
          deadline: {
            type: 'preset',
            preset: ''
          }
        });
        break;
      case 'tags':
        if (value) {
          onFiltersChange({
            tags: filters.tags.filter(tag => tag !== value)
          });
        }
        break;
    }
  };

  const handlePendingFilterChange = (newFilters: Partial<EnhancedFilterOptions>) => {
    setPendingFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const handleApplyFilters = () => {
    onFiltersChange(pendingFilters);
  };

  const handleClearFilters = () => {
    const defaultFilters: EnhancedFilterOptions = {
      organizations: [],
      fundingRange: {
        min: null,
        max: null
      },
      deadline: {
        type: 'preset',
        preset: ''
      },
      tags: [],
      industrySectors: [],
      eligibleApplicants: [],
      consortiumRequired: null,
      geographicScope: [],
      cofinancingRequired: null,
      statusFilter: '',
    };
    setPendingFilters(defaultFilters);
    onClearAll();
  };

  const hasPendingChanges = useMemo(() => {
    return JSON.stringify(filters) !== JSON.stringify(pendingFilters);
  }, [filters, pendingFilters]);

  const activeFilterCount = calculateActiveFilterCount(filters);

  return <div className="border border-gray-200 rounded-lg shadow-lg bg-white max-w-6xl mx-auto overflow-hidden">
      {/* Filter chips */}
      {hasActiveFilters && <FilterChips filters={filters} onRemoveFilter={handleRemoveFilter} onClearAll={onClearAll} organizations={organizationOptions} className="mb-0" />}

      {/* Header with expand/collapse toggle */}
      <FilterHeader isExpanded={isExpanded} onToggleExpanded={() => setIsExpanded(!isExpanded)} hasActiveFilters={hasActiveFilters} filteredCount={filteredGrants.length} totalCount={grants.length} activeFilterCount={activeFilterCount} className="mb-0" />

      {/* Filter controls - only show when expanded */}
      {isExpanded && <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
          <FilterGrid pendingFilters={pendingFilters} onPendingFilterChange={handlePendingFilterChange} organizationOptions={organizationOptions} grants={grants} grantsInFundingRange={grantsInFundingRange} filteredGrants={filteredGrants} hasActiveFilters={hasActiveFilters} onClearAll={onClearAll} compact />

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <FilterActions hasPendingChanges={hasPendingChanges} onApplyFilters={handleApplyFilters} onClearFilters={handleClearFilters} compact />
          </div>
        </div>}
    </div>;
};
