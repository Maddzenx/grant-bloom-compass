
import React from "react";
import { useLocation } from "react-router-dom";
import { BusinessPlanHeader } from "@/components/business-plan/BusinessPlanHeader";
import { BusinessPlanContent } from "@/components/business-plan/BusinessPlanContent";
import { useBusinessPlanEditor } from "@/hooks/useBusinessPlanEditor";
import { Grant } from "@/types/grant";

const BusinessPlanEditor = () => {
  const location = useLocation();
  const grant = location.state?.grant as Grant | undefined;
  
  const {
    sections,
    uploadedFiles,
    autoSaved,
    overallCompletion,
    updateFieldValue,
    toggleSectionCompletion,
    removeFile,
    addFiles
  } = useBusinessPlanEditor(grant);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <BusinessPlanHeader grant={grant} autoSaved={autoSaved} />
        <BusinessPlanContent
          grant={grant}
          sections={sections}
          uploadedFiles={uploadedFiles}
          overallCompletion={overallCompletion}
          onUpdateField={updateFieldValue}
          onToggleSectionCompletion={toggleSectionCompletion}
          onRemoveFile={removeFile}
          onFilesUploaded={addFiles}
        />
      </div>
    </div>
  );
};

export default BusinessPlanEditor;
