import React from "react";
import { GrantDetails as GrantDetailsType } from "@/types/grant";

interface GrantNotionQualificationsSectionProps {
  grant: GrantDetailsType;
}

const GrantNotionQualificationsSection = ({ grant }: GrantNotionQualificationsSectionProps) => {
  if (!grant.qualifications) return null;

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 mb-4">Kvalifikationer</h3>
      <p className="text-sm text-gray-700 leading-relaxed">
        {grant.qualifications}
      </p>
    </div>
  );
};

export default GrantNotionQualificationsSection; 