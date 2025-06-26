
import React from "react";
import { Calendar, DollarSign, Building2 } from "lucide-react";
import { Grant } from "@/types/grant";
import { useLanguage } from "@/contexts/LanguageContext";

interface GrantKeyInfoProps {
  grant: Grant;
  isMobile?: boolean;
}

const GrantKeyInfo = ({
  grant,
  isMobile = false
}: GrantKeyInfoProps) => {
  const { t } = useLanguage();

  return (
    <div className="">
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-3 gap-4'}`}>
        <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
          <DollarSign className="w-5 md:w-6 h-5 md:h-6 text-green-600 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <span className="text-xs text-gray-600 block">{t('grant.fundingAmount')}</span>
            <div className="font-bold text-gray-900 text-sm truncate">{grant.fundingAmount}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
          <Calendar className="w-5 md:w-6 h-5 md:h-6 text-red-600 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <span className="text-xs text-gray-600 block">{t('grant.deadline')}</span>
            <span className="font-bold text-gray-900 text-sm truncate">{grant.deadline}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
          <Building2 className="w-5 md:w-6 h-5 md:h-6 text-blue-600 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <span className="text-xs text-gray-600 block">{t('grant.organization')}</span>
            <span className="font-bold text-gray-900 text-sm truncate">{grant.organization}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrantKeyInfo;
