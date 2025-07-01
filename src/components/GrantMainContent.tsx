
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
  const spacingClass = isMobile ? 'space-y-8' : 'space-y-10';

  return (
    <div className={`${spacingClass} bg-canvas-cloud`}>
      {/* About section - always show */}
      <div className="bg-white p-6 rounded-lg border border-accent-lavender shadow-sm">
        <GrantAboutSection grant={grant} isMobile={isMobile} />
      </div>
      
      {/* Eligibility section - only show if data exists */}
      {(grant.whoCanApply || grant.qualifications) && (
        <div className="bg-accent-lavender-10 p-6 rounded-lg border border-accent-lavender">
          <GrantEligibilitySection grant={grant} isMobile={isMobile} />
        </div>
      )}
      
      {/* Evaluation section - only show if data exists */}
      {grant.evaluationCriteria && (
        <div className="bg-white p-6 rounded-lg border border-accent-lavender shadow-sm">
          <GrantEvaluationSection grant={grant} isMobile={isMobile} />
        </div>
      )}
      
      {/* Application section - only show if data exists */}
      {grant.applicationProcess && (
        <div className="bg-accent-lavender-10 p-6 rounded-lg border border-accent-lavender">
          <GrantApplicationSection grant={grant} isMobile={isMobile} />
        </div>
      )}
      
      {/* Templates section - only show if data exists */}
      {(grant.templates.length > 0 || grant.generalInfo.length > 0) && (
        <div className="bg-white p-6 rounded-lg border border-accent-lavender shadow-sm">
          <GrantTemplatesSection grant={grant} isMobile={isMobile} />
        </div>
      )}
      
      {/* Funding rules section - only show if data exists */}
      {grant.fundingRules.length > 0 && (
        <div className="bg-accent-lavender-10 p-6 rounded-lg border border-accent-lavender">
          <GrantFundingRulesSection grant={grant} isMobile={isMobile} />
        </div>
      )}
      
      {/* Additional info section - only show if data exists */}
      {grant.qualifications && (
        <div className="bg-white p-6 rounded-lg border border-accent-lavender shadow-sm">
          <GrantAdditionalInfoSection grant={grant} isMobile={isMobile} />
        </div>
      )}
    </div>
  );
};

export default GrantMainContent;
