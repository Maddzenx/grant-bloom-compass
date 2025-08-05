import React from 'react';
interface DiscoverGrantsStatesProps {
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: any;
  grants: any[];
  onRefresh: () => void;
}
export const DiscoverGrantsStates = ({
  isLoading,
  isFetching,
  isError,
  error,
  grants,
  onRefresh
}: DiscoverGrantsStatesProps) => {
  // Debug log to see what's being passed
  console.log('🔍 DiscoverGrantsStates called with:', {
    isLoading,
    isFetching,
    isError,
    error: !!error,
    grantsLength: grants?.length,
    grants
  });

  // Show loading state
  if (isLoading) {
    console.log('🔍 DiscoverGrantsStates: Returning loading state');
    return (
      <div className="min-h-screen bg-[#f8f4ec] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600 mb-2">Laddar bidrag...</div>
          <div className="text-sm text-gray-500">Hämtar data från databasen...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (isError || error) {
    console.log('🔍 DiscoverGrantsStates: Returning error state');
    console.error('Error state:', {
      isError,
      error
    });
    return <div className="min-h-screen flex items-center justify-center p-4 bg-transparent">
        <div className="text-center max-w-md">
          <div className="text-lg text-red-600 mb-2">Problem med att ladda bidrag</div>
          <div className="text-sm text-gray-600 mb-4">
            {error?.message || 'Ett oväntat fel inträffade vid hämtning av data'}
          </div>
          <div className="space-x-2">
            <button onClick={onRefresh} className="px-4 py-2 text-white rounded transition-all duration-200" style={{ backgroundColor: '#8B5CF6' }}>
              Försök igen
            </button>
            <button onClick={() => window.location.reload()} className="px-4 py-2 text-white rounded transition-all duration-200" style={{ backgroundColor: '#6B7280' }}>
              Ladda om sidan
            </button>
          </div>
        </div>
      </div>;
  }

  // Don't show full-page empty state - let the normal page layout handle it
  // The ConsolidatedGrantList component will show the appropriate empty state
  // when grants.length === 0, allowing users to modify their filters
  console.log('🔍 DiscoverGrantsStates: Returning null (no full-page state needed)');
  return null;
};