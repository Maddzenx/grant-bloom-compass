import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
export type SortOption = "default" | "deadline-asc" | "deadline-desc" | "amount-desc" | "amount-asc" | "created-desc" | "matching";

interface SortingControlsProps {
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
  hasSearchTerm?: boolean;
  hasSemanticMatches?: boolean;
}

const SortingControls = ({
  sortBy,
  onSortChange,
  hasSearchTerm = false,
  hasSemanticMatches = false
}: SortingControlsProps) => {
  return <div className="flex items-center justify-end gap-2">
      <span className="text-gray-600 font-medium text-xs">Sortera:</span>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-44 bg-white border-gray-200 text-xs h-8 min-h-0 focus:outline-none focus:ring-0">
          <SelectValue placeholder="Välj sortering" className="text-xs" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg">
          {hasSearchTerm && hasSemanticMatches && (
            <SelectItem value="matching" className="bg-white hover:bg-gray-50 text-black text-xs">Matchning</SelectItem>
          )}
          <SelectItem value="deadline-asc" className="bg-white hover:bg-gray-50 text-black text-xs">Närmast deadline först</SelectItem>
          <SelectItem value="deadline-desc" className="bg-white hover:bg-gray-50 text-black text-xs">Senast deadline först</SelectItem>
          <SelectItem value="amount-desc" className="bg-white hover:bg-gray-50 text-black text-xs">Störst belopp först</SelectItem>
          <SelectItem value="amount-asc" className="bg-white hover:bg-gray-50 text-black text-xs">Minst belopp först</SelectItem>
          <SelectItem value="created-desc" className="bg-white hover:bg-gray-50 text-black text-xs">Nyast publicerat</SelectItem>
        </SelectContent>
      </Select>
    </div>;
};
export default SortingControls;