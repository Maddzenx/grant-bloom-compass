import React from "react";
import { Grant } from "@/types/grant";
interface GrantMainContentProps {
  grant: Grant;
  isMobile?: boolean;
}
const GrantMainContent = ({
  grant,
  isMobile = false
}: GrantMainContentProps) => {
  const spacingClass = isMobile ? 'space-y-6' : 'space-y-8';
  const titleClass = isMobile ? 'text-lg' : 'text-xl';
  const textClass = isMobile ? 'text-sm' : 'text-sm';
  return <div className={spacingClass}>
      {/* Main Description */}
      <section>
        <h2 className={`font-bold text-gray-900 mb-3 md:mb-4 ${titleClass}`}>
          Om detta bidrag
        </h2>
        <div className="">
          <p className={`text-gray-800 leading-relaxed ${textClass} mb-3 md:mb-4`}>{grant.aboutGrant}</p>
          {grant.description !== grant.aboutGrant && <p className={`text-gray-700 leading-relaxed ${textClass}`}>{grant.description}</p>}
        </div>
      </section>

      {/* Eligibility */}
      <section>
        <h2 className={`font-bold text-gray-900 mb-3 md:mb-4 ${titleClass}`}>
          Vem kan ansöka?
        </h2>
        <div className="">
          <p className={`text-gray-800 leading-relaxed ${textClass}`}>{grant.whoCanApply}</p>
        </div>
      </section>

      {/* Funding Rules */}
      {grant.fundingRules.length > 0 && <section>
          <h2 className={`font-bold text-gray-900 mb-3 md:mb-4 ${titleClass}`}>
            Finansieringsregler
          </h2>
          <div className="">
            <ul className="space-y-2 md:space-y-3">
              {grant.fundingRules.map((rule, index) => <li key={index} className={`${textClass} flex items-start gap-3`}>
                  <span className="font-bold text-green-600 mt-1 flex-shrink-0">✓</span>
                  <span className="text-gray-800 leading-relaxed">{rule}</span>
                </li>)}
            </ul>
          </div>
        </section>}

      {/* Quick Summary Box */}
      <section className="">
        
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-2 gap-4'}`}>
          
          
        </div>
      </section>
    </div>;
};
export default GrantMainContent;