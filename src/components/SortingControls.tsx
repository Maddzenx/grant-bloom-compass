
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type SortOption = "default" | "deadline-asc" | "deadline-desc" | "amount-desc" | "amount-asc" | "created-desc" | "relevance";

interface SortingControlsProps {
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
  hasSearchTerm?: boolean;
}

const SortingControls = ({ sortBy, onSortChange, hasSearchTerm = false }: SortingControlsProps) => {
  return (
    <div className="flex items-center justify-end gap-2">
      <span className="text-sm text-gray-600 font-medium">Sortera:</span>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Välj sortering" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Rekommenderade</SelectItem>
          {hasSearchTerm && (
            <SelectItem value="relevance">Relevans</SelectItem>
          )}
          <SelectItem value="deadline-asc">Närmast deadline först</SelectItem>
          <SelectItem value="deadline-desc">Senast deadline först</SelectItem>
          <SelectItem value="amount-desc">Störst belopp först</SelectItem>
          <SelectItem value="amount-asc">Minst belopp först</SelectItem>
          <SelectItem value="created-desc">Nyast publicerat</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortingControls;
