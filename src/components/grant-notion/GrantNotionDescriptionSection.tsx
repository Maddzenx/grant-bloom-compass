import React from "react";
import { GrantDetails as GrantDetailsType } from "@/types/grant";

interface GrantNotionDescriptionSectionProps {
  grant: GrantDetailsType;
}

const GrantNotionDescriptionSection = ({ grant }: GrantNotionDescriptionSectionProps) => {
  if (!grant.description) return null;

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 mb-4">Beskrivning</h3>
      <p className="text-sm text-gray-700 leading-relaxed">
        {grant.description}
      </p>
    </div>
  );
};

export default GrantNotionDescriptionSection; 