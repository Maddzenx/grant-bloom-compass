import React from 'react';
import { Grant } from '@/types/grant';
import { EnhancedFilterOptions } from '@/hooks/useFilterState';
import { OrganizationMultiSelect } from '../OrganizationMultiSelect';
import { FundingRangeSlider } from '../FundingRangeSlider';
import { EnhancedDeadlineFilter } from '../EnhancedDeadlineFilter';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Info } from 'lucide-react';
import { Button } from '../ui/button';
import { Tooltip } from '../ui/tooltip';

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

// Helper for selected count label
const selectedCountLabel = (selected, label) => selected.length > 0 ? `${label} (${selected.length})` : label;

export const FilterGrid = ({
  pendingFilters,
  onPendingFilterChange,
  organizationOptions,
  grants,
  grantsInFundingRange,
  filteredGrants,
  hasActiveFilters,
  onClearAll,
}: FilterGridProps & { hasActiveFilters?: boolean; onClearAll?: () => void }) => {
  const industrySectorOptions = getUniqueValues(grants, 'industry_sectors');
  const eligibleApplicantOptions = getUniqueValues(grants, 'eligible_organisations');
  const geographicScopeOptions = getUniqueValues(grants, 'geographic_scope');

  return (
    <div className="space-y-6">
      {/* Sticky result count and clear all */}
      <div className="flex items-center justify-between sticky top-0 z-10 bg-white py-2 border-b border-gray-100">
        <span className="text-xs font-medium text-gray-700">{filteredGrants.length} results found</span>
        {hasActiveFilters && onClearAll && (
          <Button size="sm" variant="ghost" onClick={onClearAll} className="text-xs text-gray-600 border border-gray-200 px-2 py-1 rounded hover:bg-gray-50">Clear all filters</Button>
        )}
      </div>

      {/* Applicant Section */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wider">Applicant</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Organizations Filter */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">
              {selectedCountLabel(pendingFilters.organizations, 'Organizations')}
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
          {/* Eligible Applicants Filter */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">
              {selectedCountLabel(pendingFilters.eligibleApplicants, 'Eligible Applicants')}
            </label>
            <Select
              multiple
              value={pendingFilters.eligibleApplicants}
              onValueChange={vals => onPendingFilterChange({ eligibleApplicants: vals })}
              aria-label="Eligible Applicants"
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
        </div>
      </div>
      <hr className="my-2 border-gray-200" />

      {/* Project Section */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wider">Project</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Industry Sectors Filter */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">
              {selectedCountLabel(pendingFilters.industrySectors, 'Industry Sectors')}
            </label>
            <Select
              multiple
              value={pendingFilters.industrySectors}
              onValueChange={vals => onPendingFilterChange({ industrySectors: vals })}
              aria-label="Industry Sectors"
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
          {/* Geographic Scope Filter */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">
              {selectedCountLabel(pendingFilters.geographicScope, 'Geographic Scope')}
            </label>
            <Select
              multiple
              value={pendingFilters.geographicScope}
              onValueChange={vals => onPendingFilterChange({ geographicScope: vals })}
              aria-label="Geographic Scope"
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
        </div>
      </div>
      <hr className="my-2 border-gray-200" />

      {/* Requirements Section */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wider">Requirements</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Consortium Requirement Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
              Consortium Required
              <Tooltip content="Filter grants that require a consortium or collaboration.">
                <Info className="w-3 h-3 text-gray-400" />
              </Tooltip>
            </label>
            <Switch
              checked={pendingFilters.consortiumRequired === true}
              onCheckedChange={val => onPendingFilterChange({ consortiumRequired: val ? true : null })}
              aria-label="Consortium Required"
            />
            <span className="text-xs text-gray-500 ml-2">{pendingFilters.consortiumRequired ? 'Required' : 'Not Required'}</span>
          </div>
          {/* Co-financing Requirement Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
              Co-financing Required
              <Tooltip content="Filter grants that require own funding or co-financing.">
                <Info className="w-3 h-3 text-gray-400" />
              </Tooltip>
            </label>
            <Switch
              checked={pendingFilters.cofinancingRequired === true}
              onCheckedChange={val => onPendingFilterChange({ cofinancingRequired: val ? true : null })}
              aria-label="Co-financing Required"
            />
            <span className="text-xs text-gray-500 ml-2">{pendingFilters.cofinancingRequired ? 'Required' : 'Not Required'}</span>
          </div>
        </div>
      </div>
      <hr className="my-2 border-gray-200" />

      {/* Funding & Deadline Section */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wider">Funding & Deadline</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Funding Range Filter */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Funding Amount</label>
            <FundingRangeSlider
              value={pendingFilters.fundingRange}
              onChange={(range) => onPendingFilterChange({ fundingRange: range })}
              totalGrants={grants.length}
              grantsInRange={grantsInFundingRange}
            />
          </div>
          {/* Deadline Filter */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Application Deadline</label>
            <EnhancedDeadlineFilter
              value={pendingFilters.deadline}
              onChange={(deadline) => onPendingFilterChange({ deadline })}
              grantsCount={filteredGrants.length}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
