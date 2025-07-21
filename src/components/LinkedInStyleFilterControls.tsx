import React, { useState, useMemo } from "react";
import { Grant } from "@/types/grant";
import { EnhancedFilterOptions } from "@/hooks/useFilterState";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Building2, 
  Calendar, 
  DollarSign, 
  Tag, 
  MapPin, 
  Users, 
  Briefcase,
  ChevronDown,
  X,
  RotateCcw,
  Search
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { OrganizationMultiSelect } from "./OrganizationMultiSelect";
import { FundingRangeSlider } from "./FundingRangeSlider";
import { EnhancedDeadlineFilter } from "./EnhancedDeadlineFilter";
import { MultiSelect } from "./MultiSelect";
import { Switch } from "./ui/switch";
import { parseFundingAmount, processOrganizationOptions } from "@/utils/filterHelpers";

interface LinkedInStyleFilterControlsProps {
  filters: EnhancedFilterOptions;
  onFiltersChange: (filters: Partial<EnhancedFilterOptions>) => void;
  onClearAll: () => void;
  grants: Grant[];
  filteredGrants: Grant[];
  hasActiveFilters: boolean;
}

const getUniqueValues = (grants: Grant[], field: keyof Grant): string[] => {
  const values = new Set<string>();
  
  if (!grants || grants.length === 0) {
    return [];
  }
  
  grants.forEach(grant => {
    if (!grant) return;
    
    const value = grant[field];
    if (Array.isArray(value)) {
      value.forEach(v => {
        if (v && typeof v === 'string') {
          values.add(v);
        }
      });
    } else if (value && typeof value === 'string') {
      values.add(value);
    }
  });
  return Array.from(values).filter(Boolean);
};

