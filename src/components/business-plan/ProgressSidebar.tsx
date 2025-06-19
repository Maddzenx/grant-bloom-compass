
import React from "react";
import { Check, AlertCircle, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/types/businessPlan";

interface ProgressSidebarProps {
  sections: Section[];
  overallCompletion: number;
  onToggleSectionCompletion: (sectionId: string) => void;
}

export const ProgressSidebar: React.FC<ProgressSidebarProps> = ({ 
  sections, 
  overallCompletion,
  onToggleSectionCompletion 
}) => {
  const completedSections = sections.filter(section => section.completionPercentage === 100).length;
  const inProgressSections = sections.filter(section => 
    section.completionPercentage > 0 && section.completionPercentage < 100
  ).length;
  const notStartedSections = sections.filter(section => section.completionPercentage === 0).length;

  const getSectionIcon = (section: Section) => {
    if (section.completionPercentage === 100) {
      return <Check className="w-4 h-4 text-green-600" />;
    } else if (section.completionPercentage > 0) {
      return <Clock className="w-4 h-4 text-yellow-600" />;
    } else {
      return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSectionStatus = (section: Section) => {
    if (section.completionPercentage === 100) return "Klar";
    if (section.completionPercentage > 0) return "Pågår";
    return "Ej påbörjad";
  };

  const getStatusColor = (section: Section) => {
    if (section.completionPercentage === 100) return "text-green-600";
    if (section.completionPercentage > 0) return "text-yellow-600";
    return "text-gray-500";
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium text-gray-900">Framsteg</CardTitle>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Totalt framsteg</span>
            <span className="font-medium">{overallCompletion}%</span>
          </div>
          <Progress value={overallCompletion} className="h-3" />
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {completedSections} klara
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              {inProgressSections} pågår
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              {notStartedSections} kvar
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
            <button
              onClick={() => onToggleSectionCompletion(section.id)}
              className="flex-shrink-0"
            >
              {getSectionIcon(section)}
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${getStatusColor(section)}`}>
                  {section.title}
                </span>
                <Badge variant="outline" className="text-xs ml-2">
                  {section.completionPercentage}%
                </Badge>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className={`text-xs ${getStatusColor(section)}`}>
                  {getSectionStatus(section)}
                </span>
                {section.completionPercentage > 0 && section.completionPercentage < 100 && (
                  <Progress value={section.completionPercentage} className="h-1 w-16" />
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
