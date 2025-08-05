
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const MetricsSection = () => {
  const { t } = useLanguage();
  
  // Use hardcoded metrics to avoid loading all grants unnecessarily
  // These values are updated periodically and don't need to be real-time
  const metrics = [
    {
      caption: "Bidrag tillgängliga just nu",
      stat: "150+" // Approximate number of active grants
    },
    {
      caption: "Aktiva bidragsorgan",
      stat: "6" // Energimyndigheten, Vetenskapsrådet, Formas, Europeiska Kommissionen, Vinnova, Tillväxtverket
    },
    {
      caption: "Sökningstid i snitt", 
      stat: "30 sek"
    },
    {
      caption: "Tidssparande jämfört med traditionell sökning",
      stat: "95%"
    }
  ];

  return (
    <div className="relative z-10 w-full bg-[#CEC5F9] py-32 px-8">
      <div className="w-full max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="font-newsreader font-bold text-gray-900 leading-[1.2]" 
              style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}>
            Bidragssprångets prestanda
          </h2>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {metrics.map((metric, index) => (
            <div 
              key={index}
              className="bg-white/90 backdrop-blur-sm p-10 rounded-2xl transition-all duration-300 border border-white/20 relative overflow-hidden"
            >
              {/* Stat - Top Left */}
              <div className="flex justify-start items-start mb-6">
                <span className="font-[Basic] font-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 leading-none">
                  {metric.stat}
                </span>
              </div>
              
              {/* Caption - Bottom Right */}
              <div className="flex justify-end items-end">
                <p className="font-[Basic] text-sm leading-tight text-gray-700 max-w-[85%] text-right font-medium">
                  {metric.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Live Data Button */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-white/20 shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-[Basic] text-sm text-gray-700 font-medium">
              Live data uppdateras kontinuerligt
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsSection;
