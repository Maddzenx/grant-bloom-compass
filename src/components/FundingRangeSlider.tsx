
import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

// Preset funding ranges
const FUNDING_PRESETS = [
  { label: 'Under 100K', min: 0, max: 100000 },
  { label: '100K - 500K', min: 100000, max: 500000 },
  { label: '500K - 1M', min: 500000, max: 1000000 },
  { label: '1M - 5M', min: 1000000, max: 5000000 },
  { label: '5M+', min: 5000000, max: 50000000 },
];

const SLIDER_MIN = 0;
const SLIDER_MAX = 10000000; // 10M SEK

export const FundingRangeSlider = ({
  value,
  onChange,
  totalGrants,
  grantsInRange,
}: FundingRangeSliderProps) => {
  const [sliderValues, setSliderValues] = useState([
    value.min || SLIDER_MIN,
    value.max || SLIDER_MAX,
  ]);
  const [inputValues, setInputValues] = useState({
    min: value.min?.toString() || '',
    max: value.max?.toString() || '',
  });

  useEffect(() => {
    setSliderValues([
      value.min || SLIDER_MIN,
      value.max || SLIDER_MAX,
    ]);
    setInputValues({
      min: value.min?.toString() || '',
      max: value.max?.toString() || '',
    });
  }, [value]);

  const handleSliderChange = (values: number[]) => {
    setSliderValues(values);
    const [min, max] = values;
    onChange({
      min: min === SLIDER_MIN ? null : min,
      max: max === SLIDER_MAX ? null : max,
    });
  };

  const handleInputChange = (field: 'min' | 'max', inputValue: string) => {
    setInputValues(prev => ({ ...prev, [field]: inputValue }));
    
    const numValue = inputValue === '' ? null : parseInt(inputValue);
    if (numValue !== null && !isNaN(numValue)) {
      onChange({
        ...value,
        [field]: numValue,
      });
    } else if (inputValue === '') {
      onChange({
        ...value,
        [field]: null,
      });
    }
  };

  const handlePresetClick = (preset: typeof FUNDING_PRESETS[0]) => {
    onChange({
      min: preset.min,
      max: preset.max === 50000000 ? null : preset.max,
    });
  };

  const clearRange = () => {
    onChange({ min: null, max: null });
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M SEK`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K SEK`;
    }
    return `${amount} SEK`;
  };

  const hasActiveRange = value.min !== null || value.max !== null;

  return (
    <div className="space-y-4">
      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2">
        {FUNDING_PRESETS.map((preset) => (
          <Button
            key={preset.label}
            variant="outline"
            size="sm"
            onClick={() => handlePresetClick(preset)}
            className="text-xs h-7"
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {/* Slider */}
      <div className="px-2">
        <Slider
          value={sliderValues}
          onValueChange={handleSliderChange}
          max={SLIDER_MAX}
          min={SLIDER_MIN}
          step={10000}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0</span>
          <span>10M+ SEK</span>
        </div>
      </div>

      {/* Input fields */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">
            Min amount
          </label>
          <Input
            type="number"
            placeholder="0"
            value={inputValues.min}
            onChange={(e) => handleInputChange('min', e.target.value)}
            className="h-8 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">
            Max amount
          </label>
          <Input
            type="number"
            placeholder="No limit"
            value={inputValues.max}
            onChange={(e) => handleInputChange('max', e.target.value)}
            className="h-8 text-sm"
          />
        </div>
      </div>

      {/* Range display and stats */}
      <div className="flex items-center justify-between">
        <div className="text-sm">
          {hasActiveRange ? (
            <div className="flex items-center gap-2">
              <span>
                {value.min ? formatCurrency(value.min) : '0'} - {' '}
                {value.max ? formatCurrency(value.max) : 'No limit'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearRange}
                className="h-6 px-2 text-xs"
              >
                Clear
              </Button>
            </div>
          ) : (
            <span className="text-muted-foreground">All amounts</span>
          )}
        </div>
        <Badge variant="outline" className="text-xs">
          {grantsInRange} of {totalGrants} grants
        </Badge>
      </div>
    </div>
  );
};
