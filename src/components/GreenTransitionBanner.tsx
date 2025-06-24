
import React from "react";

interface GreenTransitionBannerProps {
  isVisible: boolean;
}

const GreenTransitionBanner = ({ isVisible }: GreenTransitionBannerProps) => {
  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 bg-green-600 text-white py-3 px-4 shadow-lg transition-all duration-300 ease-in-out ${
        isVisible 
          ? 'opacity-100 transform translate-y-0' 
          : 'opacity-0 transform -translate-y-full pointer-events-none'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-lg font-bold text-center">
          Grön omställning och arbetsliv
        </h2>
      </div>
    </div>
  );
};

export default GreenTransitionBanner;
