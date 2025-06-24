
import { useEffect, useRef } from "react";
import { Section, UploadedFile, BusinessPlanData } from "@/types/businessPlan";
import { Grant } from "@/types/grant";
import { saveToLocalStorage } from "@/utils/businessPlanExport";

interface UseBusinessPlanPersistenceProps {
  sections: Section[];
  uploadedFiles: UploadedFile[];
  overallCompletion: number;
  autoSaved: boolean;
  setAutoSaved: React.Dispatch<React.SetStateAction<boolean>>;
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>;
  grant?: Grant;
}

export const useBusinessPlanPersistence = ({
  sections,
  uploadedFiles,
  overallCompletion,
  autoSaved,
  setAutoSaved,
  setLastSaved,
  grant
}: UseBusinessPlanPersistenceProps) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaved) {
      console.log('Starting auto-save timer...');
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        console.log('Auto-saving...');
        const businessPlanData: BusinessPlanData = {
          sections,
          uploadedFiles,
          overallCompletion,
          lastSaved: new Date()
        };
        
        const success = saveToLocalStorage(businessPlanData, grant?.id);
        if (success) {
          console.log('Auto-save successful');
          setAutoSaved(true);
          setLastSaved(new Date());
        } else {
          console.log('Auto-save failed');
        }
      }, 2000); // Auto-save after 2 seconds of inactivity
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [sections, uploadedFiles, overallCompletion, autoSaved, grant?.id, setAutoSaved, setLastSaved]);
};
