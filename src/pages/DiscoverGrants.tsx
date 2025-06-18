
import React, { useState } from "react";
import SearchBar from "@/components/SearchBar";
import GrantCard from "@/components/GrantCard";
import GrantDetails from "@/components/GrantDetails";
import EmptyGrantDetails from "@/components/EmptyGrantDetails";
import { Grant } from "@/types/grant";
import { useGrants } from "@/hooks/useGrants";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const GRANTS_PER_PAGE = 15;

const DiscoverGrants = () => {
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookmarkedGrants, setBookmarkedGrants] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  const { data: grants = [], isLoading, error } = useGrants();

  const toggleBookmark = (grantId: string) => {
    const newBookmarks = new Set(bookmarkedGrants);
    if (newBookmarks.has(grantId)) {
      newBookmarks.delete(grantId);
    } else {
      newBookmarks.add(grantId);
    }
    setBookmarkedGrants(newBookmarks);
  };

  const filteredGrants = grants.filter(grant =>
    grant.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grant.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grant.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredGrants.length / GRANTS_PER_PAGE);
  const startIndex = (currentPage - 1) * GRANTS_PER_PAGE;
  const endIndex = startIndex + GRANTS_PER_PAGE;
  const currentGrants = filteredGrants.slice(startIndex, endIndex);

  // Set the first grant as selected by default
  React.useEffect(() => {
    if (currentGrants.length > 0 && !selectedGrant) {
      setSelectedGrant(currentGrants[0]);
    }
  }, [currentGrants, selectedGrant]);

  // Reset selected grant when page changes
  React.useEffect(() => {
    if (currentGrants.length > 0) {
      setSelectedGrant(currentGrants[0]);
    }
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if needed
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis if needed
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
              className="cursor-pointer"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Laddar bidrag...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">Fel vid hämtning av bidrag: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-gray-900 mb-6">Upptäck bidrag</h1>
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
        {/* Left Panel - Grants List (Scrollable) */}
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {currentGrants.map((grant) => (
              <GrantCard
                key={grant.id}
                grant={grant}
                isSelected={selectedGrant?.id === grant.id}
                isBookmarked={bookmarkedGrants.has(grant.id)}
                onSelect={() => setSelectedGrant(grant)}
                onToggleBookmark={() => toggleBookmark(grant.id)}
              />
            ))}
          </div>

          {/* Pagination - Fixed at bottom of left panel */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        className={`cursor-pointer ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
                      />
                    </PaginationItem>
                    
                    {renderPaginationItems()}
                    
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        className={`cursor-pointer ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}

            {/* Results info */}
            {filteredGrants.length > 0 && (
              <div className="text-sm text-gray-500 text-center mt-2">
                Visar {startIndex + 1}-{Math.min(endIndex, filteredGrants.length)} av {filteredGrants.length} bidrag
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Grant Details (Sticky) */}
        <div className="sticky top-6 h-[calc(100vh-200px)] overflow-y-auto">
          {selectedGrant ? (
            <GrantDetails
              grant={selectedGrant}
              isBookmarked={bookmarkedGrants.has(selectedGrant.id)}
              onToggleBookmark={() => toggleBookmark(selectedGrant.id)}
            />
          ) : (
            <EmptyGrantDetails />
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscoverGrants;
