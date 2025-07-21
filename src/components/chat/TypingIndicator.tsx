
import React from 'react';
import { Bot } from 'lucide-react';
import { BeatLoader } from "react-spinners";

const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
        {/* Replace with an appropriate icon if you have one */}
        <span className="text-xl">🤖</span>
      </div>
      <div className="bg-canvas-bg rounded-2xl px-4 py-3">
        <BeatLoader size={8} color="#6B7280" />
      </div>
    </div>
  );
};

export default TypingIndicator;
