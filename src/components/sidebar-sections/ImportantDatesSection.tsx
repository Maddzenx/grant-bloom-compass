
import React from "react";
import { Calendar } from "lucide-react";

interface ImportantDatesSectionProps {
  importantDates: string[];
  isMobile?: boolean;
}

const ImportantDatesSection = ({ importantDates, isMobile = false }: ImportantDatesSectionProps) => {
  const formatImportantDate = (dateString: string) => {
    const lowerDate = dateString.toLowerCase();
    
    if (lowerDate.includes('webinar') || lowerDate.includes('informationsmöte') || lowerDate.includes('information')) {
      return `📅 ${dateString}`;
    }
    
    if (lowerDate.includes('ansök') || lowerDate.includes('deadline') || lowerDate.includes('sista')) {
      return `⏰ ${dateString}`;
    }
    
    if (lowerDate.includes('beslut') || lowerDate.includes('resultat') || lowerDate.includes('meddelande')) {
      return `📋 ${dateString}`;
    }
    
    if (lowerDate.includes('projektstart') || lowerDate.includes('start')) {
      return `🚀 ${dateString}`;
    }
    
    if (lowerDate.includes('projektslut') || lowerDate.includes('avslut')) {
      return `🏁 ${dateString}`;
    }
    
    return `📅 ${dateString}`;
  };

  const paddingClass = isMobile ? 'p-3' : 'p-4';
  const textClass = isMobile ? 'text-xs' : 'text-xs';
  const titleClass = isMobile ? 'text-sm' : 'text-sm';

  if (importantDates.length === 0) return null;

  return (
    <section className={`bg-blue-50 ${paddingClass} rounded-lg border border-blue-200`}>
      <div className="flex items-center gap-2 mb-2 md:mb-3">
        <Calendar className="w-4 h-4 text-blue-600" />
        <h3 className={`font-bold text-blue-900 ${titleClass}`}>Viktiga datum</h3>
      </div>
      <ul className="space-y-1 md:space-y-2">
        {importantDates.map((date, index) => (
          <li key={index} className="text-blue-800">
            <span className={`${textClass} leading-relaxed`}>{formatImportantDate(date)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ImportantDatesSection;
