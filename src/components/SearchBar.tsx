
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps) => {
  const { t } = useLanguage();

  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <Input
        placeholder={t('search.placeholder')}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-12 pr-4 py-3 border-gray-300 bg-white rounded-lg text-base font-medium shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
      />
    </div>
  );
};

export default SearchBar;
