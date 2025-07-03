import React from 'react';
import { Grant } from '@/types/grant';
import { EnhancedFilterOptions } from '@/hooks/useFilterState';
import { OrganizationMultiSelect } from '../OrganizationMultiSelect';
import { FundingRangeSlider } from '../FundingRangeSlider';
import { EnhancedDeadlineFilter } from '../EnhancedDeadlineFilter';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../ui/select';
import { Toggle } from '../ui/toggle';

interface FilterGridProps {
  pendingFilters: EnhancedFilterOptions;
  onPendingFilterChange: (filters: Partial<EnhancedFilterOptions>) => void;
  organizationOptions: { value: string; label: string; count: number }[];
  grants: Grant[];
  grantsInFundingRange: number;
  filteredGrants: Grant[];
}

// Helper to extract unique values from grants
const getUniqueValues = (grants, field) => {
  const values = new Set();
  grants.forEach(grant => {
    if (Array.isArray(grant[field])) {
      grant[field].forEach(v => values.add(v));
    } else if (grant[field]) {
      values.add(grant[field]);
    }
  });
  return Array.from(values).filter(Boolean);
};

export const FilterGrid = ({
  pendingFilters,
  onPendingFilterChange,
  organizationOptions,
  grants,
  grantsInFundingRange,
  filteredGrants,
}: FilterGridProps) => {
  const industrySectorOptions = getUniqueValues(grants, 'industry_sectors');
  const eligibleApplicantOptions = getUniqueValues(grants, 'eligible_organisations');
  const geographicScopeOptions = getUniqueValues(grants, 'geographic_scope');

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

      {/* Industry Sectors Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Industry Sectors</label>
        <Select
          multiple
          value={pendingFilters.industrySectors}
          onValueChange={vals => onPendingFilterChange({ industrySectors: vals })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select sectors..." />
          </SelectTrigger>
          <SelectContent>
            {industrySectorOptions.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Eligible Applicants Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Eligible Applicants</label>
        <Select
          multiple
          value={pendingFilters.eligibleApplicants}
          onValueChange={vals => onPendingFilterChange({ eligibleApplicants: vals })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select applicants..." />
          </SelectTrigger>
          <SelectContent>
            {eligibleApplicantOptions.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Consortium Requirement Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Consortium Required</label>
        <Toggle
          pressed={pendingFilters.consortiumRequired === true}
          onPressedChange={val => onPendingFilterChange({ consortiumRequired: val ? true : null })}
          className="w-full"
        >
          {pendingFilters.consortiumRequired ? 'Required' : 'Not Required'}
        </Toggle>
      </div>

      {/* Geographic Scope Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Geographic Scope</label>
        <Select
          multiple
          value={pendingFilters.geographicScope}
          onValueChange={vals => onPendingFilterChange({ geographicScope: vals })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select scope..." />
          </SelectTrigger>
          <SelectContent>
            {geographicScopeOptions.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Co-financing Requirement Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Co-financing Required</label>
        <Toggle
          pressed={pendingFilters.cofinancingRequired === true}
          onPressedChange={val => onPendingFilterChange({ cofinancingRequired: val ? true : null })}
          className="w-full"
        >
          {pendingFilters.cofinancingRequired ? 'Required' : 'Not Required'}
        </Toggle>
      </div>
    </div>
  );
};
