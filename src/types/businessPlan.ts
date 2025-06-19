
export interface FormField {
  id: string;
  label: string;
  value: string;
  type: "input" | "textarea";
  placeholder?: string;
  required?: boolean;
  validation?: {
    isValid: boolean;
    errorMessage?: string;
  };
}

export interface Section {
  id: string;
  title: string;
  fields: FormField[];
  isExpanded: boolean;
  isCompleted: boolean;
  completionPercentage: number;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: string;
}

export interface BusinessPlanData {
  sections: Section[];
  uploadedFiles: UploadedFile[];
  overallCompletion: number;
  lastSaved: Date | null;
}
