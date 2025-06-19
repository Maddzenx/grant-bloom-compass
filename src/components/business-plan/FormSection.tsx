
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Section } from "@/types/businessPlan";

interface FormSectionProps {
  section: Section;
  onUpdateField: (sectionId: string, fieldId: string, value: string) => void;
}

export const FormSection: React.FC<FormSectionProps> = ({ section, onUpdateField }) => {
  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium text-gray-900">
          {section.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {section.fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              {field.label}
            </label>
            {field.type === "input" ? (
              <Input
                value={field.value}
                onChange={(e) => onUpdateField(section.id, field.id, e.target.value)}
                className="bg-gray-50 border-gray-200"
                placeholder={field.placeholder}
              />
            ) : (
              <Textarea
                value={field.value}
                onChange={(e) => onUpdateField(section.id, field.id, e.target.value)}
                className="bg-gray-50 border-gray-200 min-h-[100px]"
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
