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
    borderColor: '#F0F1F3'
  }} className="rounded-none py-[2px] bg-[F0F1F3] border bg-[#f0f1f3] px-[30px]">
      <div className="flex items-center justify-between py-px bg-[#f0f1f3] rounded-none">
        <Button variant="ghost" size="sm" onClick={onToggleExpanded} className="flex items-center gap-2 text-gray-900 hover:text-gray-700 hover:bg-gray-50 p-0 h-auto font-normal text-xs">
          <Filter className="w-4 h-4" />
          <h3 className="font-normal text-sm">Advancerat filter</h3>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>

      {!isExpanded && hasActiveFilters && <div className="mt-1 text-xs text-gray-500">
          {activeFilterCount} active filters
        </div>}
    </div>;
};