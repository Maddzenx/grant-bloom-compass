import React from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface FilterHeaderProps {
  isExpanded: boolean;
  onToggleExpanded: () => void;
  hasActiveFilters: boolean;
  filteredCount: number;
  totalCount: number;
  activeFilterCount: number;
}
export const FilterHeader = ({
  isExpanded,
  onToggleExpanded,
  hasActiveFilters,
  filteredCount,
  totalCount,
  activeFilterCount
}: FilterHeaderProps) => {
  return <div className="p-4 pb-0 py-0 rounded-none border border-transparent ">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onToggleExpanded} className="flex items-center gap-2 text-gray-900 hover:text-gray-700 p-0 h-auto font-semibold">
          <Filter className="w-4 h-4" />
          <h3>Advanced filter</h3>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
        
        
      </div>

      {!isExpanded && hasActiveFilters && <div className="mt-1 text-xs text-gray-500">
          {activeFilterCount} active filters
        </div>}
    </div>;
};