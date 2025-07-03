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
    <div className="w-full flex justify-center bg-canvas-cloud pb-2">
      <div className="flex flex-row items-center gap-2 mt-0 mb-0">
        {/* Organization Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="rounded-full px-5 py-2 bg-white border border-gray-300 text-ink-obsidian font-medium text-[15px] shadow-none hover:bg-gray-50">
              Organization
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4">
            <div className="flex flex-col gap-2">
              {organizationOptions.map(org => (
                <label key={org} className="flex items-center gap-2 cursor-pointer">
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
                  <span className="text-sm">{org}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        {/* Funding Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="rounded-full px-5 py-2 bg-white border border-gray-300 text-ink-obsidian font-medium text-[15px] shadow-none hover:bg-gray-50">
              Funding
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-gray-600">Min</label>
              <input
                type="number"
                className="border rounded px-2 py-1"
                value={fundingRange.min ?? ''}
                onChange={e => onFundingRangeChange({ ...fundingRange, min: e.target.value ? Number(e.target.value) : null })}
                placeholder="0"
              />
              <label className="text-xs font-medium text-gray-600">Max</label>
              <input
                type="number"
                className="border rounded px-2 py-1"
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
            <Button variant="outline" className="rounded-full px-5 py-2 bg-white border border-gray-300 text-ink-obsidian font-medium text-[15px] shadow-none hover:bg-gray-50">
              Deadline
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4">
            {/* You can replace this with your EnhancedDeadlineFilter component for full functionality */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-gray-600">Preset</label>
              <select
                className="border rounded px-2 py-1"
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
            <Button variant="outline" className="rounded-full px-5 py-2 bg-white border border-gray-300 text-ink-obsidian font-medium text-[15px] shadow-none hover:bg-gray-50">
              Tags
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4">
            <div className="flex flex-col gap-2">
              {tagOptions.map(tag => (
                <label key={tag} className="flex items-center gap-2 cursor-pointer">
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
                  <span className="text-sm">{tag}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        {/* Sectors Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="rounded-full px-5 py-2 bg-white border border-gray-300 text-ink-obsidian font-medium text-[15px] shadow-none hover:bg-gray-50">
              Sectors
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4">
            <div className="flex flex-col gap-2">
              {sectorOptions.map(sector => (
                <label key={sector} className="flex items-center gap-2 cursor-pointer">
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
                  <span className="text-sm">{sector}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        {/* Reset Filters */}
        <button
          className="ml-2 text-[15px] text-accent-lavender hover:underline bg-transparent border-none p-0 font-medium"
          onClick={onResetFilters}
        >
          Reset filters
        </button>
      </div>
    </div>
  );
};

export default FilterBar; 