
import { FormField, Section } from "@/types/businessPlan";

export const validateField = (field: FormField): { isValid: boolean; errorMessage?: string } => {
  if (field.required && (!field.value || field.value.trim() === '')) {
    return {
      isValid: false,
      errorMessage: 'Detta fält är obligatoriskt'
    };
  }

  // Email validation for email fields
  if (field.id.includes('email') && field.value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(field.value)) {
      return {
        isValid: false,
        errorMessage: 'Ange en giltig e-postadress'
      };
    }
  }

  // Organization number validation
  if (field.id === 'org_number' && field.value) {
    const orgNumberRegex = /^\d{6}-\d{4}$/;
    if (!orgNumberRegex.test(field.value)) {
      return {
        isValid: false,
        errorMessage: 'Ange organisationsnummer i format XXXXXX-XXXX'
      };
    }
  }

  // Minimum length validation for textarea fields
  if (field.type === 'textarea' && field.required && field.value && field.value.trim().length < 50) {
    return {
      isValid: false,
      errorMessage: 'Beskrivningen måste vara minst 50 tecken'
    };
  }

  return { isValid: true };
};

export const calculateSectionCompletion = (section: Section): number => {
  const totalFields = section.fields.length;
  const completedFields = section.fields.filter(field => {
    if (field.required) {
      return field.value && field.value.trim() !== '' && validateField(field).isValid;
    }
    return true; // Non-required fields are always considered "complete"
  }).length;

  return Math.round((completedFields / totalFields) * 100);
};

export const calculateOverallCompletion = (sections: Section[]): number => {
  if (sections.length === 0) return 0;
  
  const totalCompletion = sections.reduce((sum, section) => sum + section.completionPercentage, 0);
  return Math.round(totalCompletion / sections.length);
};
