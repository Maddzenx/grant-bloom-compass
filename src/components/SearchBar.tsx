
import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps) => {
  return (
    <div className="flex gap-4 items-center">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Sök"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 pr-4 py-3 border-gray-300 bg-white rounded-xl text-base font-medium shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <Button 
        variant="outline" 
        className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-xl font-semibold shadow-sm"
      >
        Search
      </Button>
    </div>
  );
};

export default SearchBar;
