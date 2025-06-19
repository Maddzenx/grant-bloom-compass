
import React from "react";
import { Grant } from "@/types/grant";

interface GrantSidebarProps {
  grant: Grant;
}

const GrantSidebar = ({ grant }: GrantSidebarProps) => {
  const handleLinkClick = (linkText: string) => {
    console.log('Clicking on link:', linkText);
    
    // Check if the text contains a direct URL
    const urlMatch = linkText.match(/https?:\/\/[^\s]+/);
    if (urlMatch) {
      console.log('Found direct URL:', urlMatch[0]);
      window.open(urlMatch[0], '_blank', 'noopener,noreferrer');
      return;
    }
    
    // Check if it looks like a domain without protocol
    const possibleUrl = linkText.trim();
    if (possibleUrl.includes('.') && !possibleUrl.includes(' ') && possibleUrl.length < 100) {
      console.log('Treating as domain:', possibleUrl);
      window.open(`https://${possibleUrl}`, '_blank', 'noopener,noreferrer');
      return;
    }
    
    // For file names or descriptions, try to search for them or show a message
    if (linkText.includes('handbook') || linkText.includes('handboken') || linkText.includes('mall') || linkText.includes('template')) {
      console.log('File reference detected:', linkText);
      alert(`Detta verkar vara en referens till en fil eller mall: "${linkText}". Kontakta organisationen för att få tillgång till filen.`);
      return;
    }
    
    // If nothing else works, try a general web search
    const searchQuery = encodeURIComponent(linkText);
    const searchUrl = `https://www.google.com/search?q=${searchQuery}`;
    console.log('Performing web search for:', linkText);
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      {/* Basic Grant Information */}
      <section className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-bold text-gray-900 mb-3 text-sm">Grundläggande information</h3>
        <div className="space-y-3">
          <div className="border-b border-gray-200 pb-2">
            <span className="font-semibold text-gray-900 text-xs block">Bidragsbelopp</span>
            <span className="text-gray-700 text-sm">{grant.fundingAmount}</span>
          </div>
          <div className="border-b border-gray-200 pb-2">
            <span className="font-semibold text-gray-900 text-xs block">Ansökningsdeadline</span>
            <span className="text-gray-700 text-sm">{grant.deadline}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-900 text-xs block">Organisation</span>
            <span className="text-gray-700 text-sm">{grant.organization}</span>
          </div>
        </div>
      </section>

      {/* Important Dates */}
      {grant.importantDates.length > 0 && (
        <section className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-bold text-blue-900 mb-3 text-sm">📅 Viktiga datum</h3>
          <ul className="space-y-2">
            {grant.importantDates.map((date, index) => (
              <li key={index} className="flex items-start gap-2 text-blue-800">
                <span className="text-blue-600 font-bold">•</span>
                <span className="text-xs">{date}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Eligibility & Requirements */}
      <section className="bg-amber-50 p-4 rounded-lg">
        <h3 className="font-bold text-amber-900 mb-3 text-sm">✅ Behörighet och krav</h3>
        <div className="space-y-3">
          <div>
            <span className="font-semibold text-amber-900 text-xs block mb-1">Vem kan ansöka:</span>
            <span className="text-amber-800 text-xs leading-relaxed">{grant.qualifications}</span>
          </div>
          {grant.requirements.length > 0 && (
            <div>
              <span className="font-semibold text-amber-900 text-xs block mb-2">Specifika krav:</span>
              <ul className="space-y-1">
                {grant.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold text-xs">•</span>
                    <span className="text-amber-800 text-xs">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Templates and Documents */}
      {(grant.templates.length > 0 || grant.generalInfo.length > 0) && (
        <section className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-bold text-green-900 mb-3 text-sm">📋 Dokument och mallar</h3>
          <div className="space-y-2">
            {grant.templates.map((template, index) => (
              <div 
                key={index} 
                className="text-green-700 hover:text-green-900 cursor-pointer underline text-xs break-all hover:bg-green-100 p-2 rounded transition-colors border border-green-200"
                onClick={() => handleLinkClick(template)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleLinkClick(template);
                  }
                }}
                title="Klicka för att få mer information om denna mall"
              >
                📄 <span className="font-medium">Mall:</span> {template}
              </div>
            ))}
            {grant.generalInfo.map((file, index) => (
              <div 
                key={`file-${index}`} 
                className="text-green-700 hover:text-green-900 cursor-pointer underline text-xs break-all hover:bg-green-100 p-2 rounded transition-colors border border-green-200"
                onClick={() => handleLinkClick(file)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleLinkClick(file);
                  }
                }}
                title="Klicka för att få mer information om detta dokument"
              >
                📊 <span className="font-medium">Dokument:</span> {file}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact Information */}
      <section className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
        <h3 className="font-bold text-gray-900 mb-3 text-sm">📞 Kontaktinformation</h3>
        <div className="space-y-2">
          {grant.contact.name && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 text-xs">👤</span>
              <span className="font-medium text-gray-900 text-xs">{grant.contact.name}</span>
            </div>
          )}
          {grant.contact.organization && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 text-xs">🏢</span>
              <span className="text-gray-700 text-xs">{grant.contact.organization}</span>
            </div>
          )}
          {grant.contact.email && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 text-xs">✉️</span>
              <a 
                href={`mailto:${grant.contact.email}`}
                className="text-blue-600 underline hover:text-blue-800 text-xs break-all"
              >
                {grant.contact.email}
              </a>
            </div>
          )}
          {grant.contact.phone && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 text-xs">📱</span>
              <a 
                href={`tel:${grant.contact.phone}`}
                className="text-blue-600 underline hover:text-blue-800 text-xs"
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
