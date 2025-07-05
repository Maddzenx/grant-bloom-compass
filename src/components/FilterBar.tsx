import React from "react";
import { Button } from "./ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  filters: any;
  onFiltersChange: (filters: Partial<any>) => void;
  onResetFilters: () => void;
  organizationOptions: string[];
  fundingRange: { min: number | null; max: number | null };
  onFundingRangeChange: (range: { min: number | null; max: number | null }) => void;
  deadlineValue: any;
  onDeadlineChange: (val: any) => void;
  industryOptions: string[];
  eligibleApplicantOptions: string[];
  geographicScopeOptions: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFiltersChange,
  onResetFilters,
  organizationOptions,
  fundingRange,
  onFundingRangeChange,
  deadlineValue,
  onDeadlineChange,
  industryOptions = [],
  eligibleApplicantOptions = [],
  geographicScopeOptions = [],
}) => {
  return (
    <div className="w-full flex flex-col justify-start bg-canvas-cloud pb-2">
      <div className="flex flex-row items-center gap-1 mt-0 mb-0">
        {/* Organization Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="rounded-full px-2 py-0.5 bg-white border border-gray-300 text-ink-obsidian font-medium text-xs shadow-none hover:bg-gray-50 min-h-0 h-7">
              Organization
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3" align="start">
            <div className="flex flex-col gap-1">
              {organizationOptions.map(org => (
                <label key={org} className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={filters.organizations?.includes(org)}
                    onChange={e => {
                      const newOrgs = e.target.checked
                        ? [...(filters.organizations || []), org]
                        : (filters.organizations || []).filter((o: string) => o !== org);
                      onFiltersChange({ organizations: newOrgs });
                    }}
                  />
                  <span>{org}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        {/* Funding Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="rounded-full px-2 py-0.5 bg-white border border-gray-300 text-ink-obsidian font-medium text-xs shadow-none hover:bg-gray-50 min-h-0 h-7">
              Funding
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3" align="start">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Min</label>
              <input
                type="number"
                className="border rounded px-1.5 py-0.5 text-xs"
                value={fundingRange.min ?? ''}
                onChange={e => onFundingRangeChange({ ...fundingRange, min: e.target.value ? Number(e.target.value) : null })}
                placeholder="0"
              />
              <label className="text-xs font-medium text-gray-600">Max</label>
              <input
                type="number"
                className="border rounded px-1.5 py-0.5 text-xs"
                value={fundingRange.max ?? ''}
                onChange={e => onFundingRangeChange({ ...fundingRange, max: e.target.value ? Number(e.target.value) : null })}
                placeholder="No limit"
              />
            </div>
          </PopoverContent>
        </Popover>
        {/* Deadline Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="rounded-full px-2 py-0.5 bg-white border border-gray-300 text-ink-obsidian font-medium text-xs shadow-none hover:bg-gray-50 min-h-0 h-7">
              Deadline
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3" align="start">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Preset</label>
              <select
                className="border rounded px-2 py-1 text-sm"
                value={deadlineValue.preset || ''}
                onChange={e => onDeadlineChange({ type: 'preset', preset: e.target.value })}
              >
                <option value="">All</option>
                <option value="urgent">Urgent (7 days)</option>
                <option value="2weeks">Next 2 weeks</option>
                <option value="1month">Next month</option>
                <option value="3months">Next 3 months</option>
                <option value="6months">Next 6 months</option>
                <option value="1year">Next year</option>
              </select>
            </div>
          </PopoverContent>
        </Popover>
        {/* Industry Sector Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="rounded-full px-2 py-0.5 bg-white border border-gray-300 text-ink-obsidian font-medium text-xs shadow-none hover:bg-gray-50 min-h-0 h-7">
              Industry
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3 max-h-56 overflow-y-auto" align="start">
            <div className="flex flex-col gap-1">
              {industryOptions.map(ind => (
                <label key={ind} className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={filters.industrySectors?.includes(ind)}
                    onChange={e => {
                      const newInds = e.target.checked
                        ? [...(filters.industrySectors || []), ind]
                        : (filters.industrySectors || []).filter((i: string) => i !== ind);
                      onFiltersChange({ industrySectors: newInds });
                    }}
                  />
                  <span>{ind}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        {/* Eligible Applicant Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="rounded-full px-2 py-0.5 bg-white border border-gray-300 text-ink-obsidian font-medium text-xs shadow-none hover:bg-gray-50 min-h-0 h-7">
              Eligible Applicant
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3" align="start">
            <div className="flex flex-col gap-1">
              {eligibleApplicantOptions.map(applicant => (
                <label key={applicant} className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={filters.eligibleApplicants?.includes(applicant)}
                    onChange={e => {
                      const newApplicants = e.target.checked
                        ? [...(filters.eligibleApplicants || []), applicant]
                        : (filters.eligibleApplicants || []).filter((a: string) => a !== applicant);
                      onFiltersChange({ eligibleApplicants: newApplicants });
                    }}
                  />
                  <span>{applicant}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        {/* Consortium Required Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="rounded-full px-2 py-0.5 bg-white border border-gray-300 text-ink-obsidian font-medium text-xs shadow-none hover:bg-gray-50 min-h-0 h-7">
              Consortium
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3" align="start">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-gray-700">Required</label>
              <input
                type="checkbox"
                checked={filters.consortiumRequired === true}
                onChange={e => onFiltersChange({ consortiumRequired: e.target.checked ? true : null })}
              />
            </div>
          </PopoverContent>
        </Popover>
        {/* Co-financing Required Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="rounded-full px-2 py-0.5 bg-white border border-gray-300 text-ink-obsidian font-medium text-xs shadow-none hover:bg-gray-50 min-h-0 h-7">
              Co-financing
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3" align="start">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-gray-700">Required</label>
              <input
                type="checkbox"
                checked={filters.cofinancingRequired === true}
                onChange={e => onFiltersChange({ cofinancingRequired: e.target.checked ? true : null })}
              />
            </div>
          </PopoverContent>
        </Popover>
        {/* Geographic Scope Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="rounded-full px-2 py-0.5 bg-white border border-gray-300 text-ink-obsidian font-medium text-xs shadow-none hover:bg-gray-50 min-h-0 h-7">
              Geographic
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3 max-h-56 overflow-y-auto" align="start">
            <div className="flex flex-col gap-1">
              {geographicScopeOptions.map(scope => (
                <label key={scope} className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={filters.geographicScope?.includes(scope)}
                    onChange={e => {
                      const newScopes = e.target.checked
                        ? [...(filters.geographicScope || []), scope]
                        : (filters.geographicScope || []).filter((s: string) => s !== scope);
                      onFiltersChange({ geographicScope: newScopes });
                    }}
                  />
                  <span>{scope}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        {/* Reset Filters */}
        <button
          className="ml-2 text-xs text-black hover:underline bg-transparent border-none p-0 font-medium min-h-0 h-8"
          onClick={onResetFilters}
        >
          Reset filters
        </button>
      </div>
      {/* Selected filter chips */}
      <div className="flex flex-wrap gap-2 mt-1 ml-1 w-full">
        {/* Organization chips */}
        {filters.organizations && filters.organizations.length > 0 && filters.organizations.map((org: string) => (
          <span key={org} className="inline-flex items-center bg-white border border-gray-300 rounded-full px-2 py-0.5 text-xs text-gray-700">
            {org}
            <button
              className="ml-1 text-gray-400 hover:text-red-500 focus:outline-none"
              onClick={() => {
                const newOrgs = filters.organizations.filter((o: string) => o !== org);
                onFiltersChange({ organizations: newOrgs });
              }}
              aria-label={`Remove ${org}`}
            >
              ×
            </button>
          </span>
        ))}
        {/* Funding range chip */}
        {(fundingRange.min !== null || fundingRange.max !== null) && (
          <span className="inline-flex items-center bg-white border border-gray-300 rounded-full px-2 py-0.5 text-xs text-gray-700">
            {fundingRange.min !== null ? `Min: ${fundingRange.min}` : ''}
            {fundingRange.min !== null && fundingRange.max !== null ? ' - ' : ''}
            {fundingRange.max !== null ? `Max: ${fundingRange.max}` : ''}
            <button
              className="ml-1 text-gray-400 hover:text-red-500 focus:outline-none"
              onClick={() => onFundingRangeChange({ min: null, max: null })}
              aria-label="Remove funding range"
            >
              ×
            </button>
          </span>
        )}
        {/* Deadline chip */}
        {deadlineValue && deadlineValue.preset && (
          <span className="inline-flex items-center bg-white border border-gray-300 rounded-full px-2 py-0.5 text-xs text-gray-700">
            {deadlineValue.preset}
            <button
              className="ml-1 text-gray-400 hover:text-red-500 focus:outline-none"
              onClick={() => onDeadlineChange({ type: 'preset', preset: '' })}
              aria-label="Remove deadline"
            >
              ×
            </button>
          </span>
        )}
        {/* Industry chips */}
        {filters.industrySectors && filters.industrySectors.length > 0 && filters.industrySectors.map((ind: string) => (
          <span key={ind} className="inline-flex items-center bg-white border border-gray-300 rounded-full px-2 py-0.5 text-xs text-gray-700">
            {ind}
            <button
              className="ml-1 text-gray-400 hover:text-red-500 focus:outline-none"
              onClick={() => {
                const newInds = filters.industrySectors.filter((i: string) => i !== ind);
                onFiltersChange({ industrySectors: newInds });
              }}
              aria-label={`Remove ${ind}`}
            >
              ×
            </button>
          </span>
        ))}
        {/* Eligible Applicant chips */}
        {filters.eligibleApplicants && filters.eligibleApplicants.length > 0 && filters.eligibleApplicants.map((app: string) => (
          <span key={app} className="inline-flex items-center bg-white border border-gray-300 rounded-full px-2 py-0.5 text-xs text-gray-700">
            {app}
            <button
              className="ml-1 text-gray-400 hover:text-red-500 focus:outline-none"
              onClick={() => {
                const newApps = filters.eligibleApplicants.filter((a: string) => a !== app);
                onFiltersChange({ eligibleApplicants: newApps });
              }}
              aria-label={`Remove ${app}`}
            >
              ×
            </button>
          </span>
        ))}
        {/* Consortium Required chip */}
        {filters.consortiumRequired === true && (
          <span className="inline-flex items-center bg-white border border-gray-300 rounded-full px-2 py-0.5 text-xs text-gray-700">
            Consortium required
            <button
              className="ml-1 text-gray-400 hover:text-red-500 focus:outline-none"
              onClick={() => onFiltersChange({ consortiumRequired: null })}
              aria-label="Remove consortium required"
            >
              ×
            </button>
          </span>
        )}
        {/* Co-financing Required chip */}
        {filters.cofinancingRequired === true && (
          <span className="inline-flex items-center bg-white border border-gray-300 rounded-full px-2 py-0.5 text-xs text-gray-700">
            Co-financing required
            <button
              className="ml-1 text-gray-400 hover:text-red-500 focus:outline-none"
              onClick={() => onFiltersChange({ cofinancingRequired: null })}
              aria-label="Remove cofinancing required"
            >
              ×
            </button>
          </span>
        )}
        {/* Geographic chips */}
        {filters.geographicScope && filters.geographicScope.length > 0 && filters.geographicScope.map((scope: string) => (
          <span key={scope} className="inline-flex items-center bg-white border border-gray-300 rounded-full px-2 py-0.5 text-xs text-gray-700">
            {scope}
            <button
              className="ml-1 text-gray-400 hover:text-red-500 focus:outline-none"
              onClick={() => {
                const newScopes = filters.geographicScope.filter((s: string) => s !== scope);
                onFiltersChange({ geographicScope: newScopes });
              }}
              aria-label={`Remove ${scope}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default FilterBar; 