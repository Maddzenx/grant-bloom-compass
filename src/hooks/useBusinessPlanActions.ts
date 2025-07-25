
import { useCallback } from "react";
import { Section, UploadedFile } from "@/types/businessPlan";
import { validateField } from "@/utils/businessPlanValidation";

interface UseBusinessPlanActionsProps {
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  setAutoSaved: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useBusinessPlanActions = ({
  setSections,
  setUploadedFiles,
  setAutoSaved
}: UseBusinessPlanActionsProps) => {
  const updateFieldValue = useCallback((sectionId: string, fieldId: string, value: string) => {
    console.log('Updating field:', sectionId, fieldId, value);
    setSections(prevSections => prevSections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          fields: section.fields.map(field => {
            if (field.id === fieldId) {
              const validation = validateField({ ...field, value });
              return {
                ...field,
                value,
                validation
              };
            }
            return field;
          })
        };
      }
      return section;
    }));
    setAutoSaved(false);
  }, [setSections, setAutoSaved]);
  
  const toggleSectionCompletion = useCallback((sectionId: string) => {
    setSections(prevSections => prevSections.map(section => 
      section.id === sectionId ? {
        ...section,
        isCompleted: !section.isCompleted
      } : section
    ));
    setAutoSaved(false);
  }, [setSections, setAutoSaved]);
  
  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
    setAutoSaved(false);
  }, [setUploadedFiles, setAutoSaved]);

  const addFiles = useCallback((newFiles: UploadedFile[]) => {
    setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
    setAutoSaved(false);
  }, [setUploadedFiles, setAutoSaved]);

  return {
    updateFieldValue,
    toggleSectionCompletion,
    removeFile,
    addFiles
  };
};
