
import React from "react";

const TopNavigation = () => {
  return (
    <nav className="absolute top-0 right-0 p-6 z-10 rounded-bl-lg" style={{ backgroundColor: '#F3EFFD' }}>
      <div className="flex items-center space-x-8">
        <a 
          href="/discover" 
          className="font-newsreader font-medium text-gray-700 hover:text-gray-900 transition-colors type-body"
        >
          Hem
        </a>
        <a 
          href="/discover" 
          className="text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg type-body"
          style={{ backgroundColor: '#7D54F4' }}
        >
          Upptäck bidrag här
        </a>
        <a 
          href="/saved" 
          className="font-newsreader font-medium text-gray-700 hover:text-gray-900 transition-colors type-body"
        >
          Sparade bidrag
        </a>
      </div>
    </nav>
  );
};

export default TopNavigation;
