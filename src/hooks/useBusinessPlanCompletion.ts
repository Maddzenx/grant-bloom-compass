
import { useEffect } from "react";
import { Section } from "@/types/businessPlan";
import { calculateSectionCompletion, calculateOverallCompletion } from "@/utils/businessPlanValidation";

interface UseBusinessPlanCompletionProps {
  sections: Section[];
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  setOverallCompletion: React.Dispatch<React.SetStateAction<number>>;
}

export const useBusinessPlanCompletion = ({
  sections,
  setSections,
  setOverallCompletion
}: UseBusinessPlanCompletionProps) => {
  // Calculate completion percentages
  useEffect(() => {
    let hasChanges = false;
    const updatedSections = sections.map(section => {
      const newCompletion = calculateSectionCompletion(section);
      if (section.completionPercentage !== newCompletion) {
        hasChanges = true;
        return {
          ...section,
          completionPercentage: newCompletion
        };
      }
      return section;
    });
    
    if (hasChanges) {
      setSections(updatedSections);
      setOverallCompletion(calculateOverallCompletion(updatedSections));
    }
  }, [sections.map(s => s.fields.map(f => f.value).join(',')).join('|')]);
};
