
import React from "react";
import { Grant } from "@/types/grant";

interface GrantNotionKeyInfoProps {
  grant: Grant;
  isMobile?: boolean;
}

const GrantNotionKeyInfo = ({ grant, isMobile = false }: GrantNotionKeyInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      {/* Bidragsbelopp */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
            <span className="text-blue-600 text-sm">💰</span>
          </div>
          <span className="text-sm text-gray-600">Bidragsbelopp</span>
        </div>
        <div className="text-xl font-bold text-gray-900">
          {grant.fundingAmount}
        </div>
      </div>

      {/* Ansökningsdeadline */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
            <span className="text-orange-600 text-sm">📅</span>
          </div>
          <span className="text-sm text-gray-600">Ansökningsdeadline</span>
        </div>
        <div className="text-xl font-bold text-gray-900">
          {grant.deadline}
        </div>
      </div>

      {/* Organisation */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
            <span className="text-green-600 text-sm">🏢</span>
          </div>
          <span className="text-sm text-gray-600">Organisation</span>
        </div>
        <div className="text-xl font-bold text-gray-900">
          {grant.organization}
        </div>
      </div>
    </div>
  );
};

export default GrantNotionKeyInfo;
