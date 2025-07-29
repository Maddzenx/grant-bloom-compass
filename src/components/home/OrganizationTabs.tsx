import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
interface OrganizationTabsProps {
  onSelectionChange?: (selectedOrganizations: string[]) => void;
}
const organizationTypes = [{
  key: 'foretag',
  label: 'Företag',
  mappedTypes: ['Företag', 'Ekonomiska föreningar', 'Enskilda näringsidkare']
}, {
  key: 'forskning',
  label: 'Forskning',
  mappedTypes: ['Universitet och högskolor']
}, {
  key: 'offentlig',
  label: 'Offentlig Sektor',
  mappedTypes: ['Offentlig sektor', 'Ideella föreningar']
}];
const OrganizationTabs = ({
  onSelectionChange
}: OrganizationTabsProps) => {
  const {
    t
  } = useLanguage();
  // None selected by default
  const [selectedOrganizations, setSelectedOrganizations] = useState<string[]>([]);
  useEffect(() => {
    // Map selected keys to actual organization types for filtering
    const mappedOrganizationTypes = selectedOrganizations.flatMap(key => {
      const orgType = organizationTypes.find(ot => ot.key === key);
      return orgType ? orgType.mappedTypes : [];
    });
    // If none selected, treat as no filtering (all organizations)
    const filterTypes = selectedOrganizations.length === 0 ? [] : mappedOrganizationTypes;
    onSelectionChange?.(filterTypes);
  }, [selectedOrganizations, onSelectionChange]);
  const toggleOrganization = (orgKey: string) => {
    setSelectedOrganizations(prev => {
      if (prev.includes(orgKey)) {
        // Remove orgKey
        return prev.filter(key => key !== orgKey);
      } else {
        // Add orgKey
        return [...prev, orgKey];
      }
    });
  };
  return <div className="mb-16">
      <h3 className="text-base font-[Basic] font-normal mb-4 text-center text-black">
        Sökande organisation:
      </h3>
      <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
        {organizationTypes.map(org => (
          <button
            key={org.key}
            onClick={() => toggleOrganization(org.key)}
            className={`px-3 py-1.5 rounded-full font-[Basic] font-normal text-sm transition-all duration-200 hover:shadow-sm ${
              selectedOrganizations.includes(org.key)
                ? 'bg-white text-black'
                : 'bg-white/50 hover:bg-white/100 text-gray-700'
            }`}
          >
            {org.label}
          </button>
        ))}
      </div>
    </div>;
};
export default OrganizationTabs;