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
  return (
    <div className="flex items-center justify-end gap-3">
      <span className="text-gray-900 font-semibold text-sm">Sortera:</span>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-56 bg-white border-gray-300 text-sm h-10 min-h-0 focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-none rounded-lg transition-all duration-200 hover:bg-gray-50 px-4">
          <SelectValue placeholder="Välj sortering" className="text-sm text-gray-900 font-medium" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
          {hasSearchTerm && hasSemanticMatches && (
            <SelectItem value="matching" className="text-sm cursor-pointer py-3">
              Matchning
            </SelectItem>
          )}
          <SelectItem value="deadline-asc" className="text-sm cursor-pointer py-3">
            Närmast deadline först
          </SelectItem>
          <SelectItem value="deadline-desc" className="text-sm cursor-pointer py-3">
            Senast deadline först
          </SelectItem>
          <SelectItem value="amount-desc" className="text-sm cursor-pointer py-3">
            Störst belopp först
          </SelectItem>
          <SelectItem value="amount-asc" className="text-sm cursor-pointer py-3">
            Minst belopp först
          </SelectItem>
          <SelectItem value="created-desc" className="text-sm cursor-pointer py-3">
            Nyast publicerat
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortingControls;
