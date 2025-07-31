import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import ConsolidatedGrantList from "@/components/ConsolidatedGrantList";
import { GrantListItem } from "@/types/grant";
import { AIGrantMatch } from "@/hooks/useAIGrantSearch";

interface GrantListProps {
  grants: GrantListItem[];
  selectedGrant: GrantListItem | null;
  onGrantSelect: (grant: GrantListItem) => void;
  onToggleBookmark: (grantId: string) => void;
  searchTerm: string;
  isMobile: boolean;
  aiMatches?: AIGrantMatch[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  onPageChange?: (page: number) => void;
}

const GrantList = ({
  grants,
  selectedGrant,
  onGrantSelect,
  onToggleBookmark,
  searchTerm,
  isMobile,
  aiMatches,
  pagination,
  onPageChange
}: GrantListProps) => {
  const [numVisibleGrants, setNumVisibleGrants] = React.useState(15);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const grantsPerPage = 15;
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  // For mobile: use backend pagination to determine if there are more grants
  const hasMoreBackend = pagination?.hasMore || false;
  const hasMoreLocal = numVisibleGrants < grants.length;
  const hasMore = isMobile ? hasMoreBackend : hasMoreLocal;
  const totalPages = pagination?.totalPages || Math.ceil(grants.length / grantsPerPage);
  
  // For mobile: show only the first 15 grants initially, then load more as user scrolls
  const grantsToShow = isMobile 
    ? grants.slice(0, Math.min(numVisibleGrants, grants.length)) 
    : grants.slice((currentPage - 1) * grantsPerPage, currentPage * grantsPerPage);

  // Removed automatic loading for mobile - users must manually load more

  React.useEffect(() => {
    if (isMobile) {
      // For mobile: start with 15 grants, load more as user scrolls
      if (grants.length > 0 && numVisibleGrants === 15) {
        // Keep current numVisibleGrants, don't change it
        console.log('📱 Mobile: Starting with 15 grants, will load more on scroll');
      }
    } else {
      // For desktop, reset to 15 per page
      setNumVisibleGrants(15);
      setCurrentPage(1);
    }
  }, [grants, isMobile, numVisibleGrants]);

  // Removed scroll event listener for mobile - users must manually load more

  // Reset loading state when grants change (new page loaded) or when numVisibleGrants changes
  React.useEffect(() => {
    setIsLoadingMore(false);
  }, [grants.length, numVisibleGrants]);

  // Debug pagination data
  console.log('🔍 GrantList pagination debug:', {
    isMobile,
    pagination,
    currentPage: pagination?.page || currentPage,
    totalPages: pagination?.totalPages || Math.ceil(grants.length / grantsPerPage),
    grantsLength: grants.length,
    numVisibleGrants,
    grantsToShowLength: grantsToShow.length,
    hasMore,
    hasMoreBackend,
    hasMoreLocal,
    grantsPerPage,
    showPagination: !isMobile && (pagination?.totalPages || Math.ceil(grants.length / grantsPerPage)) > 1
  });

  return (
    <div className="w-full bg-canvas-cloud h-full overflow-hidden flex flex-col relative z-10">
      {/* Mobile Progress Indicator - Removed for cleaner mobile experience */}
      <ScrollArea className="flex-1 pointer-events-auto" ref={scrollAreaRef}>
        <ConsolidatedGrantList
          grants={grantsToShow}
          selectedGrant={selectedGrant}
          onGrantSelect={onGrantSelect}
          onToggleBookmark={onToggleBookmark}
          searchTerm={searchTerm}
          isMobile={isMobile}
          aiMatches={aiMatches}
          currentPage={pagination?.page || currentPage}
          totalPages={pagination?.totalPages || Math.ceil(grants.length / grantsPerPage)}
          totalCount={pagination?.total || grants.length}
          onPageChange={onPageChange || setCurrentPage}
        />
        {isMobile && hasMore && (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            {/* Manual load more button */}
            <Button 
              onClick={() => {
                if (!isLoadingMore && hasMore) {
                  setIsLoadingMore(true);
                  
                  if (numVisibleGrants >= grants.length && hasMoreBackend && onPageChange && pagination) {
                    // We've shown all local grants, load next page from backend
                    onPageChange(pagination.page + 1);
                  } else if (numVisibleGrants < grants.length) {
                    // We have more local grants to show
                    setNumVisibleGrants(prev => Math.min(prev + 15, grants.length));
                  }
                }
              }}
              variant="outline" 
              size="sm"
              disabled={isLoadingMore}
              className="text-xs px-4 py-2 border-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              {isLoadingMore ? 'Laddar...' : 'Ladda fler bidrag'}
            </Button>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default GrantList;
