import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ConsolidatedGrantList from "@/components/ConsolidatedGrantList";
import { GrantListItem } from "@/types/grant";
import { AIGrantMatch } from "@/hooks/useAIGrantSearch";
import { Button } from "@/components/ui/button";

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
  
  const grantsToShow = isMobile ? grants.slice(0, numVisibleGrants) : grants.slice((currentPage - 1) * grantsPerPage, currentPage * grantsPerPage);

  // Handle manual load more for mobile
  const handleLoadMore = React.useCallback(() => {
    if (isMobile && hasMoreBackend && onPageChange && pagination && !isLoadingMore) {
      console.log('📱 Mobile: Loading next page manually...', {
        currentPage: pagination.page,
        totalPages: pagination.totalPages,
        hasMore: hasMoreBackend
      });
      
      setIsLoadingMore(true);
      onPageChange(pagination.page + 1);
      
      // Reset loading state after a delay
      setTimeout(() => {
        setIsLoadingMore(false);
      }, 1000);
    }
  }, [isMobile, hasMoreBackend, onPageChange, pagination, isLoadingMore]);

  React.useEffect(() => {
    if (isMobile) {
      // For mobile, set visible grants to show all accumulated grants
      setNumVisibleGrants(grants.length);
    } else {
      // For desktop, reset to 15 per page
      setNumVisibleGrants(15);
      setCurrentPage(1);
    }
  }, [grants, isMobile]);

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
    isLoadingMore,
    showPagination: !isMobile && (pagination?.totalPages || Math.ceil(grants.length / grantsPerPage)) > 1
  });

  return (
    <div className="w-full bg-canvas-cloud h-full overflow-hidden flex flex-col">

      <ScrollArea className="flex-1" ref={scrollAreaRef}>
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
        {/* Manual Load More Text for Mobile */}
        {isMobile && hasMore && (
          <div className="flex flex-col items-center justify-center py-6 px-4">
            {isLoadingMore ? (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#7D54F4]"></div>
                <span>Laddar fler bidrag...</span>
              </div>
            ) : (
                             <button
                 onClick={handleLoadMore}
                 disabled={isLoadingMore}
                 className="text-xs text-gray-700 hover:text-gray-900 text-center underline hover:no-underline transition-colors cursor-pointer"
               >
                Klicka för att ladda fler bidrag
              </button>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default GrantList;
