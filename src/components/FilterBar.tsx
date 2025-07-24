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
    <div className="flex-1 overflow-y-auto p-6 space-y-8">
      {/* Organization Filter */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-ink-obsidian">Organisation</h3>
          {filters.organizations?.length > 0 && <Button variant="link" size="sm" className="p-0 h-auto text-purple-600 font-semibold" onClick={() => onFiltersChange({
          organizations: []
        })}>
              Återställ
            </Button>}
        </div>
        <div className="space-y-4">
          {organizationOptions.map(org => <label key={org} className="flex items-center gap-3 cursor-pointer text-base text-ink-secondary">
              <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500" checked={filters.organizations?.includes(org)} onChange={e => {
            const newOrgs = e.target.checked ? [...(filters.organizations || []), org] : (filters.organizations || []).filter(o => o !== org);
            onFiltersChange({
              organizations: newOrgs
            });
          }} />
              <span>{org}</span>
            </label>)}
        </div>
      </div>
      <Separator className="bg-purple-200" />

      {/* Deadline Filter */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-ink-obsidian">Deadline</h3>
          {deadlineValue?.preset && <Button variant="link" size="sm" className="p-0 h-auto text-purple-600 font-semibold" onClick={() => onDeadlineChange({
          type: 'preset',
          preset: ''
        })}>
              Återställ
            </Button>}
        </div>
        <div className="relative">
             <select className="w-full bg-gray-100 border-transparent rounded-md text-base p-2 appearance-none">
              <option value="">Alla</option>
              <option value="urgent">Brådskande (7 dagar)</option>
              <option value="2weeks">Nästa 2 veckor</option>
              <option value="1month">Nästa månad</option>
              <option value="3months">Nästa 3 månader</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
        </div>
      </div>
      <Separator className="bg-purple-200" />

      {/* Industry Sector Filter */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-ink-obsidian">Bransch</h3>
          {filters.industrySectors?.length > 0 && <Button variant="link" size="sm" className="p-0 h-auto text-purple-600 font-semibold" onClick={() => onFiltersChange({
          industrySectors: []
        })}>
              Återställ
            </Button>}
        </div>
        <div className="space-y-4">
          {industryOptions.map(ind => <label key={ind} className="flex items-center gap-3 cursor-pointer text-base text-ink-secondary">
              <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500" checked={filters.industrySectors?.includes(ind)} onChange={e => {
            const newInds = e.target.checked ? [...(filters.industrySectors || []), ind] : (filters.industrySectors || []).filter(i => i !== ind);
            onFiltersChange({
              industrySectors: newInds
            });
          }} />
              <span>{ind}</span>
            </label>)}
        </div>
      </div>
      <Separator className="bg-purple-200" />

      {/* Eligible Applicant Filter */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-ink-obsidian">Stödberättigad sökande</h3>
          {filters.eligibleApplicants?.length > 0 && <Button variant="link" size="sm" className="p-0 h-auto text-purple-600 font-semibold" onClick={() => onFiltersChange({
          eligibleApplicants: []
        })}>
              Återställ
            </Button>}
        </div>
        <div className="space-y-4">
          {eligibleApplicantOptions.map(app => <label key={app} className="flex items-center gap-3 cursor-pointer text-base text-ink-secondary">
              <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500" checked={filters.eligibleApplicants?.includes(app)} onChange={e => {
            const newApps = e.target.checked ? [...(filters.eligibleApplicants || []), app] : (filters.eligibleApplicants || []).filter(a => a !== app);
            onFiltersChange({
              eligibleApplicants: newApps
            });
          }} />
              <span>{app}</span>
            </label>)}
        </div>
      </div>
      <Separator className="bg-purple-200" />

      {/* Boolean Filters */}
      <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            {(filters.consortiumRequired || filters.cofinancingRequired) && <Button variant="link" size="sm" className="p-0 h-auto text-purple-600 font-semibold" onClick={() => onFiltersChange({
          consortiumRequired: null,
          cofinancingRequired: null
        })}>
                Återställ
              </Button>}
          </div>
          <label className="flex items-center gap-3 cursor-pointer text-base text-ink-secondary">
              <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500" checked={filters.consortiumRequired === true} onChange={e => onFiltersChange({
          consortiumRequired: e.target.checked ? true : null
        })} />
              <span>Kräver consortium</span>
          </label>
           <label className="flex items-center gap-3 cursor-pointer text-base text-ink-secondary">
              <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500" checked={filters.cofinancingRequired === true} onChange={e => onFiltersChange({
          cofinancingRequired: e.target.checked ? true : null
        })} />
              <span>Kräver medfinansiering</span>
          </label>
      </div>
      <Separator className="bg-purple-200" />

       {/* Geographic Scope Filter */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-ink-obsidian">Region</h3>
          {filters.region?.length > 0 && <Button variant="link" size="sm" className="p-0 h-auto text-purple-600 font-semibold" onClick={() => onFiltersChange({
          region: []
        })}>
              Återställ
            </Button>}
        </div>
        <div className="space-y-4">
          {geographicScopeOptions.map(scope => <label key={scope} className="flex items-center gap-3 cursor-pointer text-base text-ink-secondary">
              <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500" checked={filters.region?.includes(scope)} onChange={e => {
            const newScopes = e.target.checked ? [...(filters.region || []), scope] : (filters.region || []).filter(s => s !== scope);
            onFiltersChange({
              region: newScopes
            });
          }} />
              <span>{scope}</span>
            </label>)}
        </div>
      </div>
    </div>

    {/* Footer with updated button styles */}
    
     <DrawerFooter className="p-4 border-t border-purple-200 bg-white flex-shrink-0 sticky bottom-0 flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center">
        <Button variant="ghost" onClick={onResetFilters} className="w-full sm:w-auto font-bold text-lg text-ink-obsidian">
            Återställ
        </Button>
        <DrawerClose asChild>
            <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg px-6 py-3 rounded-lg">
                Visa {totalGrantsCount} resultat
            </Button>
        </DrawerClose>
    </DrawerFooter>
     
  </>;
