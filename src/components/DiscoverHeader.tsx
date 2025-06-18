import React from "react";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import SearchBar from "@/components/SearchBar";
import SortingControls, { SortOption } from "@/components/SortingControls";
interface DiscoverHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
  totalGrants: number;
}
const DiscoverHeader = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  totalGrants
}: DiscoverHeaderProps) => {
  const {
    toggleSidebar,
    state
  } = useSidebar();
  return <div className="w-full bg-[#f8f4ec] border-b border-gray-200 flex-shrink-0">
      <div className="p-4 border border-transparent py-[2px]">
        {/* Header with toggle button and title */}
        <div className="flex items-center gap-3 mb-4">
          {state === "collapsed" && <Button variant="ghost" size="sm" onClick={toggleSidebar} className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors bg-white shadow-md border border-gray-200" title="Expand sidebar">
              <PanelLeft className="w-4 h-4" />
            </Button>}
          <h1 className="text-xl font-bold text-gray-900 py-[10px]">Upptäck bidrag</h1>
        </div>
        
        {/* Centered search bar */}
        <div className="flex justify-center mb-4">
          <div className="w-full max-w-md">
            <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
          </div>
        </div>
        
        <div className="flex items-center justify-between my-0">
          <div className="text-black text-xs rounded-none">
            {totalGrants} bidrag hittade
          </div>
          <SortingControls sortBy={sortBy} onSortChange={onSortChange} />
        </div>
      </div>
    </div>;
};
export default DiscoverHeader;