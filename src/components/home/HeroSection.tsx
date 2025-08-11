import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const HeroSection = () => {
  const { t } = useLanguage();
  
  return (
    <div className="mb-16 text-center animate-fade-in">
      <h1 className="font-['Source_Sans_3'] font-bold type-display text-zinc-900 mb-8 leading-tight tracking-tight max-w-5xl mx-auto">
        <span className="whitespace-pre-line bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-700 bg-clip-text text-transparent drop-shadow-sm">
          {t('hero.title')}
        </span>
      </h1>
      
      {/* Enhanced subtitle with better typography */}
      <p className="font-['Source_Sans_3'] type-title text-zinc-600 max-w-3xl mx-auto font-medium leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
        Använd AI för att hitta de perfekta bidragen för ditt projekt
      </p>
      
      {/* Decorative accent line */}
      <div className="w-24 h-1 bg-gradient-to-r from-[#7D54F4] to-[#CEC5F9] mx-auto mt-8 rounded-full opacity-80"></div>
    </div>
  );
};

export default HeroSection;