import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
const HeroSection = () => {
  const {
    t
  } = useLanguage();
  return <div className="mb-12">
      <h1 className="font-sans font-bold text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-4 leading-tight">
        <span className="whitespace-pre-line">{t('hero.title')}</span>
      </h1>
      
    </div>;
};
export default HeroSection;