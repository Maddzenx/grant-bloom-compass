
import React from "react";
import { Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const EmptyGrantDetails = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-lg p-6 h-full">
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>{t('search.selectGrant')}</p>
        </div>
      </div>
    </div>
  );
};

export default EmptyGrantDetails;
