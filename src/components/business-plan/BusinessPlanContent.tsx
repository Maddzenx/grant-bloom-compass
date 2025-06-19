
import React from "react";
import { FormSection } from "@/components/business-plan/FormSection";
import { ProgressSidebar } from "@/components/business-plan/ProgressSidebar";
import { FileUpload } from "@/components/business-plan/FileUpload";
import { Section, UploadedFile } from "@/types/businessPlan";

interface BusinessPlanContentProps {
  sections: Section[];
  uploadedFiles: UploadedFile[];
  overallCompletion: number;
  onUpdateField: (sectionId: string, fieldId: string, value: string) => void;
  onToggleSectionCompletion: (sectionId: string) => void;
  onRemoveFile: (fileId: string) => void;
}

export const BusinessPlanContent: React.FC<BusinessPlanContentProps> = ({
  sections,
  uploadedFiles,
  overallCompletion,
  onUpdateField,
  onToggleSectionCompletion,
  onRemoveFile
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">
        {sections.map(section => (
          <FormSection 
            key={section.id} 
            section={section} 
            onUpdateField={onUpdateField} 
          />
        ))}
      </div>

      {/* Right Sidebar */}
      <div className="space-y-6">
        <ProgressSidebar 
          sections={sections} 
          overallCompletion={overallCompletion}
          onToggleSectionCompletion={onToggleSectionCompletion} 
        />
        <FileUpload 
          uploadedFiles={uploadedFiles} 
          onRemoveFile={onRemoveFile} 
        />
      </div>
    </div>
  );
};