export const LinkedInStyleFilterControls = ({
  filters,
  onFiltersChange,
  onClearAll,
  grants,
  filteredGrants,
  hasActiveFilters
}: LinkedInStyleFilterControlsProps) => {
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const [pendingFilters, setPendingFilters] = useState<EnhancedFilterOptions>(filters);

  const organizationOptions = useMemo(() => {
    if (!grants || grants.length === 0) return [];
    return processOrganizationOptions(grants);
  }, [grants]);
  
  const industrySectorOptions = useMemo(() => getUniqueValues(grants || [], 'industry_sectors'), [grants]);
  const eligibleApplicantOptions = useMemo(() => getUniqueValues(grants || [], 'eligible_organisations'), [grants]);
  const geographicScopeOptions = useMemo(() => getUniqueValues(grants || [], 'geographic_scope'), [grants]);
  const tagOptions = useMemo(() => getUniqueValues(grants || [], 'tags'), [grants]);

  const grantsInFundingRange = useMemo(() => {
    if (!grants || grants.length === 0) return 0;
    if (!pendingFilters.fundingRange.min && !pendingFilters.fundingRange.max) {
      return grants.length;
    }
    return grants.filter(grant => {
      const amount = parseFundingAmount(grant.fundingAmount);
      const min = pendingFilters.fundingRange.min;
      const max = pendingFilters.fundingRange.max;
      if (min && amount < min) return false;
      if (max && amount > max) return false;
      return true;
    }).length;
  }, [grants, pendingFilters.fundingRange]);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M SEK`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K SEK`;
    }
    return `${amount} SEK`;
  };

  const getFilterChipText = (filterType: string) => {
    switch (filterType) {
      case 'organizations':
        return filters.organizations.length > 0 
          ? filters.organizations.length === 1 
            ? organizationOptions.find(org => org.value === filters.organizations[0])?.label || filters.organizations[0]
            : `${filters.organizations.length} organisationer`
          : 'Organisation';
      case 'funding':
        if (filters.fundingRange.min || filters.fundingRange.max) {
          const min = filters.fundingRange.min ? formatCurrency(filters.fundingRange.min) : '0';
          const max = filters.fundingRange.max ? formatCurrency(filters.fundingRange.max) : 'Ingen gräns';
          return `${min} - ${max}`;
        }
        return 'Finansiering';
      case 'deadline':
        if (filters.deadline.preset) {
          const presetLabels: { [key: string]: string } = {
            'urgent': 'Brådskande (7 dagar)',
            '2weeks': 'Nästa 2 veckor',
            '1month': 'Nästa månad',
            '3months': 'Nästa 3 månader',
            '6months': 'Nästa 6 månader',
            '1year': 'Nästa år'
          };
          return presetLabels[filters.deadline.preset] || 'Deadline';
        }
        return 'Deadline';
      case 'sectors':
        return filters.industrySectors.length > 0 
          ? `${filters.industrySectors.length} sektorer` 
          : 'Branschsektorer';
      case 'applicants':
        return filters.eligibleApplicants.length > 0 
          ? `${filters.eligibleApplicants.length} sökandetyper` 
          : 'Behöriga sökande';
      case 'geographic':
        return filters.geographicScope.length > 0 
          ? `${filters.geographicScope.length} regioner` 
          : 'Geografisk omfattning';
      case 'tags':
        return filters.tags.length > 0 
          ? `${filters.tags.length} taggar` 
          : 'Taggar';
      default:
        return '';
    }
  };

  const isFilterActive = (filterType: string) => {
    switch (filterType) {
      case 'organizations':
        return filters.organizations.length > 0;
      case 'funding':
        return filters.fundingRange.min !== null || filters.fundingRange.max !== null;
      case 'deadline':
        return filters.deadline.preset !== '' || filters.deadline.customRange?.start || filters.deadline.customRange?.end;
      case 'sectors':
        return filters.industrySectors.length > 0;
      case 'applicants':
        return filters.eligibleApplicants.length > 0;
      case 'geographic':
        return filters.geographicScope.length > 0;
      case 'tags':
        return filters.tags.length > 0;
      default:
        return false;
    }
  };

  const handleApplyFilters = () => {
    onFiltersChange(pendingFilters);
    setActivePopover(null);
  };

  const handleResetFilters = () => {
    const defaultFilters: EnhancedFilterOptions = {
      organizations: [],
      fundingRange: { min: null, max: null },
      deadline: { type: 'preset', preset: '' },
      tags: [],
      industrySectors: [],
      eligibleApplicants: [],
      consortiumRequired: null,
      geographicScope: [],
      cofinancingRequired: null,
    };
    setPendingFilters(defaultFilters);
  };

  const renderFilterContent = (filterType: string) => {
    switch (filterType) {
      case 'organizations':
        return (
          <div className="w-80 p-4">
            <h4 className="font-medium mb-3">Organisation</h4>
            <OrganizationMultiSelect
              organizations={organizationOptions}
              selectedOrganizations={pendingFilters.organizations}
              onSelectionChange={(selected) =>
                setPendingFilters(prev => ({ ...prev, organizations: selected }))
              }
              placeholder="Välj organisationer..."
            />
          </div>
        );
      case 'funding':
        return (
          <div className="w-80 p-4">
            <h4 className="font-medium mb-3">Finansiering</h4>
            <FundingRangeSlider
              value={pendingFilters.fundingRange}
              onChange={(range) => setPendingFilters(prev => ({ ...prev, fundingRange: range }))}
              totalGrants={grants.length}
              grantsInRange={grantsInFundingRange}
            />
          </div>
        );
      case 'deadline':
        return (
          <div className="w-80 p-4">
            <h4 className="font-medium mb-3">Ansökningsdeadline</h4>
            <EnhancedDeadlineFilter
              value={pendingFilters.deadline}
              onChange={(deadline) => setPendingFilters(prev => ({ ...prev, deadline }))}
              grantsCount={filteredGrants.length}
            />
          </div>
        );
      case 'sectors':
        return (
          <div className="w-80 p-4">
            <h4 className="font-medium mb-3">Branschsektorer</h4>
            <MultiSelect
              options={industrySectorOptions || []}
              value={pendingFilters.industrySectors || []}
              onValueChange={vals => setPendingFilters(prev => ({ ...prev, industrySectors: vals || [] }))}
              placeholder="Välj sektorer..."
            />
          </div>
        );
      case 'applicants':
        return (
          <div className="w-80 p-4">
            <h4 className="font-medium mb-3">Behöriga sökande</h4>
            <MultiSelect
              options={eligibleApplicantOptions || []}
              value={pendingFilters.eligibleApplicants || []}
              onValueChange={vals => setPendingFilters(prev => ({ ...prev, eligibleApplicants: vals || [] }))}
              placeholder="Välj sökandetyper..."
            />
          </div>
        );
      case 'geographic':
        return (
          <div className="w-80 p-4">
            <h4 className="font-medium mb-3">Geografisk omfattning</h4>
            <MultiSelect
              options={geographicScopeOptions || []}
              value={pendingFilters.geographicScope || []}
              onValueChange={vals => setPendingFilters(prev => ({ ...prev, geographicScope: vals || [] }))}
              placeholder="Välj regioner..."
            />
          </div>
        );
      case 'tags':
        return (
          <div className="w-80 p-4">
            <h4 className="font-medium mb-3">Taggar/Nyckelord</h4>
            <MultiSelect
              options={tagOptions || []}
              value={pendingFilters.tags || []}
              onValueChange={vals => setPendingFilters(prev => ({ ...prev, tags: vals || [] }))}
              placeholder="Välj taggar..."
            />
          </div>
        );
      default:
        return null;
    }
  };

  const filterButtons = [
    { key: 'organizations', icon: Building2, label: getFilterChipText('organizations') },
    { key: 'funding', icon: DollarSign, label: getFilterChipText('funding') },
    { key: 'deadline', icon: Calendar, label: getFilterChipText('deadline') },
    { key: 'sectors', icon: Briefcase, label: getFilterChipText('sectors') },
    { key: 'applicants', icon: Users, label: getFilterChipText('applicants') },
    { key: 'geographic', icon: MapPin, label: getFilterChipText('geographic') },
    { key: 'tags', icon: Tag, label: getFilterChipText('tags') },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-6xl mx-auto">
      {/* Filter chips row */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {filterButtons.map(({ key, icon: Icon, label }) => (
          <Popover
            key={key}
            open={activePopover === key}
            onOpenChange={(open) => {
              if (open) {
                setPendingFilters(filters);
                setActivePopover(key);
              } else {
                setActivePopover(null);
              }
            }}
          >
            <PopoverTrigger asChild>
              <Button
                variant={isFilterActive(key) ? "default" : "outline"}
                className={`h-8 px-3 text-sm font-medium border rounded-full ${
                  isFilterActive(key) 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4 mr-1" />
                {label}
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="p-0 border-0 shadow-lg"
              align="start"
              side="bottom"
              sideOffset={4}
            >
              <div className="bg-white rounded-lg border border-gray-200 shadow-lg">
                {renderFilterContent(key)}
                <div className="flex justify-between items-center p-4 border-t border-gray-100 bg-gray-50 rounded-b-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetFilters}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Återställ
                  </Button>
                  <Button
                    onClick={handleApplyFilters}
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Search className="w-4 h-4 mr-1" />
                    Visa resultat
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        ))}

        {/* All filters button */}
        {hasActiveFilters && (
          <>
            <div className="h-4 w-px bg-gray-300 mx-1" />
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="h-8 px-3 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            >
              <X className="w-3 h-3 mr-1" />
              Rensa alla filter
            </Button>
          </>
        )}
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        {filteredGrants.length} bidrag hittades
      </div>
    </div>
  );
};