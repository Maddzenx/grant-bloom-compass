import React, { useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "./ui/sheet";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter, DrawerClose } from "./ui/drawer";
import { Separator } from "./ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
interface FilterBarProps {
  filters: any;
  onFiltersChange: (filters: Partial<any>) => void;
  onResetFilters: () => void;
  organizationOptions: string[];
  fundingRange: {
    min: number | null;
    max: number | null;
  };
  onFundingRangeChange: (range: {
    min: number | null;
    max: number | null;
  }) => void;
  deadlineValue: any;
  onDeadlineChange: (val: any) => void;
  industryOptions: string[];
  eligibleApplicantOptions: string[];
  geographicScopeOptions: string[];
  totalGrantsCount: number;
}
const FilterContent = ({
  filters,
  onFiltersChange,
  onResetFilters,
  organizationOptions,
  fundingRange,
  onFundingRangeChange,
  deadlineValue,
  onDeadlineChange,
  industryOptions,
  eligibleApplicantOptions,
  geographicScopeOptions,
  totalGrantsCount
}) => <>
    <div className="flex-1 overflow-y-auto p-6 space-y-6">

      {/* Organization Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Organisation</h3>
          {filters.organizations?.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-2 py-1 h-auto" 
              onClick={() => onFiltersChange({ organizations: [] })}
            >
              Återställ
            </Button>
          )}
        </div>
        <div className="space-y-3">
          {organizationOptions.map(org => (
            <label key={org} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-md transition-colors">
              <input 
                type="checkbox" 
                className="h-4 w-4 rounded border-gray-300" 
                checked={filters.organizations?.includes(org)} 
                onChange={e => {
                  const newOrgs = e.target.checked 
                    ? [...(filters.organizations || []), org] 
                    : (filters.organizations || []).filter(o => o !== org);
                  onFiltersChange({ organizations: newOrgs });
                }} 
              />
              <span className="text-xs text-gray-700 group-hover:text-gray-900">{org}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Deadline Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Deadline</h3>
          {deadlineValue?.preset && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-2 py-1 h-auto" 
              onClick={() => onDeadlineChange({ type: 'preset', preset: '' })}
            >
              Återställ
            </Button>
          )}
        </div>
        <div className="relative">
          <select className="w-full bg-gray-50 border border-gray-200 rounded-lg text-xs p-3 appearance-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors">
            <option value="">Alla deadlines</option>
            <option value="urgent">Brådskande (7 dagar)</option>
            <option value="2weeks">Nästa 2 veckor</option>
            <option value="1month">Nästa månad</option>
            <option value="3months">Nästa 3 månader</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Industry Sector Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Bransch</h3>
          {filters.industrySectors?.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-2 py-1 h-auto" 
              onClick={() => onFiltersChange({ industrySectors: [] })}
            >
              Återställ
            </Button>
          )}
        </div>
        <div className="space-y-3">
          {industryOptions.map(ind => (
            <label key={ind} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-md transition-colors">
              <input 
                type="checkbox" 
                className="h-4 w-4 rounded border-gray-300" 
                checked={filters.industrySectors?.includes(ind)} 
                onChange={e => {
                  const newInds = e.target.checked 
                    ? [...(filters.industrySectors || []), ind] 
                    : (filters.industrySectors || []).filter(i => i !== ind);
                  onFiltersChange({ industrySectors: newInds });
                }} 
              />
              <span className="text-xs text-gray-700 group-hover:text-gray-900">{ind}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Eligible Applicant Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Stödberättigad sökande</h3>
          {filters.eligibleApplicants?.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-2 py-1 h-auto" 
              onClick={() => onFiltersChange({ eligibleApplicants: [] })}
            >
              Återställ
            </Button>
          )}
        </div>
        <div className="space-y-3">
          {eligibleApplicantOptions.map(app => (
            <label key={app} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-md transition-colors">
              <input 
                type="checkbox" 
                className="h-4 w-4 rounded border-gray-300" 
                checked={filters.eligibleApplicants?.includes(app)} 
                onChange={e => {
                  const newApps = e.target.checked 
                    ? [...(filters.eligibleApplicants || []), app] 
                    : (filters.eligibleApplicants || []).filter(a => a !== app);
                  onFiltersChange({ eligibleApplicants: newApps });
                }} 
              />
              <span className="text-xs text-gray-700 group-hover:text-gray-900">{app}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Requirements Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Krav</h3>
          {(filters.consortiumRequired || filters.cofinancingRequired) && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-2 py-1 h-auto" 
              onClick={() => onFiltersChange({
                consortiumRequired: null,
                cofinancingRequired: null
              })}
            >
              Återställ
            </Button>
          )}
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-md transition-colors">
            <input 
              type="checkbox" 
              className="h-4 w-4 rounded border-gray-300" 
              checked={filters.consortiumRequired === true} 
              onChange={e => onFiltersChange({
                consortiumRequired: e.target.checked ? true : null
              })} 
            />
            <span className="text-xs text-gray-700 group-hover:text-gray-900">Kräver consortium</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-md transition-colors">
            <input 
              type="checkbox" 
              className="h-4 w-4 rounded border-gray-300" 
              checked={filters.cofinancingRequired === true} 
              onChange={e => onFiltersChange({
                cofinancingRequired: e.target.checked ? true : null
              })} 
            />
            <span className="text-xs text-gray-700 group-hover:text-gray-900">Kræver medfinansiering</span>
          </label>
        </div>
      </div>

      {/* Geographic Scope Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Region</h3>
          {filters.region?.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-2 py-1 h-auto" 
              onClick={() => onFiltersChange({ region: [] })}
            >
              Återställ
            </Button>
          )}
        </div>
        <div className="space-y-3">
          {geographicScopeOptions.map(scope => (
            <label key={scope} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-md transition-colors">
              <input 
                type="checkbox" 
                className="h-4 w-4 rounded border-gray-300" 
                checked={filters.region?.includes(scope)} 
                onChange={e => {
                  const newScopes = e.target.checked 
                    ? [...(filters.region || []), scope] 
                    : (filters.region || []).filter(s => s !== scope);
                  onFiltersChange({ region: newScopes });
                }} 
              />
              <span className="text-xs text-gray-700 group-hover:text-gray-900">{scope}</span>
            </label>
          ))}
        </div>
      </div>
    </div>

    {/* Enhanced Footer */}
    <DrawerFooter className="p-6 border-t border-gray-200 bg-white flex-shrink-0 sticky bottom-0">
      <div className="w-full flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4">
        <Button 
          variant="outline" 
          onClick={onResetFilters} 
          className="w-full sm:w-auto font-medium text-xs text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 px-6 py-3 rounded-lg transition-all duration-200"
        >
          Återställ alla filter
        </Button>
        <DrawerClose asChild>
          <Button 
            className="w-full sm:w-auto text-white font-semibold text-xs px-8 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md" 
            style={{ backgroundColor: '#8B5CF6' }}
          >
            Visa {totalGrantsCount} resultat
          </Button>
        </DrawerClose>
      </div>
    </DrawerFooter>
     
  </>;
