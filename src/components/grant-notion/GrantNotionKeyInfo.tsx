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
  return <div className="flex flex-col sm:flex-row gap-2 mb-3 border bg-white rounded-lg justify-center items-center py-[20px] mx-0 px-[10px]">
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
      {/* Medfinansiering */}
      <div className="flex flex-col items-center justify-center text-center min-w-[120px]">
        <span className="text-xs text-gray-500">Medfinansiering</span>
        <span className="text-base font-bold text-gray-900">{grant.cofinancing_required ? 'Ja' : 'Nej'}</span>
      </div>
    </div>;
};
export default GrantNotionKeyInfo;