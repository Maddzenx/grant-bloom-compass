
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type SortOption = "deadline" | "funding" | "relevance" | "none";

interface SortingControlsProps {
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
}

const SortingControls = ({ sortBy, onSortChange }: SortingControlsProps) => {
  return (
    <div className="flex items-center justify-end gap-2">
      <span className="text-sm text-gray-600 font-medium">Sortera:</span>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Välj sortering" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Standard</SelectItem>
          <SelectItem value="relevance">Relevans</SelectItem>
          <SelectItem value="deadline">Ansökningsdeadline</SelectItem>
          <SelectItem value="funding">Bidragsbelopp</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortingControls;
