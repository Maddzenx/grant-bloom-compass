
import React from "react";
import { Grant } from "@/types/grant";

interface GrantNotionFundingRulesSectionProps {
  grant: Grant;
}

const GrantNotionFundingRulesSection = ({ grant }: GrantNotionFundingRulesSectionProps) => {
  if (grant.fundingRules.length === 0) return null;

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 mb-4">Finansieringsregler</h3>
      <div className="space-y-2">
        {grant.fundingRules.map((rule, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="w-3 h-3 bg-gray-200 rounded-full mt-0.5 flex-shrink-0"></div>
            <span className="text-xs text-gray-700 leading-relaxed">{rule}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GrantNotionFundingRulesSection;
