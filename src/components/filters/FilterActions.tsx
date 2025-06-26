
import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterActionsProps {
  hasPendingChanges: boolean;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export const FilterActions = ({
  hasPendingChanges,
  onApplyFilters,
  onClearFilters,
}: FilterActionsProps) => {
  return (
    <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
      <Button
        variant="outline"
        size="sm"
        onClick={onClearFilters}
        className="flex items-center gap-2 bg-white hover:bg-gray-50 border-gray-300"
      >
        <RotateCcw className="w-4 h-4" />
        Clear Filters
      </Button>
      <Button
        size="sm"
        onClick={onApplyFilters}
        disabled={!hasPendingChanges}
        className="flex items-center gap-2 bg-accent-lime hover:bg-accent-lime/90 text-black"
      >
        Apply Filters
        {hasPendingChanges && (
          <span className="ml-1 text-xs bg-white text-black px-1.5 py-0.5 rounded-full">
            New
          </span>
        )}
      </Button>
    </div>
  );
};
