
import React from "react";
import { Check, Save, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Grant } from "@/types/grant";
import { useSidebar } from "@/components/ui/sidebar";

interface BusinessPlanHeaderProps {
  grant?: Grant;
  autoSaved: boolean;
}

export const BusinessPlanHeader: React.FC<BusinessPlanHeaderProps> = ({ grant, autoSaved }) => {
  const { state, toggleSidebar } = useSidebar();

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        {/* Expand button - only show when sidebar is collapsed */}
        {state === "collapsed" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="flex items-center justify-center w-8 h-8 rounded-md bg-white border border-gray-200 shadow-md hover:bg-gray-100 transition-colors"
            title="Visa sidopanel"
          >
            <PanelLeft className="w-4 h-4" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {grant ? `Ansökan för ${grant.title}` : "Business plan editor"}
          </h1>
          {grant && (
            <p className="text-sm text-gray-600 mt-1">
              {grant.organization} • Deadline: {grant.deadline}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {autoSaved ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              Auto-saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-gray-400" />
              Saving...
            </>
          )}
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 px-6">
          Review
        </Button>
      </div>
    </div>
  );
};
