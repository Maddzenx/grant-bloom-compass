import React, { useState, useMemo } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface OrganizationOption {
  value: string;
  label: string;
  count: number;
  logo?: string;
}

interface OrganizationMultiSelectProps {
  organizations: OrganizationOption[];
  selectedOrganizations: string[];
  onSelectionChange: (selected: string[]) => void;
  placeholder?: string;
}

export const OrganizationMultiSelect = ({
  organizations,
  selectedOrganizations,
  onSelectionChange,
  placeholder = "Select organizations...",
}: OrganizationMultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrganizations = useMemo(() => {
    if (!searchTerm) return organizations;
    return organizations.filter(org =>
      org.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [organizations, searchTerm]);

  const selectedLabels = useMemo(() => {
    return organizations
      .filter(org => selectedOrganizations.includes(org.value))
      .map(org => org.label);
  }, [organizations, selectedOrganizations]);

  const handleToggleOrganization = (orgValue: string) => {
    if (selectedOrganizations.includes(orgValue)) {
      onSelectionChange(selectedOrganizations.filter(id => id !== orgValue));
    } else {
      onSelectionChange([...selectedOrganizations, orgValue]);
    }
  };

  const handleRemoveOrganization = (orgValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectionChange(selectedOrganizations.filter(id => id !== orgValue));
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  return (
    <div className="space-y-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between h-auto min-h-8 p-2 bg-white border-gray-300 hover:bg-gray-50"
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {selectedOrganizations.length === 0 ? (
                <span className="text-black text-sm">{placeholder}</span>
              ) : (
                selectedLabels.slice(0, 2).map((label, index) => {
                  const orgValue = organizations.find(org => org.label === label)?.value;
                  return (
                    <Badge key={index} variant="secondary" className="text-xs bg-white border border-gray-300 text-gray-900">
                      {label}
                      <button
                        onClick={(e) => orgValue && handleRemoveOrganization(orgValue, e)}
                        className="ml-1 hover:bg-gray-100 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  );
                })
              )}
              {selectedOrganizations.length > 2 && (
                <Badge variant="secondary" className="text-xs bg-white border border-gray-300 text-gray-900">
                  +{selectedOrganizations.length - 2} more
                </Badge>
              )}
            </div>
            <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-white border border-gray-200 shadow-lg" align="start">
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 bg-white border-gray-300"
              />
            </div>
          </div>
          
          {selectedOrganizations.length > 0 && (
            <div className="p-2 border-b border-gray-200 bg-white">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="h-6 text-xs hover:bg-gray-50 text-gray-600"
              >
                Clear all ({selectedOrganizations.length})
              </Button>
            </div>
          )}

          <div className="max-h-60 overflow-y-auto bg-white">
            {filteredOrganizations.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No organizations found
              </div>
            ) : (
              filteredOrganizations.map((org) => (
                <div
                  key={org.value}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-50 cursor-pointer bg-white border-b border-gray-100"
                  onClick={() => handleToggleOrganization(org.value)}
                >
                  <div className="flex items-center justify-center w-4 h-4">
                    {selectedOrganizations.includes(org.value) && (
                      <Check className="w-4 h-4 text-[#7D54F4]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm truncate text-gray-900">{org.label}</span>
                      <Badge variant="outline" className="text-xs ml-2 bg-white border-gray-300 text-gray-600">
                        {org.count}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
