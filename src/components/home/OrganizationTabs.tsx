import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const OrganizationTabs = () => {
  const { t } = useLanguage();
  const [selectedOrganizations, setSelectedOrganizations] = useState<string[]>([]);
  
  const organizationTypes = [
    'Offentlig sektor',
    'Universitet och högskolor',
    'Företag',
    'Ekonomiska föreningar',
    'Ideella föreningar',
    'Stiftelser',
    'Enskilda näringsidkare',
    'Enskilda forskare',
    'Övrigt'
  ];

  const toggleOrganization = (org: string) => {
    setSelectedOrganizations(prev => 
      prev.includes(org) 
        ? prev.filter(item => item !== org)
        : [...prev, org]
    );
  };

  return (
    <div className="mb-16">
      <h3 className="text-base font-[Basic] font-normal text-gray-400 mb-4 text-center">
        Sökande organisation:
      </h3>
      <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
        {organizationTypes.map((org, index) => (
          <button
            key={index}
            onClick={() => toggleOrganization(org)}
            className={`px-3 py-1.5 rounded-full font-[Basic] font-normal text-sm transition-all duration-200 hover:shadow-sm ${
              selectedOrganizations.includes(org)
                ? 'bg-[#cec5f9] text-white'
                : 'bg-white/50 hover:bg-white/100 text-gray-700'
            }`}
          >
            {org}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrganizationTabs;
