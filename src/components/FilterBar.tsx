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
      {/* Status Filter */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 font-['Source_Sans_3']">Status</h3>
          {filters.statusFilter && <Button variant="link" size="sm" className="p-0 h-auto text-blue-600 font-semibold" onClick={() => onFiltersChange({
          statusFilter: ''
        })}>
            Rensa
          </Button>}
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-700 font-['Source_Sans_3']">
            <input type="radio" name="statusFilter" value="" checked={!filters.statusFilter} onChange={() => onFiltersChange({
            statusFilter: ''
          })} className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
            <span className="font-['Source_Sans_3']">Visa alla</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-700">
            <input type="radio" name="statusFilter" value="open" checked={filters.statusFilter === 'open'} onChange={() => onFiltersChange({
            statusFilter: 'open'
          })} className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
            <span>Öppen</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-700">
            <input type="radio" name="statusFilter" value="upcoming" checked={filters.statusFilter === 'upcoming'} onChange={() => onFiltersChange({
            statusFilter: 'upcoming'
          })} className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
            <span>Kommande</span>
          </label>
        </div>
      </div>
      <Separator className="bg-gray-200" />

      {/* Organization Filter */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 font-['Source_Sans_3']">Organisation</h3>
          {filters.organizations?.length > 0 && <Button variant="link" size="sm" className="p-0 h-auto text-blue-600 font-semibold" onClick={() => onFiltersChange({
          organizations: []
        })}>
            Rensa
          </Button>}
        </div>
        <div className="space-y-3">
          {organizationOptions.map(org => <label key={org} className="flex items-center gap-3 cursor-pointer text-sm text-gray-700">
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={filters.organizations?.includes(org)} onChange={e => {
            const newOrgs = e.target.checked ? [...(filters.organizations || []), org] : (filters.organizations || []).filter(o => o !== org);
            onFiltersChange({
              organizations: newOrgs
            });
          }} />
            <span>{org}</span>
          </label>)}
        </div>
      </div>
      <Separator className="bg-gray-200" />

      {/* Deadline Filter */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Deadline</h3>
          {deadlineValue?.preset && <Button variant="link" size="sm" className="p-0 h-auto text-blue-600 font-semibold" onClick={() => onDeadlineChange({
          type: 'preset',
          preset: ''
        })}>
            Rensa
          </Button>}
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-700 font-['Source_Sans_3']">
            <input type="radio" name="deadline" value="" checked={!deadlineValue?.preset} onChange={() => onDeadlineChange({
            type: 'preset',
            preset: ''
          })} className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
            <span className="font-['Source_Sans_3']">Visa alla</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-700">
            <input type="radio" name="deadline" value="urgent" checked={deadlineValue?.preset === 'urgent'} onChange={() => onDeadlineChange({
            type: 'preset',
            preset: 'urgent'
          })} className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
            <span>Brådskande (7 dagar)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-700">
            <input type="radio" name="deadline" value="2weeks" checked={deadlineValue?.preset === '2weeks'} onChange={() => onDeadlineChange({
            type: 'preset',
            preset: '2weeks'
          })} className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
            <span>Nästa 2 veckor</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-700">
            <input type="radio" name="deadline" value="1month" checked={deadlineValue?.preset === '1month'} onChange={() => onDeadlineChange({
            type: 'preset',
            preset: '1month'
          })} className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
            <span>Nästa månad</span>
          </label>
        </div>
      </div>
      <Separator className="bg-gray-200" />

      {/* Eligible Applicant Filter */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Stödberättigad sökande</h3>
          {filters.eligibleApplicants?.length > 0 && <Button variant="link" size="sm" className="p-0 h-auto text-blue-600 font-semibold" onClick={() => onFiltersChange({
          eligibleApplicants: []
        })}>
            Rensa
          </Button>}
        </div>
        <div className="space-y-3">
          {eligibleApplicantOptions.map(app => <label key={app} className="flex items-center gap-3 cursor-pointer text-sm text-gray-700">
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={filters.eligibleApplicants?.includes(app)} onChange={e => {
            const newApps = e.target.checked ? [...(filters.eligibleApplicants || []), app] : (filters.eligibleApplicants || []).filter(a => a !== app);
            onFiltersChange({
              eligibleApplicants: newApps
            });
          }} />
            <span>{app}</span>
          </label>)}
        </div>
      </div>
      <Separator className="bg-gray-200" />

      {/* Region Filter */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Region</h3>
          {filters.regions?.length > 0 && <Button variant="link" size="sm" className="p-0 h-auto text-blue-600 font-semibold" onClick={() => onFiltersChange({
          regions: []
        })}>
            Rensa
          </Button>}
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-700">
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={filters.regions?.includes('Sverige') || false} onChange={e => {
            const newRegions = e.target.checked ? [...(filters.regions || []), 'Sverige'] : (filters.regions || []).filter(r => r !== 'Sverige');
            onFiltersChange({
              regions: newRegions
            });
          }} />
            <span>Sverige</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-700">
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={filters.regions?.includes('EU') || false} onChange={e => {
            const newRegions = e.target.checked ? [...(filters.regions || []), 'EU'] : (filters.regions || []).filter(r => r !== 'EU');
            onFiltersChange({
              regions: newRegions
            });
          }} />
            <span>EU</span>
          </label>
        </div>
      </div>
      <Separator className="bg-gray-200" />

      {/* Övriga filter */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Övriga filter</h3>
          {(filters.noCofinancingRequired || filters.noConsortiumRequired) && <Button variant="link" size="sm" className="p-0 h-auto text-blue-600 font-semibold" onClick={() => onFiltersChange({
          noCofinancingRequired: false,
          noConsortiumRequired: false
        })}>
            Rensa
          </Button>}
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-700">
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={filters.noCofinancingRequired || false} onChange={e => {
            onFiltersChange({
              noCofinancingRequired: e.target.checked
            });
          }} />
            <span>Ej krav på medfinansering</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-700">
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={filters.noConsortiumRequired || false} onChange={e => {
            onFiltersChange({
              noConsortiumRequired: e.target.checked
            });
          }} />
            <span>Ej krav på konsortium</span>
          </label>
        </div>
      </div>
    </div>
    
    {/* Action Button */}
    <div className="p-6 border-t border-gray-200">
      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg">
        Visa {totalGrantsCount} bidrag
      </Button>
    </div>
  </>;
export const FilterBar: React.FC<FilterBarProps> = props => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const activeFilterCount = [props.filters.organizations?.length, props.fundingRange.min !== null || props.fundingRange.max !== null ? 1 : 0, props.deadlineValue?.preset ? 1 : 0, props.filters.industrySectors?.length, props.filters.eligibleApplicants?.length, props.filters.consortiumRequired ? 1 : 0, props.filters.cofinancingRequired ? 1 : 0, props.filters.region?.length, props.filters.statusFilter ? 1 : 0].filter(Boolean).reduce((acc: number, count: any) => acc + (typeof count === 'number' ? count : 0), 0);
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
  return <div className="w-full flex flex-col justify-start pb-2">
      <div className="flex flex-wrap items-center gap-3 mt-0 mb-0 pl-0 pb-2 -mt-2">



        {/* Organisation Filter */}
        <Popover>
            <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1 rounded-full px-5 py-3 border border-gray-300 text-gray-700 shadow-none hover:bg-gray-50 min-h-0 h-10 bg-white font-medium text-sm">
  {filters.statusFilter === 'open' ? 'Öppen' : filters.statusFilter === 'upcoming' ? 'Kommande' : 'Visa alla'} <ChevronDown className="w-4 h-4" />
          </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-4 bg-white border border-gray-200 shadow-lg rounded-lg" align="start">
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer text-base font-medium text-gray-700 hover:text-gray-900 transition-colors">
                    <input type="radio" name="statusFilter" value="" checked={!filters.statusFilter} onChange={() => onFiltersChange({
                statusFilter: ''
              })} className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                    <span className="font-['Source_Sans_3']">Visa alla</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer text-base font-medium text-gray-700 hover:text-gray-900 transition-colors">
                    <input type="radio" name="statusFilter" value="open" checked={filters.statusFilter === 'open'} onChange={() => onFiltersChange({
                statusFilter: 'open'
              })} className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                    <span>Öppen</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer text-base font-medium text-gray-700 hover:text-gray-900 transition-colors">
                    <input type="radio" name="statusFilter" value="upcoming" checked={filters.statusFilter === 'upcoming'} onChange={() => onFiltersChange({
                statusFilter: 'upcoming'
              })} className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                    <span>Kommande</span>
                  </label>
                </div>
            </PopoverContent>
        </Popover>
        <Popover>
            <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1 rounded-full px-5 py-3 border border-gray-300 text-gray-700 font-medium shadow-none hover:bg-gray-50 min-h-0 h-10 bg-white text-sm font-['Source_Sans_3']">
  Organisation {filters.organizations?.length > 0 && <span className="bg-blue-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs ml-1">{filters.organizations.length}</span>} <ChevronDown className="w-4 h-4" />
          </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-4 bg-white border border-gray-200 shadow-lg rounded-lg" align="start">
                <div className="space-y-3">
                  {organizationOptions.map(org => <label key={org} className="flex items-center gap-3 cursor-pointer text-base font-medium text-gray-700 hover:text-gray-900 transition-colors">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={filters.organizations?.includes(org)} onChange={e => {
                const newOrgs = e.target.checked ? [...(filters.organizations || []), org] : (filters.organizations || []).filter((o: string) => o !== org);
                onFiltersChange({
                  organizations: newOrgs
                });
              }} />
                    <span>{org}</span>
                    </label>)}
                </div>
            </PopoverContent>
        </Popover>

        {/* Stödberättigad sökande Filter */}
        <Popover>
            <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1 rounded-full px-5 py-3 border border-gray-300 text-gray-700 font-medium shadow-none hover:bg-gray-50 min-h-0 h-10 bg-white text-sm font-['Source_Sans_3']">
  Stödberättigad sökande {filters.eligibleApplicants?.length > 0 && <span className="bg-blue-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs ml-1">{filters.eligibleApplicants.length}</span>} <ChevronDown className="w-4 h-4" />
          </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-4 bg-white border border-gray-200 shadow-lg rounded-lg" align="start">
                <div className="space-y-3">
                  {eligibleApplicantOptions.map(app => <label key={app} className="flex items-center gap-3 cursor-pointer text-base font-medium text-gray-700 hover:text-gray-900 transition-colors">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={filters.eligibleApplicants?.includes(app)} onChange={e => {
                const newApps = e.target.checked ? [...(filters.eligibleApplicants || []), app] : (filters.eligibleApplicants || []).filter((a: string) => a !== app);
                onFiltersChange({
                  eligibleApplicants: newApps
                });
              }} />
                      <span>{app}</span>
                    </label>)}
                </div>
            </PopoverContent>
        </Popover>

        {/* Region Filter */}
        <Popover>
            <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1 rounded-full px-5 py-3 border border-gray-300 text-gray-700 font-medium shadow-none hover:bg-gray-50 min-h-0 h-10 bg-white text-sm font-['Source_Sans_3']">
  Region {filters.regions?.length > 0 && <span className="bg-blue-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs ml-1">{filters.regions.length}</span>} <ChevronDown className="w-4 h-4" />
          </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-4 bg-white border border-gray-200 shadow-lg rounded-lg" align="start">
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer text-base font-medium text-gray-700 hover:text-gray-900 transition-colors">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={filters.regions?.includes('Sverige') || false} onChange={e => {
                const newRegions = e.target.checked ? [...(filters.regions || []), 'Sverige'] : (filters.regions || []).filter(r => r !== 'Sverige');
                onFiltersChange({
                  regions: newRegions
                });
              }} />
                    <span>Sverige</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer text-base font-medium text-gray-700 hover:text-gray-900 transition-colors">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={filters.regions?.includes('EU') || false} onChange={e => {
                const newRegions = e.target.checked ? [...(filters.regions || []), 'EU'] : (filters.regions || []).filter(r => r !== 'EU');
                onFiltersChange({
                  regions: newRegions
                });
              }} />
                    <span>EU</span>
                  </label>
                </div>
            </PopoverContent>
        </Popover>

        {/* Övriga filter */}
        <Popover>
            <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1 rounded-full px-5 py-3 border border-gray-300 text-gray-700 font-medium shadow-none hover:bg-gray-50 min-h-0 h-10 bg-white text-sm font-['Source_Sans_3']">
  Övriga filter {(filters.noCofinancingRequired || filters.noConsortiumRequired) && <span className="bg-blue-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs ml-1">{(filters.noCofinancingRequired ? 1 : 0) + (filters.noConsortiumRequired ? 1 : 0)}</span>} <ChevronDown className="w-4 h-4" />
          </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-4 bg-white border border-gray-200 shadow-lg rounded-lg" align="start">
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer text-base font-medium text-gray-700 hover:text-gray-900 transition-colors">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={filters.noCofinancingRequired || false} onChange={e => {
                onFiltersChange({
                  noCofinancingRequired: e.target.checked
                });
              }} />
                    <span>Ej krav på medfinansering</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer text-base font-medium text-gray-700 hover:text-gray-900 transition-colors">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={filters.noConsortiumRequired || false} onChange={e => {
                onFiltersChange({
                  noConsortiumRequired: e.target.checked
                });
              }} />
                    <span>Ej krav på konsortium</span>
                  </label>
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