import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
interface StatusMessagesProps {
  isRecording: boolean;
  isTranscribing: boolean;
  isUploading: boolean;
  isMatching: boolean;
  grantsLoading: boolean;
  isSearching?: boolean;
  matchingError: string | null;
}
const StatusMessages = ({
  isRecording,
  isTranscribing,
  isUploading,
  isMatching,
  grantsLoading,
  isSearching,
  matchingError
}: StatusMessagesProps) => {
  const {
    t
  } = useLanguage();
  if (matchingError) {
    return <div className="text-center text-red-600 mt-4">
        <p>{t('status.error')}: {matchingError}</p>
      </div>;
  }
  if (isSearching) {
    return <div className="text-center text-blue-600 mt-4">
        <p>Söker bidrag...</p>
      </div>;
  }
  if (isRecording) {
    return <div className="text-center text-blue-600 mt-4">
        
      </div>;
  }
  if (isTranscribing) {
    return <div className="text-center text-blue-600 mt-4">
        <p>{t('status.transcribing')}</p>
      </div>;
  }
  if (isUploading) {
    return <div className="text-center text-blue-600 mt-4">
        <p>{t('status.uploading')}</p>
      </div>;
  }
  if (isMatching) {
    return <div className="text-center text-blue-600 mt-4">
        <p>{t('status.matching')}</p>
      </div>;
  }
  if (grantsLoading) {
    return <div className="text-center text-blue-600 mt-4">
        <p>{t('status.loading')}</p>
      </div>;
  }
  return null;
};
export default StatusMessages;