
import React from 'react';
import { Grant } from '@/types/grant';
import { EnhancedFilterOptions } from '@/hooks/useFilterState';
import { OrganizationMultiSelect } from '../OrganizationMultiSelect';
import { FundingRangeSlider } from '../FundingRangeSlider';
import { EnhancedDeadlineFilter } from '../EnhancedDeadlineFilter';

interface FilterGridProps {
  pendingFilters: EnhancedFilterOptions;
  onPendingFilterChange: (filters: Partial<EnhancedFilterOptions>) => void;
  organizationOptions: { value: string; label: string; count: number }[];
  grants: Grant[];
  grantsInFundingRange: number;
  filteredGrants: Grant[];
}

export const FilterGrid = ({
  pendingFilters,
  onPendingFilterChange,
  organizationOptions,
  grants,
  grantsInFundingRange,
  filteredGrants,
}: FilterGridProps) => {
  return (
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
            onPendingFilterChange({ organizations: selected })
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
          onChange={(range) => onPendingFilterChange({ fundingRange: range })}
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
          onChange={(deadline) => onPendingFilterChange({ deadline })}
          grantsCount={filteredGrants.length}
        />
      </div>
    </div>
  );
};
