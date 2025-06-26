
import React from "react";

interface StatusMessagesProps {
  isRecording: boolean;
  isTranscribing: boolean;
  isUploading: boolean;
  isMatching: boolean;
  grantsLoading: boolean;
  matchingError: string | null;
}

const StatusMessages = ({
  isRecording,
  isTranscribing,
  isUploading,
  isMatching,
  grantsLoading,
  matchingError
}: StatusMessagesProps) => {
  return (
    <>
      {isRecording && (
        <div className="mt-6 text-sm text-red-600 flex items-center justify-center gap-2 font-newsreader">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          Recording... Click the microphone to stop
        </div>
      )}
      
      {isTranscribing && (
        <div className="mt-6 text-sm text-blue-600 flex items-center justify-center gap-2 font-newsreader">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          Transcribing audio...
        </div>
      )}
      
      {isUploading && (
        <div className="mt-6 text-sm text-blue-600 flex items-center justify-center gap-2 font-newsreader">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          Processing file...
        </div>
      )}

      {isMatching && (
        <div className="mt-6 text-sm text-blue-600 flex items-center justify-center gap-2 font-newsreader">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          Matching grants with your project...
        </div>
      )}

      {grantsLoading && (
        <div className="mt-6 text-sm text-blue-600 flex items-center justify-center gap-2 font-newsreader">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          Loading available grants...
        </div>
      )}

      {matchingError && (
        <div className="mt-6 text-sm text-red-600 text-center font-newsreader">
          {matchingError}
        </div>
      )}
    </>
  );
};

export default StatusMessages;
