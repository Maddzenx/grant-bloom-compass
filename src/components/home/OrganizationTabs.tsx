import React, { useState, useEffect, useCallback } from "react";
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
  const { t } = useLanguage();
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
  const toggleOrganization = useCallback((orgKey: string) => {
    setSelectedOrganizations(prev => {
      if (prev.includes(orgKey)) {
        // Remove orgKey
        return prev.filter(key => key !== orgKey);
      } else {
        // Add orgKey
        return [...prev, orgKey];
      }
    });
  }, []);
  return <div className="mb-16">
      <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
        {organizationTypes.map(org => (
          <button
            key={org.key}
            onClick={() => toggleOrganization(org.key)}
            className={`px-6 py-3 rounded-xl font-[Basic] font-medium type-secondary transition-all duration-200 ${
              selectedOrganizations.includes(org.key)
                ? 'bg-white text-gray-900 border-2 border-gray-200'
                : 'bg-gray-100 text-gray-800 border border-gray-300 hover:border-gray-400'
            }`}
          >
            {org.label}
          </button>
        ))}
      </div>
    </div>;
};
export default OrganizationTabs;