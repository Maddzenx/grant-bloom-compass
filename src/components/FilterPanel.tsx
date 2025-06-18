
import React, { useState } from "react";
import { Search, X, ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface FilterPanelProps {
  totalResults: number;
  onFiltersChange: (filters: any) => void;
}

const FilterPanel = ({ totalResults, onFiltersChange }: FilterPanelProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [selectedGrantProviders, setSelectedGrantProviders] = useState<string[]>([]);
  const [selectedGrantGroups, setSelectedGrantGroups] = useState<string[]>([]);
  const [amountRange, setAmountRange] = useState([0, 100000000]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["Öppna", "Planerade"]);
  const [includeCoFinancing, setIncludeCoFinancing] = useState(true);

  const grantProviders = [
    "Vinnova",
    "Formas",
    "EU",
    "Vetenskapsrådet",
    "Energimyndigheten",
    "Region Stockholm",
    "Tillväxtverket"
  ];

  const grantGroups = [
    "SME",
    "Institut",
    "Akademi",
    "Offentlig sektor",
    "Företag",
    "Startup"
  ];

  const statuses = ["Öppna", "Löpande", "Kommande", "Stängda"];

  const activeFilters = [
    ...selectedStatuses,
    ...(includeCoFinancing ? ["Inkl. Medfinansiering"] : [])
  ];

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(0)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}k`;
    }
    return amount.toString();
  };

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
  };

  const clearFilters = () => {
    setSelectedGrantProviders([]);
    setSelectedGrantGroups([]);
    setAmountRange([0, 100000000]);
    setSelectedStatuses(["Öppna"]);
    setIncludeCoFinancing(false);
  };

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const toggleGrantGroup = (group: string) => {
    setSelectedGrantGroups(prev => 
      prev.includes(group) 
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };

  return (
    <div className="w-full bg-white">
      {/* Search Bar */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Sök efter bidrag"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-4 text-lg border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
          <Button 
            onClick={handleSearch}
            className="px-8 py-4 text-lg bg-green-600 hover:bg-green-700 rounded-lg"
          >
            Sök
          </Button>
        </div>
      </div>

      {/* Results Summary and Filter Toggle */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <span className="text-lg font-medium text-gray-900">
              {totalResults} träffar
            </span>
            {activeFilters.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Valda filter ({activeFilters.length}):</span>
                <div className="flex gap-1">
                  {activeFilters.slice(0, 3).map((filter) => (
                    <Badge key={filter} variant="secondary" className="text-xs">
                      {filter}
                    </Badge>
                  ))}
                  {activeFilters.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{activeFilters.length - 3} fler
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? "Dölj filter" : "Visa filter"}
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="p-6 bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Grant Providers Dropdown */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Inkludera bidragsgivare
                </label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Välj bidragsgivare" />
                  </SelectTrigger>
                  <SelectContent>
                    {grantProviders.map((provider) => (
                      <SelectItem key={provider} value={provider}>
                        {provider}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Grant Groups */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Bidragsgrupper
                </label>
                <div className="flex flex-wrap gap-2">
                  {grantGroups.map((group) => (
                    <Badge
                      key={group}
                      variant={selectedGrantGroups.includes(group) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => toggleGrantGroup(group)}
                    >
                      {group}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Status Checkboxes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {statuses.map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={status}
                        checked={selectedStatuses.includes(status)}
                        onCheckedChange={() => toggleStatus(status)}
                      />
                      <label htmlFor={status} className="text-sm text-gray-700">
                        {status}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Amount Slider */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-700">
                Sökbart belopp (SEK)
              </label>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{formatAmount(amountRange[0])} SEK</span>
                  <span>{formatAmount(amountRange[1])} SEK</span>
                </div>
                <Slider
                  value={amountRange}
                  onValueChange={setAmountRange}
                  max={100000000}
                  min={0}
                  step={100000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>100M SEK</span>
                </div>
              </div>
            </div>

            {/* Co-financing Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Visa alla inkl. Medfinansiering
                </label>
                <p className="text-xs text-gray-500">
                  Inkludera bidrag som kräver medfinansiering
                </p>
              </div>
              <Switch
                checked={includeCoFinancing}
                onCheckedChange={setIncludeCoFinancing}
              />
            </div>

            {/* Reset Filters */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="text-gray-600"
              >
                Återställ filter
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
