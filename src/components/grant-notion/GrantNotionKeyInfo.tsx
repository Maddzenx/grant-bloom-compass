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
  return <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {/* Bidragsbelopp */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          
          <span className="text-xs text-gray-600">Bidragsbelopp</span>
        </div>
        <div className="text-lg font-bold text-gray-900">
          {grant.fundingAmount}
        </div>
      </div>

      {/* Ansökningsdeadline */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          
          <span className="text-xs text-gray-600">Ansökningsdeadline</span>
        </div>
        <div className="text-lg font-bold text-gray-900">
          {grant.deadline}
        </div>
      </div>

      {/* Organisation */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          
          <span className="text-xs text-gray-600">Organisation</span>
        </div>
        <div className="text-lg font-bold text-gray-900">
          {grant.organization}
        </div>
      </div>
    </div>;
};
export default GrantNotionKeyInfo;