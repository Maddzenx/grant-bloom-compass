import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
const HeroSection = () => {
  const {
    t
  } = useLanguage();
  return <div className="mb-12">
      <h1 className="font-newsreader font-semibold text-5xl md:text-6xl lg:text-7xl text-gray-900 mb-6 leading-tight">
        <span className="">{t('hero.title')}</span>
      </h1>
      <p className="font-newsreader font-normal text-xl md:text-2xl text-gray-700 mb-12">
        {t('hero.subtitle')}
      </p>
    </div>;
};
export default HeroSection;