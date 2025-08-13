import React, { useState, useEffect, useCallback } from "react";

interface GrantTypeTabsProps {
  onSelectionChange?: (selectedGrantTypes: string[]) => void;
}

const grantTypes = [
  {
    key: 'swedish',
    label: 'Svenska bidrag',
    filterValue: 'swedish'
  },
  {
    key: 'eu',
    label: 'EU-bidrag',
    filterValue: 'eu'
  }
];

const GrantTypeTabs = ({ onSelectionChange }: GrantTypeTabsProps) => {
  // None selected by default
  const [selectedGrantTypes, setSelectedGrantTypes] = useState<string[]>([]);

  useEffect(() => {
    // Map selected keys to actual grant type filters
    const mappedGrantTypes = selectedGrantTypes.map(key => {
      const grantType = grantTypes.find(gt => gt.key === key);
      return grantType ? grantType.filterValue : '';
    }).filter(Boolean);

    // If none selected or all selected, treat as no filtering (both)
    const filterTypes = (selectedGrantTypes.length === 0 || selectedGrantTypes.length === grantTypes.length) 
      ? [] 
      : mappedGrantTypes;
    
    onSelectionChange?.(filterTypes);
  }, [selectedGrantTypes, onSelectionChange]);

  const toggleGrantType = useCallback((grantTypeKey: string) => {
    setSelectedGrantTypes(prev => {
      if (prev.includes(grantTypeKey)) {
        // Remove grantTypeKey
        return prev.filter(key => key !== grantTypeKey);
      } else {
        // Add grantTypeKey
        return [...prev, grantTypeKey];
      }
    });
  }, []);

  return (
    <div className="mb-16">
      <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
        {grantTypes.map(grantType => (
          <button
            key={grantType.key}
            onClick={() => toggleGrantType(grantType.key)}
            className={`px-6 py-3 rounded-xl font-[Basic] font-medium text-sm transition-all duration-200 ${
              selectedGrantTypes.includes(grantType.key)
                ? 'bg-white text-gray-900 border-2 border-gray-200'
                : 'bg-gray-100 text-gray-800 border border-gray-300 hover:border-gray-400'
            }`}
          >
            {grantType.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GrantTypeTabs; 