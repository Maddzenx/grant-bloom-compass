
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const SavedGrantsHeader = () => {
  const { t } = useLanguage();

  return (
    <div className="mb-8">
      <h1 className="font-bold text-ink-obsidian mb-2 text-2xl">{t('saved.dashboard')}</h1>
    </div>
  );
};

export default SavedGrantsHeader;
