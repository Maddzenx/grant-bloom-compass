
import { useCallback } from "react";
import { BusinessPlanData } from "@/types/businessPlan";
import { Grant } from "@/types/grant";
import { useBusinessPlanState } from "./useBusinessPlanState";
import { useBusinessPlanActions } from "./useBusinessPlanActions";
import { useBusinessPlanPersistence } from "./useBusinessPlanPersistence";
import { useBusinessPlanCompletion } from "./useBusinessPlanCompletion";

export const useBusinessPlanEditor = (grant?: Grant) => {
  const {
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
  } = useBusinessPlanState(grant);

  const {
    updateFieldValue,
    toggleSectionCompletion,
    removeFile,
    addFiles
  } = useBusinessPlanActions({
    setSections,
    setUploadedFiles,
    setAutoSaved
  });

  useBusinessPlanCompletion({
    sections,
    setSections,
    setOverallCompletion
  });

  useBusinessPlanPersistence({
    sections,
    uploadedFiles,
    overallCompletion,
    autoSaved,
    setAutoSaved,
    setLastSaved,
    grant
  });

  const exportBusinessPlan = useCallback(() => {
    const businessPlanData: BusinessPlanData = {
      sections,
      uploadedFiles,
      overallCompletion,
      lastSaved
    };
    
    return businessPlanData;
  }, [sections, uploadedFiles, overallCompletion, lastSaved]);

  return {
    sections,
    uploadedFiles,
    autoSaved,
    overallCompletion,
    lastSaved,
    updateFieldValue,
    toggleSectionCompletion,
    removeFile,
    addFiles,
    exportBusinessPlan
  };
};
