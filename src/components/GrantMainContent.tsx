
import React from "react";
import { Grant } from "@/types/grant";
import GrantAboutSection from "./grant-sections/GrantAboutSection";
import GrantEligibilitySection from "./grant-sections/GrantEligibilitySection";
import GrantEvaluationSection from "./grant-sections/GrantEvaluationSection";
import GrantApplicationSection from "./grant-sections/GrantApplicationSection";
import GrantTemplatesSection from "./grant-sections/GrantTemplatesSection";
import GrantFundingRulesSection from "./grant-sections/GrantFundingRulesSection";
import GrantAdditionalInfoSection from "./grant-sections/GrantAdditionalInfoSection";

interface GrantMainContentProps {
  grant: Grant;
  isMobile?: boolean;
}

const GrantMainContent = ({
  grant,
  isMobile = false
}: GrantMainContentProps) => {
  const spacingClass = isMobile ? 'space-y-6' : 'space-y-8';

  return (
    <div className={spacingClass}>
      <GrantAboutSection grant={grant} isMobile={isMobile} />
      <GrantEligibilitySection grant={grant} isMobile={isMobile} />
      <GrantEvaluationSection grant={grant} isMobile={isMobile} />
      <GrantApplicationSection grant={grant} isMobile={isMobile} />
      <GrantTemplatesSection grant={grant} isMobile={isMobile} />
      <GrantFundingRulesSection grant={grant} isMobile={isMobile} />
      <GrantAdditionalInfoSection grant={grant} isMobile={isMobile} />
    </div>
  );
};

export default GrantMainContent;
