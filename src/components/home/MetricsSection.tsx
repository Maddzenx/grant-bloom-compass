
import React from "react";

const MetricsSection = () => {
  const metrics = [
    {
      caption: "Your data is never shared with third parties",
      stat: "40%"
    },
    {
      caption: "Save time up to",
      stat: "8h"
    },
    {
      caption: "Your data is never shared with third parties", 
      stat: "50%"
    },
    {
      caption: "Save time up to",
      stat: "2x"
    }
  ];

  return (
    <div className="relative z-10 w-full bg-[#CEC5F9] py-16 px-6">
      <div className="w-full max-w-6xl mx-auto">
        {/* Headline with highlighted "baby" */}
        <div className="text-center mb-16">
          <h2 className="font-newsreader font-normal text-4xl md:text-5xl lg:text-6xl text-gray-900 leading-[1.15]">
            It's like AI agents and Grants had a{" "}
            <span className="relative inline-block">
              <span 
                className="absolute bg-[#D1F364] -z-10"
                style={{
                  width: '110%',
                  height: '70%',
                  bottom: '10%',
                  left: '2px',
                  transform: 'translateY(2px)'
                }}
              />
              <span className="relative z-10">baby</span>
            </span>
          </h2>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div 
              key={index}
              className="bg-[#D7CFFC] p-12 rounded-lg flex flex-col justify-between min-h-[200px] relative"
            >
              {/* Caption - Top Left */}
              <p className="font-newsreader text-[15px] leading-[1.3] text-gray-800 opacity-80 max-w-[70%]">
                {metric.caption}
              </p>
              
              {/* Stat - Bottom Right */}
              <div className="flex justify-end items-end flex-1">
                <span className="font-newsreader font-normal text-5xl md:text-6xl text-gray-900">
                  {metric.stat}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetricsSection;
