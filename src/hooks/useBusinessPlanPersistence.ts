
import { useEffect } from "react";
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
  // Auto-save functionality
  useEffect(() => {
    if (!autoSaved) {
      const timer = setTimeout(() => {
        const businessPlanData: BusinessPlanData = {
          sections,
          uploadedFiles,
          overallCompletion,
          lastSaved: new Date()
        };
        
        const success = saveToLocalStorage(businessPlanData, grant?.id);
        if (success) {
          setAutoSaved(true);
          setLastSaved(new Date());
        }
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timer);
    }
  }, [sections, uploadedFiles, overallCompletion, autoSaved, grant?.id, setAutoSaved, setLastSaved]);
};
