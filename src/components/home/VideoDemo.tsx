
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const VideoDemo = () => {
  const { t } = useLanguage();

  return (
    <div className="relative z-10 w-full bg-[#F0F1F3] py-16 px-6">
      <div className="w-full max-w-6xl mx-auto">
        {/* Video Container with 16:9 aspect ratio */}
        <div className="relative aspect-video max-w-4xl mx-auto">
          {/* Placeholder for video */}
          <div className="absolute inset-0 border-4 border-dashed border-gray-400 rounded-lg bg-canvas-bg flex items-center justify-center">
            <p className="text-gray-500">Video coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDemo;
