
import { useState } from "react";
import { Section, UploadedFile } from "@/types/businessPlan";
import { Grant } from "@/types/grant";
import { loadFromLocalStorage } from "@/utils/businessPlanExport";
import { createSectionsForGrant } from "@/utils/businessPlanSections";

export const useBusinessPlanState = (grant?: Grant) => {
  const [sections, setSections] = useState<Section[]>(() => {
    // Try to load saved data first
    const savedData = loadFromLocalStorage(grant?.id);
    return savedData ? savedData.sections : createSectionsForGrant(grant);
  });
  
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(() => {
    const savedData = loadFromLocalStorage(grant?.id);
    return savedData ? savedData.uploadedFiles : [];
  });
  
  const [autoSaved, setAutoSaved] = useState(true);
  const [overallCompletion, setOverallCompletion] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(() => {
    const savedData = loadFromLocalStorage(grant?.id);
    return savedData ? savedData.lastSaved : null;
  });

  return {
    sections,
    setSections,
    uploadedFiles,
    setUploadedFiles,
    autoSaved,
    setAutoSaved,
    overallCompletion,
    setOverallCompletion,
    lastSaved,
    setLastSaved
  };
};
