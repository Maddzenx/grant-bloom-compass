import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const grantsPerPage = 15;
  const observerRef = React.useRef<HTMLDivElement>(null);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  // For mobile: use backend pagination to determine if there are more grants
  const hasMoreBackend = pagination?.hasMore || false;
  const hasMoreLocal = numVisibleGrants < grants.length;
  const hasMore = isMobile ? hasMoreBackend : hasMoreLocal;
  
  const grantsToShow = isMobile ? grants.slice(0, numVisibleGrants) : grants.slice((currentPage - 1) * grantsPerPage, currentPage * grantsPerPage);

  React.useEffect(() => {
    if (!isMobile) return;

    const observerElement = observerRef.current;
    const scrollAreaElement = scrollAreaRef.current;
    if (!observerElement || !scrollAreaElement) return;

    const root = scrollAreaElement.querySelector('[data-radix-scroll-area-viewport]');
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setTimeout(() => {
            // For mobile: load next page from backend when we've shown all current grants
            if (hasMoreBackend && onPageChange && pagination) {
              console.log('📱 Mobile: Loading next page from backend...', {
                currentPage: pagination.page,
                totalPages: pagination.totalPages,
                hasMore: hasMoreBackend,
                grantsLength: grants.length,
                numVisibleGrants
              });
              onPageChange(pagination.page + 1);
            }
          }, 500);
        }
      },
      { root, threshold: 0.8 }
    );

    observer.observe(observerElement);

    return () => {
      observer.unobserve(observerElement);
    };
  }, [isMobile, hasMore, grants, grantsToShow]);

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
        {isMobile && hasMore && (
          <div ref={observerRef} className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default GrantList;
