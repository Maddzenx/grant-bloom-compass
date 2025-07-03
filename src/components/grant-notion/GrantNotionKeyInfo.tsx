import React from "react";
import { Grant } from "@/types/grant";
interface GrantNotionKeyInfoProps {
  grant: Grant;
  isMobile?: boolean;
}
const GrantNotionKeyInfo = ({
  grant,
  isMobile = false
}: GrantNotionKeyInfoProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-6 items-start md:items-center">
      {/* Bidragsbelopp */}
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">Bidragsbelopp</span>
        <span className="text-base font-semibold text-gray-900">{grant.fundingAmount}</span>
      </div>
      {/* Ansökningsdeadline */}
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">Ansökningsdeadline</span>
        <span className="text-base font-semibold text-gray-900">{grant.deadline}</span>
      </div>
      {/* Organisation */}
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">Organisation</span>
        <span className="text-base font-semibold text-gray-900">{grant.organization}</span>
      </div>
    </div>
  );
};
export default GrantNotionKeyInfo;