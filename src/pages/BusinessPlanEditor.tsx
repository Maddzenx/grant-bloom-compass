
import React from "react";
import { useLocation } from "react-router-dom";
import { Grant } from "@/types/grant";
import { BusinessPlanHeader } from "@/components/business-plan/BusinessPlanHeader";
import { BusinessPlanContent } from "@/components/business-plan/BusinessPlanContent";
import { useBusinessPlanEditor } from "@/hooks/useBusinessPlanEditor";

const BusinessPlanEditor = () => {
  const location = useLocation();
  const grant = location.state?.grant as Grant | undefined;
  
  const {
    sections,
    uploadedFiles,
    autoSaved,
    updateFieldValue,
    toggleSectionCompletion,
    removeFile
  } = useBusinessPlanEditor(grant);

  return (
    <div className="flex-1 bg-gray-50 min-h-screen relative">
      <div className="max-w-7xl mx-auto p-6 bg-[f8f4ec] bg-[#f8f4ec]">
        <BusinessPlanHeader grant={grant} autoSaved={autoSaved} />
        <BusinessPlanContent
          sections={sections}
          uploadedFiles={uploadedFiles}
          onUpdateField={updateFieldValue}
          onToggleSectionCompletion={toggleSectionCompletion}
          onRemoveFile={removeFile}
        />
      </div>
    </div>
  );
};

export default BusinessPlanEditor;
