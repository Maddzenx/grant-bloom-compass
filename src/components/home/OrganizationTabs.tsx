
import React from "react";

const OrganizationTabs = () => {
  const organizationTabs = [
    "Vinnova", "Formas", "Tillväxtverket", "Energimyndigheten", 
    "VGR", "EU", "Vetenskapsrådet"
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
