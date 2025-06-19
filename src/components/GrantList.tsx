
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import GrantCard from "@/components/GrantCard";
import { Grant } from "@/types/grant";

interface GrantListProps {
  grants: Grant[];
  selectedGrant: Grant | null;
  bookmarkedGrants: Set<string>;
  onGrantSelect: (grant: Grant) => void;
  onToggleBookmark: (grantId: string) => void;
  searchTerm: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isMobile: boolean;
}

const GrantList = ({
  grants,
  selectedGrant,
  bookmarkedGrants,
  onGrantSelect,
  onToggleBookmark,
  searchTerm,
  currentPage,
  totalPages,
  onPageChange,
  isMobile
}: GrantListProps) => {
  const containerClass = isMobile 
    ? "w-full bg-[#f8f4ec] overflow-hidden flex flex-col" 
    : "w-2/5 border-r border-gray-200 bg-[#f8f4ec] overflow-hidden flex flex-col";

  return (
    <div className={containerClass}>
      <ScrollArea className="flex-1">
        <div className="p-2 md:p-4 border border-transparent py-0 px-[5px]">
          <div className="space-y-2 md:space-y-3">
            {grants.length === 0 ? (
              <div className="text-center text-gray-500 mt-8 px-4">
                {searchTerm ? "Inga bidrag hittades för din sökning." : "Inga bidrag tillgängliga."}
              </div>
            ) : (
              grants.map(grant => (
                <GrantCard
                  key={grant.id}
                  grant={grant}
                  isSelected={selectedGrant?.id === grant.id}
                  isBookmarked={bookmarkedGrants.has(grant.id)}
                  onSelect={() => onGrantSelect(grant)}
                  onToggleBookmark={() => onToggleBookmark(grant.id)}
                  isMobile={isMobile}
                />
              ))
            )}
          </div>
        </div>
      </ScrollArea>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200 bg-[#f8f4ec] p-2 md:p-4">
          <Pagination>
            <PaginationContent className="flex-wrap gap-1">
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) onPageChange(currentPage - 1);
                  }} 
                  className={`text-xs md:text-sm ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PaginationItem key={page}>
                  <PaginationLink 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(page);
                    }} 
                    isActive={currentPage === page}
                    className="text-xs md:text-sm min-w-[32px] h-8"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) onPageChange(currentPage + 1);
                  }} 
                  className={`text-xs md:text-sm ${currentPage === totalPages ? "pointer-events-none opacity-50" : ""}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default GrantList;
