
import React from "react";
import { GrantDetails as GrantDetailsType } from "@/types/grant";

interface GrantNotionFundingRulesSectionProps {
  grant: GrantDetailsType;
}

const GrantNotionFundingRulesSection = ({ grant }: GrantNotionFundingRulesSectionProps) => {
  if (grant.fundingRules.length === 0) return null;

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 mb-4">Bidraget täcker följande:</h3>
      <ul className="list-disc list-inside space-y-2">
        {grant.fundingRules.map((rule, index) => (
          <li key={index} className="text-xs text-gray-700 leading-relaxed">
            {rule}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GrantNotionFundingRulesSection;
