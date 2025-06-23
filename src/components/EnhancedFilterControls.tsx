
import React, { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Grant } from "@/types/grant";
import { EnhancedFilterOptions } from "@/hooks/useFilterState";
import { OrganizationMultiSelect } from "./OrganizationMultiSelect";
import { FundingRangeSlider } from "./FundingRangeSlider";
import { EnhancedDeadlineFilter } from "./EnhancedDeadlineFilter";
import { FilterChips } from "./FilterChips";

interface EnhancedFilterControlsProps {
  filters: EnhancedFilterOptions;
  onFiltersChange: (filters: Partial<EnhancedFilterOptions>) => void;
  onClearAll: () => void;
  grants: Grant[];
  filteredGrants: Grant[];
  hasActiveFilters: boolean;
}

export const EnhancedFilterControls = ({
  filters,
  onFiltersChange,
  onClearAll,
  grants,
  filteredGrants,
  hasActiveFilters,
}: EnhancedFilterControlsProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [pendingFilters, setPendingFilters] = useState<EnhancedFilterOptions>(filters);

  // Process organizations with grant counts
  const organizationOptions = useMemo(() => {
    const orgCounts = grants.reduce((acc, grant) => {
      acc[grant.organization] = (acc[grant.organization] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(orgCounts)
      .map(([org, count]) => ({
        value: org,
        label: org,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [grants]);

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
          fundingRange: { min: null, max: null }
        });
        break;
      case 'deadline':
        onFiltersChange({
          deadline: { type: 'preset', preset: '' }
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
    setPendingFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleApplyFilters = () => {
    onFiltersChange(pendingFilters);
  };

  const handleClearFilters = () => {
    const defaultFilters: EnhancedFilterOptions = {
      organizations: [],
      fundingRange: { min: null, max: null },
      deadline: { type: 'preset', preset: '' },
      tags: [],
    };
    setPendingFilters(defaultFilters);
    onClearAll();
  };

  const hasPendingChanges = useMemo(() => {
    return JSON.stringify(filters) !== JSON.stringify(pendingFilters);
  }, [filters, pendingFilters]);

  return (
    <div className="border-b border-gray-200" style={{ backgroundColor: '#f8f4ec' }}>
      {/* Filter chips */}
      {hasActiveFilters && (
        <FilterChips
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={onClearAll}
          organizations={organizationOptions}
        />
      )}

      {/* Header with expand/collapse toggle */}
      <div className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-gray-900 hover:text-gray-700 p-0 h-auto font-semibold"
          >
            <Filter className="w-4 h-4" />
            <h3>Enhanced Filters</h3>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
          
          <div className="text-sm text-muted-foreground">
            {filteredGrants.length} of {grants.length} grants
          </div>
        </div>

        {/* Show active filter count when minimized */}
        {!isExpanded && hasActiveFilters && (
          <div className="mt-1 text-xs text-gray-500">
            {[
              filters.organizations.length,
              filters.fundingRange.min || filters.fundingRange.max ? 1 : 0,
              filters.deadline.preset || filters.deadline.customRange?.start ? 1 : 0,
              filters.tags.length
            ].reduce((sum, count) => sum + count, 0)} active filters
          </div>
        )}
      </div>

      {/* Filter controls - only show when expanded */}
      {isExpanded && (
        <div className="p-4 pt-3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Organizations Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Organizations
              </label>
              <OrganizationMultiSelect
                organizations={organizationOptions}
                selectedOrganizations={pendingFilters.organizations}
                onSelectionChange={(selected) =>
                  handlePendingFilterChange({ organizations: selected })
                }
                placeholder="Select organizations..."
              />
            </div>

            {/* Funding Range Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Funding Amount
              </label>
              <FundingRangeSlider
                value={pendingFilters.fundingRange}
                onChange={(range) => handlePendingFilterChange({ fundingRange: range })}
                totalGrants={grants.length}
                grantsInRange={grantsInFundingRange}
              />
            </div>

            {/* Deadline Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Application Deadline
              </label>
              <EnhancedDeadlineFilter
                value={pendingFilters.deadline}
                onChange={(deadline) => handlePendingFilterChange({ deadline })}
                grantsCount={filteredGrants.length}
              />
            </div>
          </div>

          {/* Apply/Clear Filter Buttons */}
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Clear Filters
            </Button>
            <Button
              size="sm"
              onClick={handleApplyFilters}
              disabled={!hasPendingChanges}
              className="flex items-center gap-2"
            >
              Apply Filters
              {hasPendingChanges && (
                <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                  New
                </span>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to parse funding amounts
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
