
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format, addDays, addMonths, addWeeks } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface DeadlineFilter {
  type: 'preset' | 'custom';
  preset?: string;
  customRange?: {
    start: Date | null;
    end: Date | null;
  };
}

interface EnhancedDeadlineFilterProps {
  value: DeadlineFilter;
  onChange: (filter: DeadlineFilter) => void;
  grantsCount: number;
}

const DEADLINE_PRESETS = [
  { id: 'urgent', label: 'Urgent (7 days)', getDates: () => ({ start: new Date(), end: addDays(new Date(), 7) }) },
  { id: '2weeks', label: 'Next 2 weeks', getDates: () => ({ start: new Date(), end: addWeeks(new Date(), 2) }) },
  { id: '1month', label: 'Next month', getDates: () => ({ start: new Date(), end: addMonths(new Date(), 1) }) },
  { id: '3months', label: 'Next 3 months', getDates: () => ({ start: new Date(), end: addMonths(new Date(), 3) }) },
  { id: '6months', label: 'Next 6 months', getDates: () => ({ start: new Date(), end: addMonths(new Date(), 6) }) },
  { id: '1year', label: 'Next year', getDates: () => ({ start: new Date(), end: addMonths(new Date(), 12) }) },
];

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

  const getDisplayText = () => {
    if (value.type === 'preset' && value.preset) {
      const preset = DEADLINE_PRESETS.find(p => p.id === value.preset);
      return preset?.label || 'Custom range';
    }
    
    if (value.type === 'custom' && (value.customRange?.start || value.customRange?.end)) {
      const start = value.customRange.start ? format(value.customRange.start, 'MMM dd') : 'Any';
      const end = value.customRange.end ? format(value.customRange.end, 'MMM dd') : 'Any';
      return `${start} - ${end}`;
    }
    
    return 'All deadlines';
  };

  const hasActiveFilter = value.preset || value.customRange?.start || value.customRange?.end;

  return (
    <div className="space-y-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between h-8 px-3",
              hasActiveFilter && "border-blue-500 bg-blue-50"
            )}
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{getDisplayText()}</span>
            </div>
            <CalendarIcon className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filter by deadline</h4>
              {hasActiveFilter && (
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

            <RadioGroup
              value={value.type === 'preset' ? value.preset : 'custom'}
              onValueChange={(selected) => {
                if (selected === 'custom') {
                  onChange({ type: 'custom', customRange: { start: null, end: null } });
                } else {
                  handlePresetChange(selected);
                }
              }}
            >
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

            {value.type === 'custom' && (
              <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">From</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal h-8"
                        >
                          {customStartDate ? (
                            format(customStartDate, "MMM dd, yyyy")
                          ) : (
                            <span className="text-muted-foreground">Any date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={customStartDate}
                          onSelect={setCustomStartDate}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-muted-foreground">To</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal h-8"
                        >
                          {customEndDate ? (
                            format(customEndDate, "MMM dd, yyyy")
                          ) : (
                            <span className="text-muted-foreground">Any date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={customEndDate}
                          onSelect={setCustomEndDate}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  onClick={handleCustomRangeChange}
                  className="w-full h-7"
                >
                  Apply custom range
                </Button>
              </div>
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
