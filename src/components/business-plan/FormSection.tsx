
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Section } from "@/types/businessPlan";

interface FormSectionProps {
  section: Section;
  onUpdateField: (sectionId: string, fieldId: string, value: string) => void;
}

export const FormSection: React.FC<FormSectionProps> = ({ section, onUpdateField }) => {
  const requiredFieldsCount = section.fields.filter(field => field.required).length;
  const completedRequiredFields = section.fields.filter(field => 
    field.required && field.value && field.value.trim() !== '' && field.validation?.isValid
  ).length;

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-gray-900">
            {section.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge 
              variant={section.completionPercentage === 100 ? "default" : "secondary"}
              className="text-xs"
            >
              {section.completionPercentage}% klart
            </Badge>
            {requiredFieldsCount > 0 && (
              <Badge variant="outline" className="text-xs">
                {completedRequiredFields}/{requiredFieldsCount} obligatoriska
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {section.fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block flex items-center gap-1">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
              {field.validation?.isValid === false && (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
              {field.required && field.value && field.validation?.isValid && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
            </label>
            {field.type === "input" ? (
              <Input
                value={field.value}
                onChange={(e) => onUpdateField(section.id, field.id, e.target.value)}
                className={`bg-gray-50 border-gray-200 ${
                  field.validation?.isValid === false ? 'border-red-500 focus:border-red-500' : ''
                }`}
                placeholder={field.placeholder}
              />
            ) : (
              <Textarea
                value={field.value}
                onChange={(e) => onUpdateField(section.id, field.id, e.target.value)}
                className={`bg-gray-50 border-gray-200 min-h-[100px] ${
                  field.validation?.isValid === false ? 'border-red-500 focus:border-red-500' : ''
                }`}
                placeholder={field.placeholder}
              />
            )}
            {field.validation?.isValid === false && field.validation.errorMessage && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {field.validation.errorMessage}
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
