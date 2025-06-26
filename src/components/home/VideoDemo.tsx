
import React from "react";

const VideoDemo = () => {
  return (
    <div className="relative z-10 w-full bg-[#F0F1F3] py-16 px-6">
      <div className="w-full max-w-6xl mx-auto">
        {/* Video Container with 16:9 aspect ratio */}
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <div className="absolute inset-0 border-4 border-dashed border-gray-400 rounded-lg bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <p className="font-newsreader font-medium text-gray-600 text-lg md:text-xl">
                Video på hur verktyget fungerar
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDemo;
