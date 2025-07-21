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
  return <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-4 border rounded-lg bg-white mx-0 py-[5px] px-[10px]">
      {/* Bidragsbelopp */}
      <div className="flex flex-col items-center justify-center text-center min-w-[120px]">
        <span className="text-xs text-gray-500">Bidragsbelopp</span>
        <span className="text-base font-bold text-gray-900">{grant.fundingAmount}</span>
      </div>
      {/* Ansökningsdeadline */}
      <div className="flex flex-col items-center justify-center text-center min-w-[120px]">
        <span className="text-xs text-gray-500">Ansökningsdeadline</span>
        <span className="text-base font-bold text-gray-900">{grant.deadline}</span>
      </div>
      {/* Organisation */}
      <div className="flex flex-col items-center justify-center text-center min-w-[120px]">
        <span className="text-xs text-gray-500">Organisation</span>
        <span className="text-base font-bold text-gray-900">{grant.organization}</span>
      </div>
    </div>;
};
export default GrantNotionKeyInfo;