export const FilterBar: React.FC<FilterBarProps> = props => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const activeFilterCount = [props.filters.organizations?.length, props.fundingRange.min !== null || props.fundingRange.max !== null ? 1 : 0, props.deadlineValue?.preset ? 1 : 0, props.filters.industrySectors?.length, props.filters.eligibleApplicants?.length, props.filters.consortiumRequired ? 1 : 0, props.filters.cofinancingRequired ? 1 : 0, props.filters.region?.length, props.filters.statusFilter ? 1 : 0].filter(Boolean).reduce((acc: number, count: any) => acc + (typeof count === 'number' ? count : 0), 0);
  const TriggerButton = <Button variant="outline" className="flex items-center gap-2 rounded-lg px-3 py-1 bg-white border-gray-300 text-ink-obsidian font-medium text-xs shadow-none hover:bg-gray-50 min-h-0 h-7">
      <SlidersHorizontal className="w-4 h-4" />
      <span className="text-black">Alla filter</span>
      {activeFilterCount > 0 && <>
          <div className="h-4 border-l border-gray-300 mx-1"></div>
          <span className="bg-[#D7CFFC] text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">{activeFilterCount}</span>
        </>}
    </Button>;
  const {
    filters,
    onFiltersChange,
    organizationOptions,
    fundingRange,
    onFundingRangeChange,
    deadlineValue,
    onDeadlineChange,
    industryOptions,
    eligibleApplicantOptions,
    geographicScopeOptions
  } = props;
  return <div className="w-full flex flex-col justify-start bg-canvas-cloud pb-2">
      <div className="flex flex-row items-center gap-2 mt-0 mb-0 overflow-x-auto pb-2 scrollbar-hide">
        {isMobile ? <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>{TriggerButton}</DrawerTrigger>
            <DrawerContent className="h-[90%] bg-white">
               <DrawerHeader className="flex justify-between items-center p-4 border-b">
                <DrawerTitle>Filter</DrawerTitle>
                <DrawerClose asChild>
                    <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8">
                        <X className="w-4 h-4" />
                    </Button>
                </DrawerClose>
            </DrawerHeader>
              <FilterContent {...props} />
            </DrawerContent>
          </Drawer> : <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>{TriggerButton}</SheetTrigger>
            <SheetContent className="w-full sm:max-w-md p-0 flex flex-col bg-white">
              <SheetHeader className="p-4 border-b sticky top-0 bg-white z-10">
                 <SheetTitle className="flex justify-between items-center">
                  <span>Filter</span>
                   <SheetClose asChild><Button variant="ghost" size="icon" className="rounded-lg h-8 w-8"><X className="w-6 h-6" /></Button></SheetClose>
                </SheetTitle>
              </SheetHeader>
              <FilterContent {...props} />
            </SheetContent>
          </Sheet>}

        <div className="h-4 border-l border-gray-300 mx-1"></div>
        {/* Organisation Filter */}
        <Popover>
            <PopoverTrigger asChild>
            <Button
  variant="outline"
  className={`flex items-center gap-1 rounded-lg px-3 py-1 border border-gray-300 text-ink-obsidian font-medium text-xs shadow-none hover:bg-gray-50 min-h-0 h-7 ${filters.statusFilter ? 'bg-white' : 'bg-white'}`}
  style={filters.statusFilter ? { backgroundColor: '#CEC5F9', borderColor: '#CEC5F9' } : {}}
