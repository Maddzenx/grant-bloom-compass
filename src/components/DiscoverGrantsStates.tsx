
import React from 'react';

interface DiscoverGrantsStatesProps {
  isLoading: boolean;
  isFetching?: boolean;
  isError: boolean;
  error: Error | null;
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
  // Show loading state
  if (isLoading) {
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
    console.error('Error state:', { isError, error });
    return (
      <div className="min-h-screen bg-[#f8f4ec] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-lg text-red-600 mb-2">Problem med att ladda bidrag</div>
          <div className="text-sm text-gray-600 mb-4">
            {error?.message || 'Ett oväntat fel inträffade vid hämtning av data'}
          </div>
          <div className="space-x-2">
            <button 
              onClick={onRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Försök igen
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Ladda om sidan
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show no data state - but not if we are in the middle of fetching new data
  if (!isLoading && !isFetching && (!grants || grants.length === 0)) {
    console.log('No data state - grants:', grants);
    return (
      <div className="min-h-screen bg-[#f1ebe1] flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-normal text-gray-700 mb-4">Inga bidrag hittades</h1>
          <p className="text-base text-gray-600 mb-8 max-w-md">
            Det finns för närvarande inga bidrag tillgängliga i databasen
          </p>
          <button 
            onClick={onRefresh}
            className="px-8 py-3 bg-[#4f46e5] text-white rounded-lg font-medium hover:bg-[#4338ca] transition-colors"
          >
            Uppdatera data
          </button>
        </div>
      </div>
    );
  }

  return null;
};
