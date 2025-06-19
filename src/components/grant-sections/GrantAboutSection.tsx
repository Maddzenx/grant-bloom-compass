
import React from "react";
import { Grant } from "@/types/grant";

interface GrantAboutSectionProps {
  grant: Grant;
  isMobile?: boolean;
}

const GrantAboutSection = ({ grant, isMobile = false }: GrantAboutSectionProps) => {
  const titleClass = isMobile ? 'text-lg' : 'text-xl';
  const textClass = isMobile ? 'text-sm' : 'text-sm';

  return (
    <section>
      <h2 className={`font-bold text-gray-900 mb-3 md:mb-4 ${titleClass}`}>
        Om detta bidrag
      </h2>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className={`text-gray-800 leading-relaxed ${textClass} mb-3 md:mb-4`}>{grant.aboutGrant}</p>
        {grant.description !== grant.aboutGrant && (
          <p className={`text-gray-700 leading-relaxed ${textClass}`}>{grant.description}</p>
        )}
      </div>
    </section>
  );
};

export default GrantAboutSection;
