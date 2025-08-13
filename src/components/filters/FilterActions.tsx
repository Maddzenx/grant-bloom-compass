
import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterActionsProps {
  hasPendingChanges: boolean;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  compact?: boolean;
}

export const FilterActions = ({
  hasPendingChanges,
  onApplyFilters,
  onClearFilters,
  compact = false,
}: FilterActionsProps) => {
  return (
    <div className="flex justify-end gap-3">
      <Button
        variant="outline"
        size="default"
        onClick={onClearFilters}
        className="flex items-center gap-2 bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:text-gray-900 px-6 py-2 rounded-lg transition-all duration-200"
      >
        <RotateCcw className="w-4 h-4" />
        Rensa filter
      </Button>
      <Button
        size="default"
        onClick={onApplyFilters}
        disabled={!hasPendingChanges}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Tillämpa filter
        {hasPendingChanges && (
          <span className="ml-2 text-xs bg-white/20 text-white px-2 py-1 rounded-full border border-white/30">
            Ny
          </span>
        )}
      </Button>
    </div>
  );
};
