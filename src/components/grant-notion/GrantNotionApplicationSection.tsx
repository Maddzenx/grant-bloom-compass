
import React from "react";
import { GrantDetails as GrantDetailsType } from "@/types/grant";

interface GrantNotionApplicationSectionProps {
  grant: GrantDetailsType;
}

const GrantNotionApplicationSection = ({ grant }: GrantNotionApplicationSectionProps) => {
  if (!grant.applicationProcess) return null;

  return (
    <div>
      <h3 className="type-title text-zinc-900 mb-4">Ansökningsprocess</h3>
      <p className="type-secondary text-zinc-700 leading-relaxed">
        {grant.applicationProcess}
      </p>
    </div>
  );
};

export default GrantNotionApplicationSection;
