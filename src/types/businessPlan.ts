
export interface FormField {
  id: string;
  label: string;
  value: string;
  type: "input" | "textarea";
  placeholder?: string;
}

export interface Section {
  id: string;
  title: string;
  fields: FormField[];
  isExpanded: boolean;
  isCompleted: boolean;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: string;
}