>
  {filters.statusFilter === 'open' ? 'Öppen' : filters.statusFilter === 'upcoming' ? 'Kommande' : 'Status'} <ChevronDown className="w-4 h-4" />
</Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-3 bg-white border border-gray-200" align="start">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                    <input
                      type="radio"
                      name="statusFilter"
                      value=""
                      checked={!filters.statusFilter}
                      onChange={() => onFiltersChange({ statusFilter: '' })}
                    />
                    Alla
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                    <input
                      type="radio"
                      name="statusFilter"
                      value="open"
                      checked={filters.statusFilter === 'open'}
                      onChange={() => onFiltersChange({ statusFilter: 'open' })}
                    />
                    Öppen
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                    <input
                      type="radio"
                      name="statusFilter"
                      value="upcoming"
                      checked={filters.statusFilter === 'upcoming'}
                      onChange={() => onFiltersChange({ statusFilter: 'upcoming' })}
                    />
                    Kommande
                  </label>
                </div>
            </PopoverContent>
        </Popover>
        <Popover>
            <PopoverTrigger asChild>
            <Button
  variant="outline"
  className={`flex items-center gap-1 rounded-lg px-3 py-1 border border-gray-300 text-ink-obsidian font-medium text-xs shadow-none hover:bg-gray-50 min-h-0 h-7 ${filters.organizations?.length > 0 ? 'bg-white' : 'bg-white'}`}
  style={filters.organizations?.length > 0 ? { backgroundColor: '#CEC5F9', borderColor: '#CEC5F9' } : {}}
>
  Organisation <ChevronDown className="w-4 h-4" />
</Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3 bg-white border border-gray-200" align="start">
                {organizationOptions.map(org => <label key={org} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300" checked={filters.organizations?.includes(org)} onChange={e => {
              const newOrgs = e.target.checked ? [...(filters.organizations || []), org] : (filters.organizations || []).filter((o: string) => o !== org);
              onFiltersChange({ organizations: newOrgs });
            }} />
                    <span>{org}</span>
                    </label>)}
            </PopoverContent>
        </Popover>

        {/* Bransch Filter */}
        <Popover>
            <PopoverTrigger asChild>
            <Button
  variant="outline"
  className={`flex items-center gap-1 rounded-lg px-3 py-1 border border-gray-300 text-ink-obsidian font-medium text-xs shadow-none hover:bg-gray-50 min-h-0 h-7 ${filters.industrySectors?.length > 0 ? 'bg-white' : 'bg-white'}`}
  style={filters.industrySectors?.length > 0 ? { backgroundColor: '#CEC5F9', borderColor: '#CEC5F9' } : {}}
>
  Bransch <ChevronDown className="w-4 h-4" />
</Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3 bg-white border border-gray-200" align="start">
                <div className="space-y-3">
                  {industryOptions.map(ind => <label key={ind} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300" checked={filters.industrySectors?.includes(ind)} onChange={e => {
                const newInds = e.target.checked ? [...(filters.industrySectors || []), ind] : (filters.industrySectors || []).filter((i: string) => i !== ind);
                onFiltersChange({ industrySectors: newInds });
              }} />
                      <span>{ind}</span>
                    </label>)}
                </div>
            </PopoverContent>
        </Popover>

        {/* Stödberättigad sökande Filter */}
        <Popover>
            <PopoverTrigger asChild>
            <Button
  variant="outline"
  className={`flex items-center gap-1 rounded-lg px-3 py-1 border border-gray-300 text-ink-obsidian font-medium text-xs shadow-none hover:bg-gray-50 min-h-0 h-7 ${filters.eligibleApplicants?.length > 0 ? 'bg-white' : 'bg-white'}`}
  style={filters.eligibleApplicants?.length > 0 ? { backgroundColor: '#CEC5F9', borderColor: '#CEC5F9' } : {}}
>
  Stödberättigad sökande <ChevronDown className="w-4 h-4" />
</Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3 bg-white border border-gray-200" align="start">
                <div className="space-y-3">
                  {eligibleApplicantOptions.map(app => <label key={app} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300" checked={filters.eligibleApplicants?.includes(app)} onChange={e => {
                const newApps = e.target.checked ? [...(filters.eligibleApplicants || []), app] : (filters.eligibleApplicants || []).filter((a: string) => a !== app);
                onFiltersChange({ eligibleApplicants: newApps });
              }} />
                      <span>{app}</span>
                    </label>)}
                </div>
            </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-wrap gap-1 mt-2 px-1">
        {/* All filter chips go here */}
      </div>
    </div>;
};
export default FilterBar;