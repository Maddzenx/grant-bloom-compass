
import React, { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Grant } from '@/types/grant';
import { parseFundingAmount } from '@/utils/filterHelpers';

interface FundingRange {
  min: number | null;
  max: number | null;
}

interface FundingRangeSliderProps {
  value: FundingRange;
  onChange: (range: FundingRange) => void;
  totalGrants: number;
  grantsInRange: number;
}

export const FundingRangeSlider = ({
  value,
  onChange,
  totalGrants,
  grantsInRange,
}: FundingRangeSliderProps) => {
  const [localMin, setLocalMin] = useState(value.min?.toString() || '');
  const [localMax, setLocalMax] = useState(value.max?.toString() || '');

  // Predefined funding ranges
  const fundingRanges = [
    { label: 'Under 100K', min: 0, max: 100000 },
    { label: '100K - 500K', min: 100000, max: 500000 },
    { label: '500K - 1M', min: 500000, max: 1000000 },
    { label: '1M - 5M', min: 1000000, max: 5000000 },
    { label: '5M+', min: 5000000, max: null },
  ];

  const handleRangeSelect = (range: { min: number; max: number | null }) => {
    onChange({ min: range.min, max: range.max });
    setLocalMin(range.min.toString());
    setLocalMax(range.max?.toString() || '');
  };

  const handleMinChange = (minValue: string) => {
    setLocalMin(minValue);
    const numValue = minValue ? parseInt(minValue, 10) : null;
    onChange({ min: numValue, max: value.max });
  };

  const handleMaxChange = (maxValue: string) => {
    setLocalMax(maxValue);
    const numValue = maxValue ? parseInt(maxValue, 10) : null;
    onChange({ min: value.min, max: numValue });
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M+ SEK`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K SEK`;
    }
    return `${amount} SEK`;
  };

  const isRangeActive = (range: { min: number; max: number | null }) => {
    return value.min === range.min && value.max === range.max;
  };

  return (
    <div className="space-y-4">
      {/* Quick selection buttons */}
      <div className="flex flex-wrap gap-2">
        {fundingRanges.map((range) => (
          <Button
            key={range.label}
            variant={isRangeActive(range) ? "default" : "outline"}
            size="sm"
            onClick={() => handleRangeSelect(range)}
            className={`text-xs h-7 ${
              isRangeActive(range) 
                ? "bg-white text-black border-gray-300" 
                : "bg-white hover:bg-gray-50 border-gray-300"
            }`}
          >
            {range.label}
          </Button>
        ))}
      </div>

      {/* Custom range inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Min amount</label>
          <Input
            type="number"
            placeholder="0"
            value={localMin}
            onChange={(e) => handleMinChange(e.target.value)}
            className="h-8 bg-white border-gray-300"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Max amount</label>
          <Input
            type="text"
            placeholder="No limit"
            value={localMax}
            onChange={(e) => handleMaxChange(e.target.value)}
            className="h-8 bg-white border-gray-300"
          />
        </div>
      </div>

      {/* Range display */}
      <div className="text-xs text-muted-foreground space-y-1">
        <div className="flex justify-between">
          <span>All amounts</span>
          <span className="font-medium">{grantsInRange} of {totalGrants} grants</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>0</span>
          <span>10M+ SEK</span>
        </div>
      </div>
    </div>
  );
};
