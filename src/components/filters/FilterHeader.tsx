
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
  className?: string;
}

export const FilterHeader = ({
  isExpanded,
  onToggleExpanded,
  hasActiveFilters,
  filteredCount,
  totalCount,
  activeFilterCount,
  className = ""
}: FilterHeaderProps) => {
  return <div className={`bg-zinc-50 border-b border-gray-200 ${className}`}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleExpanded} 
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-white/50 p-3 h-auto font-medium text-sm rounded-lg transition-all duration-200"
          >
            <Filter className="w-5 h-5 text-[#7D54F4]" />
            <span className="font-medium">Avancerat filter</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">
              {filteredCount} av {totalCount} bidrag
            </span>
            {hasActiveFilters && (
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                {activeFilterCount} aktiva filter
              </span>
            )}
          </div>
        </div>

        {!isExpanded && hasActiveFilters && (
          <div className="mt-3 text-sm text-gray-600">
            {activeFilterCount} filter aktiva • {filteredCount} resultat visade
          </div>
        )}
      </div>
    </div>;
};
