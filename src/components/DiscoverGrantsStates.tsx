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
      <div className="min-h-screen bg-white flex items-center justify-center" role="status" aria-live="polite">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7D54F4] mx-auto mb-4"></div>
          <div className="text-base text-zinc-600 mb-2">Laddar bidrag...</div>
          <div className="text-xs text-zinc-500">Hämtar data från databasen...</div>
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
            <button onClick={onRefresh} className="px-4 py-2 text-white rounded transition-all duration-200 hover:opacity-90" style={{ backgroundColor: '#7D54F4' }}>
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