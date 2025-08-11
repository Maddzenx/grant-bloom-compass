
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  inputClassName?: string;
}

const SearchBar = ({ searchTerm, onSearchChange, placeholder, inputClassName }: SearchBarProps) => {
  const { t } = useLanguage();

  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
      <Input
        placeholder={placeholder || t('search.placeholder')}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className={`pl-12 pr-4 py-4 md:py-5 border border-zinc-200 bg-white rounded-full text-base font-medium shadow-sm hover:shadow-md transition-shadow duration-200 focus:ring-2 focus:ring-[#7D54F4] focus:border-[#7D54F4] focus:outline-none w-full placeholder:text-zinc-500 text-zinc-900 ${inputClassName || ''}`}
      />
    </div>
  );
};

export default SearchBar;
