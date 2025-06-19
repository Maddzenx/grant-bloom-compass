
import React from "react";
import { Grant } from "@/types/grant";

interface GrantFundingRulesSectionProps {
  grant: Grant;
  isMobile?: boolean;
}

const GrantFundingRulesSection = ({ grant, isMobile = false }: GrantFundingRulesSectionProps) => {
  const titleClass = isMobile ? 'text-lg' : 'text-xl';
  const textClass = isMobile ? 'text-sm' : 'text-sm';

  if (grant.fundingRules.length === 0) return null;

  return (
    <section>
      <h2 className={`font-bold text-gray-900 mb-3 md:mb-4 ${titleClass}`}>
        Finansieringsregler
      </h2>
      <div className="bg-gray-50 p-4 rounded-lg">
        <ul className="space-y-2 md:space-y-3">
          {grant.fundingRules.map((rule, index) => (
            <li key={index} className={`${textClass} flex items-start gap-3`}>
              <span className="font-bold text-green-600 mt-1 flex-shrink-0">✓</span>
              <span className="text-gray-800 leading-relaxed">{rule}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default GrantFundingRulesSection;
