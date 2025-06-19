
import { FormField } from "@/types/businessPlan";

export const createInputField = (
  id: string,
  label: string,
  placeholder: string,
  required: boolean = true
): FormField => ({
  id,
  label,
  value: "",
  type: "input" as const,
  placeholder,
  required,
  validation: { isValid: true }
});

export const createTextareaField = (
  id: string,
  label: string,
  placeholder: string,
  required: boolean = true
): FormField => ({
  id,
  label,
  value: "",
  type: "textarea" as const,
  placeholder,
  required,
  validation: { isValid: true }
});
