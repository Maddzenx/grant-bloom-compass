
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export interface FilterOptions {
  organization: string;
  minFunding: string;
  maxFunding: string;
  deadline: string;
}

interface FilterControlsProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  organizations: string[];
}

const FilterControls = ({ filters, onFiltersChange, organizations }: FilterControlsProps) => {
  const hasActiveFilters = Object.values(filters).some(value => value !== "");

  const clearFilters = () => {
    onFiltersChange({
      organization: "",
      minFunding: "",
      maxFunding: "",
      deadline: ""
    });
  };

  const updateFilter = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="space-y-3 p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filtrera bidrag</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4 mr-1" />
            Rensa
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Organization Filter */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Organisation</label>
          <Select value={filters.organization} onValueChange={(value) => updateFilter("organization", value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Alla organisationer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Alla organisationer</SelectItem>
              {organizations.map(org => (
                <SelectItem key={org} value={org}>{org}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Min Funding Filter */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Min belopp (SEK)</label>
          <Input
            type="number"
            placeholder="0"
            value={filters.minFunding}
            onChange={(e) => updateFilter("minFunding", e.target.value)}
            className="h-8"
          />
        </div>

        {/* Max Funding Filter */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Max belopp (SEK)</label>
          <Input
            type="number"
            placeholder="Obegränsat"
            value={filters.maxFunding}
            onChange={(e) => updateFilter("maxFunding", e.target.value)}
            className="h-8"
          />
        </div>

        {/* Deadline Filter */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Deadline inom</label>
          <Select value={filters.deadline} onValueChange={(value) => updateFilter("deadline", value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Alla deadlines" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Alla deadlines</SelectItem>
              <SelectItem value="7">7 dagar</SelectItem>
              <SelectItem value="30">30 dagar</SelectItem>
              <SelectItem value="90">90 dagar</SelectItem>
              <SelectItem value="365">1 år</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
