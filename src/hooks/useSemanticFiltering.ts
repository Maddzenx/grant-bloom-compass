import { useState, useCallback, useMemo } from 'react';
import { EnhancedFilterOptions } from './useFilterState';
import { GrantListItem } from '@/types/grant';
import { filterByEligibleOrganizations, filterByEligibleCostCategories } from '@/utils/robustFiltering';

interface UseSemanticFilteringOptions {
  semanticMatches: GrantListItem[] | undefined;
  filters: EnhancedFilterOptions;
  hasActiveFilters: boolean;
}

export const useSemanticFiltering = ({ 
  semanticMatches, 
  filters, 
  hasActiveFilters 
}: UseSemanticFilteringOptions) => {
  // Apply filters to semantic matches
  const filteredSemanticMatches = useMemo(() => {
    if (!semanticMatches || semanticMatches.length === 0) {
      return [];
    }

    // If no active filters, return all semantic matches
    if (!hasActiveFilters) {
      return semanticMatches;
    }

    console.log('🔍 Applying frontend filters to semantic matches:', {
      totalMatches: semanticMatches.length,
      activeFilters: {
        organizations: filters.organizations.length,
        statusFilter: filters.statusFilter,
        eligibleApplicants: filters.eligibleApplicants.length,
        fundingRange: filters.fundingRange,
        deadline: filters.deadline,
        tags: filters.tags.length,
        region: filters.region.length,
        consortiumRequired: filters.consortiumRequired,
        cofinancingRequired: filters.cofinancingRequired
      }
    });

    const filtered = semanticMatches.filter(grant => {
      // Status filter (Öppen/Kommande/Visa alla)
      if (filters.statusFilter && filters.statusFilter !== '') {
        const now = new Date();
        const today = now.toISOString().split('T')[0]; // YYYY-MM-DD format
        
        if (filters.statusFilter === 'open') {
          // Open grants: application_opening_date <= today <= application_closing_date
          const openingDate = grant.application_opening_date;
          const closingDate = grant.application_closing_date;
          
          if (!openingDate || !closingDate) {
            console.log('🔍 Status filter (open): Grant excluded - missing dates:', { id: grant.id, openingDate, closingDate });
            return false;
          }
          if (openingDate > today || closingDate < today) {
            console.log('🔍 Status filter (open): Grant excluded - outside date range:', { id: grant.id, openingDate, closingDate, today });
            return false;
          }
        } else if (filters.statusFilter === 'upcoming') {
          // Upcoming grants: application_opening_date > today
          const openingDate = grant.application_opening_date;
          
          if (!openingDate) {
            console.log('🔍 Status filter (upcoming): Grant excluded - missing opening date:', { id: grant.id });
            return false;
          }
          if (openingDate <= today) {
            console.log('🔍 Status filter (upcoming): Grant excluded - already opened:', { id: grant.id, openingDate, today });
            return false;
          }
        }
      }

      // Organization filter - use robust filtering for eligible organizations
      if (filters.organizations.length > 0) {
        const matchingGrants = filterByEligibleOrganizations([grant], filters.organizations);
        if (matchingGrants.length === 0) {
          return false;
        }
      }

      // Eligible applicants filter - use robust filtering for eligible organizations
      if (filters.eligibleApplicants.length > 0) {
        const matchingGrants = filterByEligibleOrganizations([grant], filters.eligibleApplicants);
        if (matchingGrants.length === 0) {
          console.log('🔍 Eligible applicants filter: Grant excluded - no match:', { 
            id: grant.id, 
            grantEligibleOrgs: grant.eligible_organisations,
            filterApplicants: filters.eligibleApplicants 
          });
          return false;
        }
      }

      // Funding range filter
      if (filters.fundingRange.min !== null || filters.fundingRange.max !== null) {
        const amount = grant.funding_amount_eur ?? parseFundingAmount(grant.fundingAmount);
        if (filters.fundingRange.min && amount < filters.fundingRange.min) return false;
        if (filters.fundingRange.max && amount > filters.fundingRange.max) return false;
      }

      // Deadline filter
      if (filters.deadline.preset && !isGrantWithinDeadline(grant, filters.deadline)) {
        return false;
      }

      // Tags filter
      if (filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag =>
          grant.tags.some(grantTag => grantTag.toLowerCase().includes(tag.toLowerCase()))
        );
        if (!hasMatchingTag) return false;
      }

      // Region filter
      if (filters.region.length > 0) {
        const regionMapping: { [key: string]: string[] } = {
          'EU': ['EU'],
          'Sverige': ['Nationellt'],
          'Regionalt': ['Regionalt']
        };

        const hasMatchingRegion = filters.region.some(region => {
          if (regionMapping[region]) {
            return regionMapping[region].some(scope => 
              grant.geographic_scope?.some(grantScope => 
                grantScope.toLowerCase().includes(scope.toLowerCase())
              )
            );
          }
          return false;
        });

        if (!hasMatchingRegion) return false;
      }

      // Cofinancing filter
      if (filters.cofinancingRequired !== null) {
        if (filters.cofinancingRequired === false && grant.cofinancing_required !== false) {
          return false;
        }
      }

      // Consortium filter
      if (filters.consortiumRequired !== null) {
        if (filters.consortiumRequired === false) {
          const consortiumRequirement = grant.consortium_requirement;
          if (consortiumRequirement && typeof consortiumRequirement === 'string') {
            const noRequirementPatterns = [
              'No requirements',
              'No requirement', 
              'No consortium required',
              'No consortium requirement'
            ];
            
            const hasNoRequirement = noRequirementPatterns.some(pattern =>
              consortiumRequirement.toLowerCase().includes(pattern.toLowerCase())
            );
            
            if (!hasNoRequirement) {
              console.log('🔍 Consortium filter: Grant excluded - has consortium requirement:', { 
                id: grant.id, 
                consortiumRequirement 
              });
              return false;
            }
          } else {
            console.log('🔍 Consortium filter: Grant excluded - missing consortium requirement info:', { 
              id: grant.id, 
              consortiumRequirement 
            });
            return false;
          }
        }
      }

      return true;
    });

    console.log('✅ Filtered semantic matches:', {
      original: semanticMatches.length,
      filtered: filtered.length,
      removed: semanticMatches.length - filtered.length
    });

    return filtered;
  }, [semanticMatches, filters, hasActiveFilters]);

  return {
    filteredSemanticMatches,
    isLoading: false,
    error: null
  };
};

// Helper functions
const parseFundingAmount = (fundingAmount: string): number => {
  if (!fundingAmount) return 0;
  
  const match = fundingAmount.match(/(\d+(?:[.,]\d+)?)\s*M?(SEK|EUR)/i);
  if (match) {
    const amount = parseFloat(match[1].replace(',', '.'));
    const currency = match[2].toUpperCase();
    
    // Convert SEK to EUR for comparison (approximate rate)
    if (currency === 'SEK') {
      return amount / 11; // Rough conversion rate
    }
    return amount;
  }
  
  return 0;
};

interface DeadlineFilter {
  preset?: string;
}

const isGrantWithinDeadline = (grant: GrantListItem, deadline: DeadlineFilter): boolean => {
  if (!deadline.preset) return true;
  
  const now = new Date();
  const closingDate = new Date(grant.application_closing_date);
  
  switch (deadline.preset) {
    case 'this-week':
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return closingDate <= weekFromNow;
    case 'this-month':
      const monthFromNow = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
      return closingDate <= monthFromNow;
    case 'next-3-months':
      const threeMonthsFromNow = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
      return closingDate <= threeMonthsFromNow;
    default:
      return true;
  }
}; 