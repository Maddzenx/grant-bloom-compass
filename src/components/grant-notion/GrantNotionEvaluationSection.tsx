
import React from "react";
import { GrantDetails as GrantDetailsType } from "@/types/grant";

interface GrantNotionEvaluationSectionProps {
  grant: GrantDetailsType;
}

const GrantNotionEvaluationSection = ({ grant }: GrantNotionEvaluationSectionProps) => {
  if (!grant.evaluationCriteria) return null;

  return (
    <div>
      <h3 className="type-title text-zinc-900 mb-4">Utvärderingskriterier</h3>
      <p className="type-secondary text-zinc-700 leading-relaxed">
        {grant.evaluationCriteria}
      </p>
    </div>
  );
};

export default GrantNotionEvaluationSection;
