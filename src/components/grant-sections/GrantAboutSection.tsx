import React from "react";
import { Grant } from "@/types/grant";
interface GrantAboutSectionProps {
  grant: Grant;
  isMobile?: boolean;
}
const GrantAboutSection = ({
  grant,
  isMobile = false
}: GrantAboutSectionProps) => {
  const titleClass = isMobile ? 'text-lg' : 'text-xl';
  const textClass = isMobile ? 'text-sm' : 'text-sm';
  return <section>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className={`text-gray-800 leading-relaxed ${textClass} mb-3 md:mb-4`}>{grant.aboutGrant}</p>
        {grant.description !== grant.aboutGrant}
      </div>
    </section>;
};
export default GrantAboutSection;