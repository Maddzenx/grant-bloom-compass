import React from "react";
import { Grant } from "@/types/grant";

interface GrantNotionDescriptionSectionProps {
  grant: Grant;
}

const GrantNotionDescriptionSection = ({ grant }: GrantNotionDescriptionSectionProps) => {
  if (!grant.long_description) return null;

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 mb-4">Beskrivning</h3>
      <p className="text-sm text-gray-700 leading-relaxed">
        {grant.long_description}
      </p>
    </div>
  );
};

export default GrantNotionDescriptionSection; 