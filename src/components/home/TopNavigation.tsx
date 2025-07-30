
import React from "react";

const TopNavigation = () => {
  return (
    <nav className="absolute top-0 right-0 p-6 z-10">
      <div className="flex items-center space-x-8">
        <a 
          href="/discover" 
          className="font-newsreader font-medium text-gray-700 hover:text-gray-900 transition-colors text-lg"
        >
          Hem
        </a>
        <a 
          href="/discover" 
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-lg"
        >
          Upptäck bidrag här
        </a>
        <a 
          href="/saved" 
          className="font-newsreader font-medium text-gray-700 hover:text-gray-900 transition-colors text-lg"
        >
          Sparade bidrag
        </a>
      </div>
    </nav>
  );
};

export default TopNavigation;
