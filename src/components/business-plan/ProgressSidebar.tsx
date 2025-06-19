
import React from "react";
import { Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Section } from "@/types/businessPlan";

interface ProgressSidebarProps {
  sections: Section[];
  onToggleSectionCompletion: (sectionId: string) => void;
}

export const ProgressSidebar: React.FC<ProgressSidebarProps> = ({ 
  sections, 
  onToggleSectionCompletion 
}) => {
  const completedSections = sections.filter(section => section.isCompleted).length;
  const progressPercentage = Math.round((completedSections / sections.length) * 100);

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium text-gray-900">Progress Checklist</CardTitle>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{completedSections} of {sections.length} completed</span>
          <span>{progressPercentage}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-3">
        {sections.map((section) => (
          <div key={section.id} className="flex items-center gap-3">
            <button
              onClick={() => onToggleSectionCompletion(section.id)}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                section.isCompleted
                  ? "bg-green-500 border-green-500 text-white"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {section.isCompleted && (
                <Check className="w-3 h-3" />
              )}
            </button>
            <span className={`text-sm ${section.isCompleted ? "text-gray-900" : "text-gray-600"}`}>
              {section.title}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
