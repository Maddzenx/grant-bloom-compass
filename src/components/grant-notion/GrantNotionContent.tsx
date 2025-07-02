
import React from "react";
import { Grant } from "@/types/grant";
import GrantNotionEvaluationSection from "./GrantNotionEvaluationSection";
import GrantNotionApplicationSection from "./GrantNotionApplicationSection";
import GrantNotionTemplatesSection from "./GrantNotionTemplatesSection";
import GrantNotionFundingRulesSection from "./GrantNotionFundingRulesSection";
import GrantNotionAdditionalInfoSection from "./GrantNotionAdditionalInfoSection";
import GrantNotionContactSection from "./GrantNotionContactSection";

interface GrantNotionContentProps {
  grant: Grant;
  isMobile?: boolean;
}

const GrantNotionContent = ({
  grant,
  isMobile = false
}: GrantNotionContentProps) => {
  return (
    <div className="space-y-8">
      <GrantNotionEvaluationSection grant={grant} />
      <GrantNotionApplicationSection grant={grant} />
      <GrantNotionTemplatesSection grant={grant} />
      <GrantNotionFundingRulesSection grant={grant} />
      <GrantNotionAdditionalInfoSection grant={grant} />
      <GrantNotionContactSection grant={grant} />
    </div>
  );
};

export default GrantNotionContent;
