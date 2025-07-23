import React from "react";
import { Grant } from "@/types/grant";
import { formatCofinancingText } from "@/utils/grantHelpers";

interface GrantNotionKeyInfoProps {
  grant: Grant;
  isMobile?: boolean;
}

const GrantNotionKeyInfo = ({
  grant,
  isMobile = false
}: GrantNotionKeyInfoProps) => {
  return <div className="flex flex-col sm:flex-row gap-2 mb-3 border bg-white rounded-lg justify-center flex-auto py-[20px] mx-0 px-0">
    {/* Bidragsbelopp */}
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <span className="text-xs text-gray-500">Bidragsbelopp</span>
      <span className="text-base font-bold text-gray-900">{grant.fundingAmount}</span>
    </div>
    {/* Ansökningsdeadline */}
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <span className="text-xs text-gray-500">Ansökningsdeadline</span>
      <span className="text-base font-bold text-gray-900">{grant.deadline}</span>
    </div>
    {/* Medfinansiering */}
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <span className="text-xs text-gray-500">Medfinansiering</span>
      <span className="text-base font-bold text-gray-900">{formatCofinancingText(grant.cofinancing_required, grant.cofinancing_level)}</span>
    </div>
  </div>;
};

export default GrantNotionKeyInfo;