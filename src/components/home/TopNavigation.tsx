
import React from "react";
import { Link } from "react-router-dom";

const TopNavigation = () => {
  return (
    <nav className="absolute top-0 right-0 p-6 z-10 rounded-bl-lg" style={{ backgroundColor: '#F3EFFD' }}>
      <div className="flex items-center space-x-8">
        <Link 
          to="/discover" 
          className="font-['Source_Sans_3'] font-medium text-gray-700 hover:text-gray-900 transition-colors type-body"
        >
          Upptäck bidrag
        </Link>
        <Link 
          to="/saved" 
          className="font-['Source_Sans_3'] font-medium text-gray-700 hover:text-gray-900 transition-colors type-body"
        >
          Sparade bidrag
        </Link>
        <a 
          href="/discover" 
          className="text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg type-body"
          style={{ backgroundColor: '#7D54F4' }}
        >
          Upptäck bidrag här
        </a>
      </div>
    </nav>
  );
};

export default TopNavigation;
