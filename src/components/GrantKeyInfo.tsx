
import React from "react";
import { Calendar, DollarSign } from "lucide-react";
import { Grant } from "@/types/grant";

interface GrantKeyInfoProps {
  grant: Grant;
}

const GrantKeyInfo = ({ grant }: GrantKeyInfoProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-gray-600" />
        <div>
          <span className="text-xs text-gray-600 block">Funding amount</span>
          <div className="font-bold text-gray-900 text-sm">{grant.fundingAmount}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-gray-600" />
        <div>
          <span className="text-xs text-gray-600 block">Deadline:</span>
          <span className="font-bold text-gray-900 text-sm">{grant.deadline}</span>
        </div>
      </div>
    </div>
  );
};

export default GrantKeyInfo;
