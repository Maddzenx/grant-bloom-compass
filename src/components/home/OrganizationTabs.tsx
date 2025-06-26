
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const OrganizationTabs = () => {
  const { t } = useLanguage();
  
  const organizationTabs = [
    t('org.vinnova'), t('org.formas'), t('org.tillvaxtverket'), 
    t('org.energimyndigheten'), t('org.vgr'), t('org.eu'), t('org.vetenskapsradet')
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto mb-16">
      {organizationTabs.map((org, index) => (
        <button
          key={index}
          className="px-4 py-2 bg-white/50 hover:bg-white/100 rounded-full font-newsreader font-medium text-gray-700 transition-all duration-200 hover:shadow-sm"
        >
          {org}
        </button>
      ))}
    </div>
  );
};

export default OrganizationTabs;
