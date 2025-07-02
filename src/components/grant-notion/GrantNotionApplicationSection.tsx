
import React from "react";
import { Grant } from "@/types/grant";

interface GrantNotionApplicationSectionProps {
  grant: Grant;
}

const GrantNotionApplicationSection = ({ grant }: GrantNotionApplicationSectionProps) => {
  if (!grant.applicationProcess) return null;

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 mb-4">Ansökningsprocess</h3>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-700 leading-relaxed">
          {grant.applicationProcess}
        </p>
      </div>
    </div>
  );
};

export default GrantNotionApplicationSection;
