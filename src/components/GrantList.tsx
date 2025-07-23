import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ConsolidatedGrantList from "@/components/ConsolidatedGrantList";
import { Grant } from "@/types/grant";
import { AIGrantMatch } from "@/hooks/useAIGrantSearch";

interface GrantListProps {
  grants: Grant[];
  selectedGrant: Grant | null;
  onGrantSelect: (grant: Grant) => void;
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

  const hasMore = numVisibleGrants < grants.length;
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
            setNumVisibleGrants((prev) => Math.min(prev + grantsPerPage, grants.length));
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
    setNumVisibleGrants(15);
    setCurrentPage(1);
  }, [grants]);

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