export const FilterBar: React.FC<FilterBarProps> = props => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const activeFilterCount = [props.filters.organizations?.length, props.fundingRange.min !== null || props.fundingRange.max !== null ? 1 : 0, props.deadlineValue?.preset ? 1 : 0, props.filters.industrySectors?.length, props.filters.eligibleApplicants?.length, props.filters.consortiumRequired ? 1 : 0, props.filters.cofinancingRequired ? 1 : 0, props.filters.region?.length].filter(Boolean).reduce((acc: number, count: any) => acc + (typeof count === 'number' ? count : 0), 0);
  const TriggerButton = <Button variant="outline" className="flex items-center gap-2 rounded-full px-3 py-1 bg-white border-gray-300 text-ink-obsidian font-medium text-xs shadow-none hover:bg-gray-50 min-h-0 h-7">
      <SlidersHorizontal className="w-4 h-4" />
      <span className="font-semibold">Filter</span>
      {activeFilterCount > 0 && <>
          <div className="h-4 border-l border-gray-300 mx-1"></div>
          <span className="bg-blue-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">{activeFilterCount}</span>
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
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
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
                   <SheetClose asChild><Button variant="ghost" size="icon" className="rounded-full h-8 w-8"><X className="w-4 h-4" /></Button></SheetClose>
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
  className={`flex items-center gap-1 rounded-full px-3 py-1 border border-gray-300 text-ink-obsidian font-medium text-xs shadow-none hover:bg-gray-50 min-h-0 h-7 ${filters.organizations?.length > 0 ? 'bg-[#cec5f9] text-white border-[#cec5f9]' : 'bg-white'}`}
>
  Organisation <ChevronDown className="w-4 h-4" />
</Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3" align="start">
                {organizationOptions.map(org => <label key={org} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={filters.organizations?.includes(org)} onChange={e => {
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
  className={`flex items-center gap-1 rounded-full px-3 py-1 border border-gray-300 text-ink-obsidian font-medium text-xs shadow-none hover:bg-gray-50 min-h-0 h-7 ${filters.industrySectors?.length > 0 ? 'bg-[#cec5f9] text-white border-[#cec5f9]' : 'bg-white'}`}
>
  Bransch <ChevronDown className="w-4 h-4" />
</Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3" align="start">
                <div className="space-y-3">
                  {industryOptions.map(ind => <label key={ind} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={filters.industrySectors?.includes(ind)} onChange={e => {
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
  className={`flex items-center gap-1 rounded-full px-3 py-1 border border-gray-300 text-ink-obsidian font-medium text-xs shadow-none hover:bg-gray-50 min-h-0 h-7 ${filters.eligibleApplicants?.length > 0 ? 'bg-[#cec5f9] text-white border-[#cec5f9]' : 'bg-white'}`}
>
  Stödberättigad sökande <ChevronDown className="w-4 h-4" />
</Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3" align="start">
                <div className="space-y-3">
                  {eligibleApplicantOptions.map(app => <label key={app} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={filters.eligibleApplicants?.includes(app)} onChange={e => {
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