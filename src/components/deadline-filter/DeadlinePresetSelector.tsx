
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { DEADLINE_PRESETS } from './types';

interface DeadlinePresetSelectorProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
}

export const DeadlinePresetSelector = ({
  selectedValue,
  onValueChange,
}: DeadlinePresetSelectorProps) => {
  return (
    <RadioGroup value={selectedValue} onValueChange={onValueChange}>
      {DEADLINE_PRESETS.map((preset) => (
        <div key={preset.id} className="flex items-center space-x-2">
          <RadioGroupItem value={preset.id} id={preset.id} />
          <Label htmlFor={preset.id} className="text-sm cursor-pointer flex-1">
            {preset.label}
          </Label>
        </div>
      ))}
      
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="custom" id="custom" />
        <Label htmlFor="custom" className="text-sm cursor-pointer">
          Custom range
        </Label>
      </div>
    </RadioGroup>
  );
};
