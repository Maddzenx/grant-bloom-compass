
import React from "react";
import { Calendar, DollarSign, Building2 } from "lucide-react";
import { Grant } from "@/types/grant";

interface GrantKeyInfoProps {
  grant: Grant;
}

const GrantKeyInfo = ({ grant }: GrantKeyInfoProps) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
          <DollarSign className="w-6 h-6 text-green-600 flex-shrink-0" />
          <div>
            <span className="text-xs text-gray-600 block">Bidragsbelopp</span>
            <div className="font-bold text-gray-900 text-sm">{grant.fundingAmount}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
          <Calendar className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <span className="text-xs text-gray-600 block">Ansökningsdeadline</span>
            <span className="font-bold text-gray-900 text-sm">{grant.deadline}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
          <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
          <div>
            <span className="text-xs text-gray-600 block">Organisation</span>
            <span className="font-bold text-gray-900 text-sm">{grant.organization}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrantKeyInfo;
