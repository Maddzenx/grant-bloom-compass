import React from 'react';
import { Grant } from '@/types/grant';
import { EnhancedFilterOptions } from '@/hooks/useFilterState';
import { OrganizationMultiSelect } from '../OrganizationMultiSelect';
import { FundingRangeSlider } from '../FundingRangeSlider';
import { EnhancedDeadlineFilter } from '../EnhancedDeadlineFilter';
import { MultiSelect } from '../MultiSelect';
import { Switch } from '../ui/switch';
import { Info } from 'lucide-react';
import { Button } from '../ui/button';
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../ui/tooltip';

interface FilterGridProps {
  pendingFilters: EnhancedFilterOptions;
  onPendingFilterChange: (filters: Partial<EnhancedFilterOptions>) => void;
  organizationOptions: { value: string; label: string; count: number }[];
  grants: Grant[];
  grantsInFundingRange: number;
  filteredGrants: Grant[];
  hasActiveFilters?: boolean;
  onClearAll?: () => void;
}

// Helper to extract unique values from grants
const getUniqueValues = (grants: Grant[], field: keyof Grant): string[] => {
  const values = new Set<string>();
  grants.forEach(grant => {
    const value = grant[field];
    if (Array.isArray(value)) {
      value.forEach(v => values.add(v));
    } else if (value && typeof value === 'string') {
      values.add(value);
    }
  });
  return Array.from(values).filter(Boolean);
};

// Helper for selected count label
const selectedCountLabel = (selected: string[], label: string) => selected.length > 0 ? `${label} (${selected.length})` : label;

export const FilterGrid = ({
  pendingFilters,
  onPendingFilterChange,
  organizationOptions,
  grants,
  grantsInFundingRange,
  filteredGrants,
  hasActiveFilters,
  onClearAll,
}: FilterGridProps) => {
  const industrySectorOptions = getUniqueValues(grants, 'industry_sectors');
  const eligibleApplicantOptions = getUniqueValues(grants, 'eligible_organisations');
  const geographicScopeOptions = getUniqueValues(grants, 'geographic_scope');
  const tagOptions = getUniqueValues(grants, 'tags');

  return (
    <TooltipProvider>
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
              <MultiSelect
                options={eligibleApplicantOptions}
                value={pendingFilters.eligibleApplicants}
                onValueChange={vals => onPendingFilterChange({ eligibleApplicants: vals })}
                placeholder="Select applicants..."
              />
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
              <MultiSelect
                options={industrySectorOptions}
                value={pendingFilters.industrySectors}
                onValueChange={vals => onPendingFilterChange({ industrySectors: vals })}
                placeholder="Select sectors..."
              />
            </div>
            {/* Geographic Scope Filter */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                {selectedCountLabel(pendingFilters.geographicScope, 'Geographic Scope')}
              </label>
              <MultiSelect
                options={geographicScopeOptions}
                value={pendingFilters.geographicScope}
                onValueChange={vals => onPendingFilterChange({ geographicScope: vals })}
                placeholder="Select scope..."
              />
            </div>
            {/* Tags/Keywords Filter */}
            <div className="space-y-1 col-span-2">
              <label className="text-xs font-medium text-gray-700">
                {selectedCountLabel(pendingFilters.tags, 'Tags/Keywords')}
              </label>
              <MultiSelect
                options={tagOptions}
                value={pendingFilters.tags}
                onValueChange={vals => onPendingFilterChange({ tags: vals })}
                placeholder="Select tags..."
              />
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
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3 h-3 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Filter grants that require a consortium or collaboration.</p>
                  </TooltipContent>
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
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3 h-3 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Filter grants that require own funding or co-financing.</p>
                  </TooltipContent>
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
    </TooltipProvider>
  );
};
