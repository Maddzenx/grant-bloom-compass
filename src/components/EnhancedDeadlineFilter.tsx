
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { DeadlineFilter } from './deadline-filter/types';
import { DeadlinePresetSelector } from './deadline-filter/DeadlinePresetSelector';
import { CustomDateRangePicker } from './deadline-filter/CustomDateRangePicker';
import { getDisplayText, hasActiveFilter } from './deadline-filter/utils';

interface EnhancedDeadlineFilterProps {
  value: DeadlineFilter;
  onChange: (filter: DeadlineFilter) => void;
  grantsCount: number;
}

export const EnhancedDeadlineFilter = ({
  value,
  onChange,
  grantsCount,
}: EnhancedDeadlineFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(
    value.customRange?.start || undefined
  );
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(
    value.customRange?.end || undefined
  );

  const handlePresetChange = (presetId: string) => {
    onChange({
      type: 'preset',
      preset: presetId,
    });
  };

  const handleCustomRangeChange = () => {
    onChange({
      type: 'custom',
      customRange: {
        start: customStartDate || null,
        end: customEndDate || null,
      },
    });
  };

  const clearFilter = () => {
    onChange({
      type: 'preset',
      preset: '',
    });
    setCustomStartDate(undefined);
    setCustomEndDate(undefined);
  };

  const handleRadioChange = (selected: string) => {
    if (selected === 'custom') {
      onChange({ type: 'custom', customRange: { start: null, end: null } });
    } else {
      handlePresetChange(selected);
    }
  };

  const displayText = getDisplayText(value);
  const isFilterActive = hasActiveFilter(value);

  return (
    <div className="space-y-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between h-8 px-3",
              isFilterActive && "border-blue-500 bg-blue-50"
            )}
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{displayText}</span>
            </div>
            <CalendarIcon className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filter by deadline</h4>
              {isFilterActive && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilter}
                  className="h-6 px-2 text-xs"
                >
                  Clear
                </Button>
              )}
            </div>

            <DeadlinePresetSelector
              selectedValue={value.type === 'preset' ? value.preset || '' : 'custom'}
              onValueChange={handleRadioChange}
            />

            {value.type === 'custom' && (
              <CustomDateRangePicker
                startDate={customStartDate}
                endDate={customEndDate}
                onStartDateChange={setCustomStartDate}
                onEndDateChange={setCustomEndDate}
                onApplyRange={handleCustomRangeChange}
              />
            )}
          </div>
        </PopoverContent>
      </Popover>
      
      <div className="text-xs text-muted-foreground">
        {grantsCount} grants match
      </div>
    </div>
  );
};
