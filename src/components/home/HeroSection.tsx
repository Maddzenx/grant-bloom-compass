import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
const HeroSection = () => {
  const { t } = useLanguage();
  return <div className="mb-12">
      <h1 className="font-poppins font-semibold type-display text-gray-900 mb-4 leading-tight">
        <span className="whitespace-pre-line">{t('hero.title')}</span>
      </h1>
      
    </div>;
};
export default HeroSection;