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
  return <div style={{
    borderColor: '#f0f1f3'
  }} className="rounded-none py-2 bg-[#f0f1f3] border border-[#f0f1f3] px-10 md:px-20">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" onClick={onToggleExpanded} className="flex items-center gap-1 text-gray-900 hover:text-gray-700 hover:bg-gray-50 p-0 h-auto font-normal text-sm">
          <Filter className="w-4 h-4" />
          <span className="font-normal text-sm">Avancerat filter</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>

      {!isExpanded && hasActiveFilters && <div className="mt-1 text-xs text-gray-500">
          {activeFilterCount} active filters
        </div>}
    </div>;
};
