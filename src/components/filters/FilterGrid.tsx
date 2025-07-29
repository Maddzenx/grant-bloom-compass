
import React from 'react';
import { Grant, GrantListItem } from '@/types/grant';
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
  grants: GrantListItem[];
  grantsInFundingRange: number;
  filteredGrants: GrantListItem[];
  hasActiveFilters?: boolean;
  onClearAll?: () => void;
  compact?: boolean;
}

// Helper to extract unique values from grants
const getUniqueValues = (grants: GrantListItem[], field: keyof GrantListItem): string[] => {
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
  compact = false,
}: FilterGridProps) => {
  const industrySectorOptions = getUniqueValues(grants, 'industry_sectors');
  const eligibleApplicantOptions = getUniqueValues(grants, 'eligible_organisations');
  const geographicScopeOptions = getUniqueValues(grants, 'geographic_scope');
  const tagOptions = getUniqueValues(grants, 'tags');

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Sticky result count and clear all */}
        <div className="flex items-center justify-between sticky top-0 z-10 bg-white/80 backdrop-blur-sm py-3 border-b border-gray-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">{filteredGrants.length} resultat hittade</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">Totalt {grants.length} bidrag</span>
          </div>
          {hasActiveFilters && onClearAll && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onClearAll} 
              className="text-xs text-gray-600 border-gray-300 px-3 py-1 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              Rensa alla filter
            </Button>
          )}
        </div>

        {/* Status Section */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Status
          </h4>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-gray-700">
              <input
                type="radio"
                name="statusFilter"
                value=""
                checked={!pendingFilters.statusFilter}
                onChange={() => onPendingFilterChange({ statusFilter: '' })}
                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              Alla
            </label>
            <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-gray-700">
              <input
                type="radio"
                name="statusFilter"
                value="open"
                checked={pendingFilters.statusFilter === 'open'}
                onChange={() => onPendingFilterChange({ statusFilter: 'open' })}
                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              Öppen
            </label>
            <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-gray-700">
              <input
                type="radio"
                name="statusFilter"
                value="upcoming"
                checked={pendingFilters.statusFilter === 'upcoming'}
                onChange={() => onPendingFilterChange({ statusFilter: 'upcoming' })}
                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              Kommande
            </label>
          </div>
        </div>

        {/* Applicant Section */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Ansökande
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Organizations Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                {selectedCountLabel(pendingFilters.organizations, 'Organisationer')}
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                {selectedCountLabel(pendingFilters.eligibleApplicants, 'Stödberättigade sökande')}
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
        {/* Project Section */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Projekt
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Industry Sectors Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                {selectedCountLabel(pendingFilters.industrySectors, 'Branscher')}
              </label>
              <MultiSelect
                options={industrySectorOptions}
                value={pendingFilters.industrySectors}
                onValueChange={vals => onPendingFilterChange({ industrySectors: vals })}
                placeholder="Select sectors..."
              />
            </div>
            {/* Geographic Scope Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                {selectedCountLabel(pendingFilters.geographicScope, 'Geografiskt område')}
              </label>
              <MultiSelect
                options={geographicScopeOptions}
                value={pendingFilters.geographicScope}
                onValueChange={vals => onPendingFilterChange({ geographicScope: vals })}
                placeholder="Select scope..."
              />
            </div>
            {/* Tags/Keywords Filter */}
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-900">
                {selectedCountLabel(pendingFilters.tags, 'Taggar/Nyckelord')}
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
        {/* Requirements Section */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            Krav
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Consortium Requirement Filter */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  Konsortium krävs
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Filtrera bidrag som kräver konsortium eller samarbete.</p>
                    </TooltipContent>
                  </Tooltip>
                </label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={pendingFilters.consortiumRequired === true}
                  onCheckedChange={val => onPendingFilterChange({ consortiumRequired: val ? true : null })}
                  aria-label="Consortium Required"
                />
                <span className="text-sm text-gray-600 font-medium">
                  {pendingFilters.consortiumRequired ? 'Krävs' : 'Krävs inte'}
                </span>
              </div>
            </div>
            {/* Co-financing Requirement Filter */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  Medfinansiering krävs
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Filtrera bidrag som kräver egen finansiering eller medfinansiering.</p>
                    </TooltipContent>
                  </Tooltip>
                </label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={pendingFilters.cofinancingRequired === true}
                  onCheckedChange={val => onPendingFilterChange({ cofinancingRequired: val ? true : null })}
                  aria-label="Co-financing Required"
                />
                <span className="text-sm text-gray-600 font-medium">
                  {pendingFilters.cofinancingRequired ? 'Krävs' : 'Krävs inte'}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Funding & Deadline Section */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            Finansiering & Deadline
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Funding Range Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Finansieringsbelopp</label>
              <FundingRangeSlider
                value={pendingFilters.fundingRange}
                onChange={(range) => onPendingFilterChange({ fundingRange: range })}
                totalGrants={grants.length}
                grantsInRange={grantsInFundingRange}
              />
            </div>
            {/* Deadline Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Ansökningsdeadline</label>
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
