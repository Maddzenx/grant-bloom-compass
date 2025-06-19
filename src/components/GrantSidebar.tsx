
import React from "react";
import { Grant } from "@/types/grant";
import { Calendar, Mail, Phone, Building, User } from "lucide-react";

interface GrantSidebarProps {
  grant: Grant;
  isMobile?: boolean;
}

const GrantSidebar = ({ grant, isMobile = false }: GrantSidebarProps) => {
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

  const spacingClass = isMobile ? 'space-y-4' : 'space-y-6';
  const paddingClass = isMobile ? 'p-3' : 'p-4';
  const textClass = isMobile ? 'text-xs' : 'text-xs';
  const titleClass = isMobile ? 'text-sm' : 'text-sm';

  return (
    <div className={spacingClass}>
      {/* Important Dates */}
      {grant.importantDates.length > 0 && (
        <section className={`bg-blue-50 ${paddingClass} rounded-lg border border-blue-200`}>
          <div className="flex items-center gap-2 mb-2 md:mb-3">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h3 className={`font-bold text-blue-900 ${titleClass}`}>Viktiga datum</h3>
          </div>
          <ul className="space-y-1 md:space-y-2">
            {grant.importantDates.map((date, index) => (
              <li key={index} className="text-blue-800">
                <span className={`${textClass} leading-relaxed`}>{formatImportantDate(date)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Contact Information */}
      <section className={`bg-gray-50 ${paddingClass} rounded-lg border border-gray-200`}>
        <h3 className={`font-bold text-gray-900 mb-2 md:mb-3 ${titleClass}`}>Kontakt</h3>
        <div className="space-y-2">
          {grant.contact.name && (
            <div className="flex items-center gap-2">
              <User className="w-3 h-3 text-gray-600 flex-shrink-0" />
              <span className={`font-medium text-gray-900 ${textClass} truncate`}>{grant.contact.name}</span>
            </div>
          )}
          {grant.contact.organization && (
            <div className="flex items-center gap-2">
              <Building className="w-3 h-3 text-gray-600 flex-shrink-0" />
              <span className={`text-gray-700 ${textClass} truncate`}>{grant.contact.organization}</span>
            </div>
          )}
          {grant.contact.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3 h-3 text-gray-600 flex-shrink-0" />
              <a 
                href={`mailto:${grant.contact.email}`}
                className={`text-blue-600 underline hover:text-blue-800 ${textClass} break-all truncate`}
              >
                {grant.contact.email}
              </a>
            </div>
          )}
          {grant.contact.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3 h-3 text-gray-600 flex-shrink-0" />
              <a 
                href={`tel:${grant.contact.phone}`}
                className={`text-blue-600 underline hover:text-blue-800 ${textClass}`}
              >
                {grant.contact.phone}
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default GrantSidebar;
