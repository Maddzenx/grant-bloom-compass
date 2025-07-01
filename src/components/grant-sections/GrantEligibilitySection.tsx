
import React from "react";
import { Grant } from "@/types/grant";
import { Users } from "lucide-react";

interface GrantEligibilitySectionProps {
  grant: Grant;
  isMobile?: boolean;
}

const GrantEligibilitySection = ({
  grant,
  isMobile = false
}: GrantEligibilitySectionProps) => {
  const titleClass = isMobile ? 'text-lg' : 'text-xl';
  const textClass = isMobile ? 'text-sm' : 'text-sm';

  // Only render if we have eligibility information
  if (!grant.whoCanApply && !grant.qualifications) {
    return null;
  }

  return (
    <section>
      <h3 className={`font-semibold text-gray-900 mb-3 flex items-center gap-2 ${titleClass}`}>
        <Users className="w-5 h-5 text-gray-600" />
        Vem kan söka
      </h3>
      <div className="bg-gray-50 p-4 rounded-lg">
        {grant.whoCanApply && (
          <p className={`text-gray-800 leading-relaxed ${textClass}`}>
            {grant.whoCanApply}
          </p>
        )}
        {grant.qualifications && (
          <div className={grant.whoCanApply ? "mt-3" : ""}>
            <h4 className="font-medium text-gray-900 mb-2">Kvalifikationer:</h4>
            <p className={`text-gray-700 ${textClass}`}>
              {grant.qualifications}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default GrantEligibilitySection;
