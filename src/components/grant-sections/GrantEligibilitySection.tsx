
import React from "react";
import { Grant } from "@/types/grant";
import { Users } from "lucide-react";

interface GrantEligibilitySectionProps {
  grant: Grant;
  isMobile?: boolean;
}

const GrantEligibilitySection = ({ grant, isMobile = false }: GrantEligibilitySectionProps) => {
  const titleClass = isMobile ? 'text-lg' : 'text-xl';
  const textClass = isMobile ? 'text-sm' : 'text-sm';

  return (
    <section className="bg-blue-50 p-4 md:p-6 rounded-lg border-2 border-blue-200">
      <div className="flex items-center gap-2 mb-3 md:mb-4">
        <Users className="w-5 h-5 text-blue-600" />
        <h2 className={`font-bold text-blue-900 ${titleClass}`}>
          Behörighet och krav
        </h2>
      </div>
      <div className="bg-white p-4 rounded-lg space-y-3">
        <div>
          <h3 className={`font-semibold text-blue-800 mb-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
            Vem kan ansöka
          </h3>
          <p className={`text-gray-800 leading-relaxed ${textClass}`}>{grant.whoCanApply}</p>
        </div>
        
        {grant.requirements.length > 0 && (
          <div>
            <h3 className={`font-semibold text-blue-800 mb-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
              Specifika krav
            </h3>
            <ul className="space-y-1">
              {grant.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-sm flex-shrink-0">•</span>
                  <span className={`text-gray-800 leading-relaxed ${textClass}`}>{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default GrantEligibilitySection;
