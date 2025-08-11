import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ConsolidatedGrantList from "@/components/ConsolidatedGrantList";
import { GrantListItem } from "@/types/grant";
import { AIGrantMatch } from "@/hooks/useAIGrantSearch";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
  // New: show skeleton placeholders while fetching
  isLoadingList?: boolean;
  // New: scroll retention
  onScrollPositionChange?: (scrollTop: number) => void;
  restoreScrollTop?: number | null;
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
  onPageChange,
  isLoadingList = false,
  onScrollPositionChange,
  restoreScrollTop = null
}: GrantListProps) => {
  const [numVisibleGrants, setNumVisibleGrants] = React.useState(15);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const grantsPerPage = 15;
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const [scrollTick, setScrollTick] = React.useState(0);

  // Observe list scroll and report
  React.useEffect(() => {
    const root = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement | null;
    if (!root) return;
    const handle = () => {
      if (onScrollPositionChange) onScrollPositionChange(root.scrollTop);
      setScrollTick(t => t + 1);
    };
    root.addEventListener('scroll', handle, {
      passive: true
    });
    // Fire once to initialize
    handle();
    return () => root.removeEventListener('scroll', handle);
  }, [onScrollPositionChange]);

  // Restore scrollTop when requested
  React.useEffect(() => {
    if (restoreScrollTop == null) return;
    const root = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement | null;
    if (root) {
      root.scrollTo({
        top: restoreScrollTop,
        behavior: 'auto'
      });
    }
  }, [restoreScrollTop]);

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
  const SkeletonRows = () => <div className="divide-y divide-zinc-100">
      {Array.from({
      length: 8
    }).map((_, index) => <div key={index} className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <Skeleton className="h-4 w-3/5 mb-2" />
          <Skeleton className="h-3 w-full mb-1" />
          <Skeleton className="h-3 w-5/6" />
          <div className="mt-4 flex items-center justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>)}
    </div>;
  return <div className="w-full bg-canvas-cloud h-full overflow-hidden flex flex-col">
      {/* Mobile Progress Indicator */}
      {isMobile && pagination && totalPages > 1}
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        {/* Skeletons when loading and no grants yet */}
        {isLoadingList && grantsToShow.length === 0 ? <SkeletonRows /> : <ConsolidatedGrantList grants={grantsToShow} selectedGrant={selectedGrant} onGrantSelect={onGrantSelect} onToggleBookmark={onToggleBookmark} searchTerm={searchTerm} isMobile={isMobile} aiMatches={aiMatches} currentPage={pagination?.page || currentPage} totalPages={pagination?.totalPages || Math.ceil(grants.length / grantsPerPage)} totalCount={pagination?.total || grants.length} onPageChange={onPageChange || setCurrentPage} scrollTick={scrollTick} />}
        {/* Manual Load More Button for Mobile */}
        {isMobile && hasMore && <div className="flex flex-col items-center justify-center py-6 px-4">
            <Button onClick={handleLoadMore} disabled={isLoadingMore} className="w-48 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoadingMore ? <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  <span>Laddar fler bidrag...</span>
                </div> : <span>Visa fler</span>}
            </Button>
            {!isLoadingMore && <div className="text-xs text-gray-400 mt-2 text-center">
                Klicka för att ladda fler bidrag
              </div>}
          </div>}
      </ScrollArea>
    </div>;
};
export default GrantList;