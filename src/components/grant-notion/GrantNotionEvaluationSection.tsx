
import React from "react";
import { Grant } from "@/types/grant";

interface GrantNotionEvaluationSectionProps {
  grant: Grant;
}

const GrantNotionEvaluationSection = ({ grant }: GrantNotionEvaluationSectionProps) => {
  if (!grant.evaluationCriteria) return null;

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 mb-4">Utvärderingskriterier</h3>
      <p className="text-sm text-gray-700 leading-relaxed">
        {grant.evaluationCriteria}
      </p>
    </div>
  );
};

export default GrantNotionEvaluationSection;
