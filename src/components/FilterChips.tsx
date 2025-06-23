
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EnhancedFilterOptions } from '@/hooks/useFilterState';

interface FilterChipsProps {
  filters: EnhancedFilterOptions;
  onRemoveFilter: (filterType: string, value?: string) => void;
  onClearAll: () => void;
  organizations: { value: string; label: string }[];
}

export const FilterChips = ({
  filters,
  onRemoveFilter,
  onClearAll,
  organizations,
}: FilterChipsProps) => {
  const getOrganizationLabel = (value: string) => {
    return organizations.find(org => org.value === value)?.label || value;
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M SEK`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K SEK`;
    }
    return `${amount} SEK`;
  };

  const chips = [];

  // Organization chips
  filters.organizations.forEach(org => {
    chips.push({
      key: `org-${org}`,
      label: getOrganizationLabel(org),
      onRemove: () => onRemoveFilter('organizations', org),
    });
  });

  // Funding range chip
  if (filters.fundingRange.min !== null || filters.fundingRange.max !== null) {
    const minText = filters.fundingRange.min ? formatCurrency(filters.fundingRange.min) : '0';
    const maxText = filters.fundingRange.max ? formatCurrency(filters.fundingRange.max) : 'No limit';
    chips.push({
      key: 'funding-range',
      label: `${minText} - ${maxText}`,
      onRemove: () => onRemoveFilter('fundingRange'),
    });
  }

  // Deadline chip
  if (filters.deadline.preset || filters.deadline.customRange?.start || filters.deadline.customRange?.end) {
    let deadlineLabel = '';
    if (filters.deadline.type === 'preset' && filters.deadline.preset) {
      const presetLabels: { [key: string]: string } = {
        'urgent': 'Urgent (7 days)',
        '2weeks': 'Next 2 weeks',
        '1month': 'Next month',
        '3months': 'Next 3 months',
        '6months': 'Next 6 months',
        '1year': 'Next year',
      };
      deadlineLabel = presetLabels[filters.deadline.preset] || 'Custom deadline';
    } else if (filters.deadline.type === 'custom') {
      deadlineLabel = 'Custom deadline';
    }
    
    if (deadlineLabel) {
      chips.push({
        key: 'deadline',
        label: deadlineLabel,
        onRemove: () => onRemoveFilter('deadline'),
      });
    }
  }

  // Tags chips
  filters.tags.forEach(tag => {
    chips.push({
      key: `tag-${tag}`,
      label: `#${tag}`,
      onRemove: () => onRemoveFilter('tags', tag),
    });
  });

  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 border-b">
      <span className="text-sm text-muted-foreground font-medium">Active filters:</span>
      
      {chips.map(chip => (
        <Badge
          key={chip.key}
          variant="secondary"
          className="flex items-center gap-1 px-2 py-1"
        >
          <span className="text-xs">{chip.label}</span>
          <button
            onClick={chip.onRemove}
            className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
      >
        Clear all
      </Button>
    </div>
  );
};
