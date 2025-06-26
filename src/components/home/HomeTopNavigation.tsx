
import React from "react";

const HomeTopNavigation = () => {
  return (
    <nav className="absolute top-0 left-0 right-0 z-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div 
              className="font-newsreader font-normal text-2xl"
              role="img"
              aria-label="Graigent logo"
            >
              <span className="text-black">gr</span>
              <span style={{ color: '#8162F4' }}>ai</span>
              <span className="text-black">gent</span>
            </div>
          </div>

          {/* Right side navigation */}
          <div className="flex items-center space-x-8">
            <a 
              href="#" 
              className="font-newsreader font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Pricing
            </a>
            <a 
              href="#" 
              className="font-newsreader font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              About
            </a>
            <button className="bg-[#D1F364] hover:bg-[#C5E858] text-gray-900 font-newsreader font-medium px-6 py-2 rounded-full transition-colors">
              Start for free
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HomeTopNavigation;
