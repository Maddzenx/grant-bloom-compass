
import React from "react";
import { GrantDetails as GrantDetailsType } from "@/types/grant";
import GrantNotionDescriptionSection from "./GrantNotionDescriptionSection";
import GrantNotionQualificationsSection from "./GrantNotionQualificationsSection";
import GrantNotionEvaluationSection from "./GrantNotionEvaluationSection";
import GrantNotionApplicationSection from "./GrantNotionApplicationSection";
import GrantNotionImportantDatesSection from "./GrantNotionImportantDatesSection";
import GrantNotionTemplatesSection from "./GrantNotionTemplatesSection";
import GrantNotionContactSection from "./GrantNotionContactSection";

interface GrantNotionContentProps {
  grant: GrantDetailsType;
  isMobile?: boolean;
}

const GrantNotionContent = ({
  grant,
  isMobile = false
}: GrantNotionContentProps) => {
  return (
    <div className="space-y-8">
      <GrantNotionDescriptionSection grant={grant} />
      <GrantNotionQualificationsSection grant={grant} />
      <GrantNotionEvaluationSection grant={grant} />
      <GrantNotionApplicationSection grant={grant} />
      <GrantNotionTemplatesSection grant={grant} />
      <GrantNotionContactSection grant={grant} />
    </div>
  );
};

export default GrantNotionContent;
