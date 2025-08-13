
import React from "react";
import { GrantDetails as GrantDetailsType } from "@/types/grant";

interface GrantNotionApplicationSectionProps {
  grant: GrantDetailsType;
}

const GrantNotionApplicationSection = ({ grant }: GrantNotionApplicationSectionProps) => {
  if (!grant.applicationProcess) return null;

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 mb-4">Ansökningsprocess</h3>
      <p className="text-sm text-gray-700 leading-relaxed">
        {grant.applicationProcess}
      </p>
    </div>
  );
};

export default GrantNotionApplicationSection;
