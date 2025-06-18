
import React from "react";
import { Calendar, DollarSign } from "lucide-react";
import { Grant } from "@/types/grant";

interface GrantKeyInfoProps {
  grant: Grant;
}

const GrantKeyInfo = ({ grant }: GrantKeyInfoProps) => {
  return (
    <div className="grid grid-cols-2 gap-6 mb-8">
      <div className="flex items-center gap-3">
        <DollarSign className="w-6 h-6 text-gray-600" />
        <div>
          <span className="text-sm text-gray-600 block">Funding amount</span>
          <div className="font-bold text-gray-900 text-lg">{grant.fundingAmount}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Calendar className="w-6 h-6 text-gray-600" />
        <div>
          <span className="text-sm text-gray-600 block">Deadline:</span>
          <span className="font-bold text-gray-900 text-lg">{grant.deadline}</span>
        </div>
      </div>
    </div>
  );
};

export default GrantKeyInfo;
