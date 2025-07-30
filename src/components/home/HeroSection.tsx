import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
const HeroSection = () => {
  const {
    t
  } = useLanguage();
  return (
    <div className="text-center mb-8">
      <h1 className="font-poppins font-semibold text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-4 leading-tight">
        <span className="whitespace-pre-line">{t('hero.title')}</span>
      </h1>
      <p className="text-lg md:text-xl text-black max-w-3xl mx-auto leading-relaxed">
        En översikt över bidrag inom Sverige och EU samlat på ett ställe.
      </p>
    </div>
  );
};
export default HeroSection;