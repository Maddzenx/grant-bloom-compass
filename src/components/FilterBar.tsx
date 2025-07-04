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
  tagOptions: string[];
  sectorOptions: string[];
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
  tagOptions,
  sectorOptions,
}) => {
  return (
    <div className="w-full flex justify-start bg-canvas-cloud pb-2">
      <div className="flex flex-row items-center gap-1 mt-0 mb-0">
        {/* Organization Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="rounded-full px-3 py-1 bg-white border border-gray-300 text-ink-obsidian font-medium text-sm shadow-none hover:bg-gray-50 min-h-0 h-8">
              Organization
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3">
            <div className="flex flex-col gap-1">
              {organizationOptions.map(org => (
                <label key={org} className="flex items-center gap-2 cursor-pointer text-sm">
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
            <Button variant="outline" className="rounded-full px-3 py-1 bg-white border border-gray-300 text-ink-obsidian font-medium text-sm shadow-none hover:bg-gray-50 min-h-0 h-8">
              Funding
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Min</label>
              <input
                type="number"
                className="border rounded px-2 py-1 text-sm"
                value={fundingRange.min ?? ''}
                onChange={e => onFundingRangeChange({ ...fundingRange, min: e.target.value ? Number(e.target.value) : null })}
                placeholder="0"
              />
              <label className="text-xs font-medium text-gray-600">Max</label>
              <input
                type="number"
                className="border rounded px-2 py-1 text-sm"
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
            <Button variant="outline" className="rounded-full px-3 py-1 bg-white border border-gray-300 text-ink-obsidian font-medium text-sm shadow-none hover:bg-gray-50 min-h-0 h-8">
              Deadline
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3">
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
        {/* Tags Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="rounded-full px-3 py-1 bg-white border border-gray-300 text-ink-obsidian font-medium text-sm shadow-none hover:bg-gray-50 min-h-0 h-8">
              Tags
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3">
            <div className="flex flex-col gap-1">
              {tagOptions.map(tag => (
                <label key={tag} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={filters.tags?.includes(tag)}
                    onChange={e => {
                      const newTags = e.target.checked
                        ? [...(filters.tags || []), tag]
                        : (filters.tags || []).filter((t: string) => t !== tag);
                      onFiltersChange({ tags: newTags });
                    }}
                  />
                  <span>{tag}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        {/* Sectors Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="rounded-full px-3 py-1 bg-white border border-gray-300 text-ink-obsidian font-medium text-sm shadow-none hover:bg-gray-50 min-h-0 h-8">
              Sectors
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3">
            <div className="flex flex-col gap-1">
              {sectorOptions.map(sector => (
                <label key={sector} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={filters.sectors?.includes(sector)}
                    onChange={e => {
                      const newSectors = e.target.checked
                        ? [...(filters.sectors || []), sector]
                        : (filters.sectors || []).filter((s: string) => s !== sector);
                      onFiltersChange({ sectors: newSectors });
                    }}
                  />
                  <span>{sector}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        {/* Reset Filters */}
        <button
          className="ml-2 text-sm text-accent-lavender hover:underline bg-transparent border-none p-0 font-medium min-h-0 h-8"
          onClick={onResetFilters}
        >
          Reset filters
        </button>
      </div>
    </div>
  );
};

export default FilterBar; 