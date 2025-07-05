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
    <div className="flex flex-col md:flex-row justify-between gap-x-8 gap-y-2 mb-4 items-stretch border rounded-lg px-6 py-4 bg-white">
      {/* Bidragsbelopp */}
      <div className="flex flex-col items-center md:items-center flex-1 text-center">
        <span className="text-xs text-gray-500">Bidragsbelopp</span>
        <span className="text-base font-bold text-gray-900">{grant.fundingAmount}</span>
      </div>
      {/* Ansökningsdeadline */}
      <div className="flex flex-col items-center md:items-center flex-1 text-center">
        <span className="text-xs text-gray-500">Ansökningsdeadline</span>
        <span className="text-base font-bold text-gray-900">{grant.deadline}</span>
      </div>
      {/* Organisation */}
      <div className="flex flex-col items-center md:items-center flex-1 text-center">
        <span className="text-xs text-gray-500">Organisation</span>
        <span className="text-base font-bold text-gray-900">{grant.organization}</span>
      </div>
    </div>
  );
};
export default GrantNotionKeyInfo;