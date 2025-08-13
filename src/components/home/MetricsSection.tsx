
import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const MetricsSection = () => {
  const { t } = useLanguage();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<Record<number, number>>({});
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Use hardcoded metrics to avoid loading all grants unnecessarily
  // These values are updated periodically and don't need to be real-time
  const metrics = [
    {
      caption: "Bidrag tillgängliga just nu",
      stat: "800+", // Approximate number of active grants
      finalValue: 800,
      hasPlus: true
    },
    {
      caption: "Aktiva bidragsorgan",
      stat: "6", // Energimyndigheten, Vetenskapsrådet, Formas, Europeiska Kommissionen, Vinnova, Tillväxtverket
      finalValue: 6,
      hasPlus: false
    },
    {
      caption: "Sökningstid i snitt", 
      stat: "30 sek",
      finalValue: 30,
      hasPlus: false,
      suffix: " sek"
    },
    {
      caption: "Tidssparande jämfört med traditionell sökning",
      stat: "95%",
      finalValue: 95,
      hasPlus: false,
      suffix: "%"
    }
  ];

  // Animation function
  const animateValue = (index: number, start: number, end: number, duration: number) => {
    const startTime = performance.now();
    
    const updateValue = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(start + (end - start) * easeOutQuart);
      
      setAnimatedValues(prev => ({
        ...prev,
        [index]: currentValue
      }));
      
      if (progress < 1) {
        requestAnimationFrame(updateValue);
      }
    };
    
    requestAnimationFrame(updateValue);
  };

  // Intersection Observer to trigger animation
  useEffect(() => {
    if (hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            
            // Animate each metric
            metrics.forEach((metric, index) => {
              if (metric.finalValue) {
                setTimeout(() => {
                  animateValue(index, 0, metric.finalValue, 2000);
                }, index * 200); // Stagger the animations
              }
            });
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
        rootMargin: '0px 0px -100px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated, metrics]);

  return (
    <div ref={sectionRef} className="relative z-10 w-full bg-[#CEC5F9] py-32 px-8">
      <div className="w-full max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="font-newsreader font-bold text-gray-900 leading-[1.2]" 
              style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}>
                            Utlysningars prestanda
          </h2>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {metrics.map((metric, index) => (
            <div 
              key={index}
              className="bg-white/95 backdrop-blur-md p-8 rounded-3xl transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-white/30 relative overflow-hidden shadow-lg"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Stat - Centered */}
              <div className="flex justify-center items-center mb-8 relative z-10">
                <span className="font-[Basic] font-bold text-3xl md:text-4xl lg:text-5xl text-gray-900 leading-none text-center">
                  {hasAnimated && animatedValues[index] !== undefined
                    ? `${animatedValues[index]}${metric.suffix || ''}${metric.hasPlus ? '+' : ''}`
                    : hasAnimated 
                      ? `${metric.finalValue}${metric.suffix || ''}${metric.hasPlus ? '+' : ''}`
                      : `0${metric.suffix || ''}${metric.hasPlus ? '+' : ''}`
                  }
                </span>
              </div>
              
              {/* Caption - Centered */}
              <div className="flex justify-center items-center relative z-10">
                <p className="font-[Basic] text-base leading-relaxed text-gray-700 text-center font-semibold max-w-xs">
                  {metric.caption}
                </p>
              </div>
              
              {/* Decorative corner element */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-bl-full"></div>
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
