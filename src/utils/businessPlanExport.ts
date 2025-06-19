
import { BusinessPlanData } from "@/types/businessPlan";
import { Grant } from "@/types/grant";

export interface ExportOptions {
  format: 'pdf' | 'docx' | 'json';
  includeEmptyFields: boolean;
}

export const exportBusinessPlan = async (
  data: BusinessPlanData, 
  grant?: Grant, 
  options: ExportOptions = { format: 'json', includeEmptyFields: false }
) => {
  const exportData = {
    title: grant ? `Affärsplan för ${grant.title}` : 'Affärsplan',
    grant: grant ? {
      title: grant.title,
      organization: grant.organization,
      fundingAmount: grant.fundingAmount,
      deadline: grant.deadline
    } : null,
    exportedAt: new Date().toISOString(),
    overallCompletion: data.overallCompletion,
    sections: data.sections.map(section => ({
      title: section.title,
      completionPercentage: section.completionPercentage,
      fields: section.fields
        .filter(field => options.includeEmptyFields || field.value.trim() !== '')
        .map(field => ({
          label: field.label,
          value: field.value,
          type: field.type
        }))
    })),
    uploadedFiles: data.uploadedFiles.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size
    }))
  };

  if (options.format === 'json') {
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    downloadFile(blob, `affarpslan-${Date.now()}.json`);
  } else {
    // For PDF/DOCX export, we'll create a formatted text version for now
    const textContent = formatAsText(exportData);
    const blob = new Blob([textContent], { type: 'text/plain' });
    downloadFile(blob, `affarpslan-${Date.now()}.txt`);
  }
};

const formatAsText = (data: any): string => {
  let content = `${data.title}\n`;
  content += `Exporterad: ${new Date(data.exportedAt).toLocaleString('sv-SE')}\n`;
  content += `Slutförandegrad: ${data.overallCompletion}%\n\n`;

  if (data.grant) {
    content += `BIDRAGSINFORMATION\n`;
    content += `Titel: ${data.grant.title}\n`;
    content += `Organisation: ${data.grant.organization}\n`;
    content += `Bidragsbelopp: ${data.grant.fundingAmount}\n`;
    content += `Deadline: ${data.grant.deadline}\n\n`;
  }

  data.sections.forEach((section: any) => {
    content += `${section.title.toUpperCase()} (${section.completionPercentage}%)\n`;
    content += '='.repeat(section.title.length + 10) + '\n';
    
    section.fields.forEach((field: any) => {
      content += `${field.label}:\n${field.value}\n\n`;
    });
    
    content += '\n';
  });

  return content;
};

const downloadFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const saveToLocalStorage = (data: BusinessPlanData, grantId?: string) => {
  const key = grantId ? `businessPlan_${grantId}` : 'businessPlan_default';
  const saveData = {
    ...data,
    lastSaved: new Date().toISOString()
  };
  
  try {
    localStorage.setItem(key, JSON.stringify(saveData));
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
};

export const loadFromLocalStorage = (grantId?: string): BusinessPlanData | null => {
  const key = grantId ? `businessPlan_${grantId}` : 'businessPlan_default';
  
  try {
    const savedData = localStorage.getItem(key);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      return {
        ...parsed,
        lastSaved: parsed.lastSaved ? new Date(parsed.lastSaved) : null
      };
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }
  
  return null;
};
