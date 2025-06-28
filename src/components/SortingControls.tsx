
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type SortOption = "default" | "deadline-asc" | "deadline-desc" | "amount-desc" | "amount-asc" | "created-desc" | "relevance";

interface SortingControlsProps {
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
  hasSearchTerm?: boolean;
}

const SortingControls = ({
  sortBy,
  onSortChange,
  hasSearchTerm = false
}: SortingControlsProps) => {
  return (
    <div className="flex items-center justify-end gap-2">
      <span className="text-gray-600 font-medium text-sm">Sortera:</span>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-48 bg-white" style={{ borderColor: '#F0F1F3' }}>
          <SelectValue placeholder="Välj sortering" />
        </SelectTrigger>
        <SelectContent className="bg-white shadow-lg" style={{ borderColor: '#F0F1F3' }}>
          <SelectItem value="default" className="bg-white hover:bg-gray-50 text-black">Rekommenderade</SelectItem>
          {hasSearchTerm && <SelectItem value="relevance" className="bg-white hover:bg-gray-50 text-black">Relevans</SelectItem>}
          <SelectItem value="deadline-asc" className="bg-white hover:bg-gray-50 text-black">Närmast deadline först</SelectItem>
          <SelectItem value="deadline-desc" className="bg-white hover:bg-gray-50 text-black">Senast deadline först</SelectItem>
          <SelectItem value="amount-desc" className="bg-white hover:bg-gray-50 text-black">Störst belopp först</SelectItem>
          <SelectItem value="amount-asc" className="bg-white hover:bg-gray-50 text-black">Minst belopp först</SelectItem>
          <SelectItem value="created-desc" className="bg-white hover:bg-gray-50 text-black">Nyast publicerat</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortingControls;
