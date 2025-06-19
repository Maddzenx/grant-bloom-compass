
import React from "react";
import { Grant } from "@/types/grant";

interface GrantSidebarProps {
  grant: Grant;
}

const GrantSidebar = ({ grant }: GrantSidebarProps) => {
  const formatCurrency = (amount: string) => {
    // Extract numbers from the funding amount string
    const numbers = amount.match(/[\d\s]+/g);
    if (numbers) {
      return numbers.join(' - ') + ' SEK';
    }
    return amount;
  };

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
      // These seem to be references to handbooks or templates
      // For now, we'll search for them on the organization's website or show an info message
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
      <section className="bg-gray-50 p-4 rounded-lg px-[5px] py-[16px]">
        <h3 className="font-bold text-gray-900 mb-3 text-sm">Allmän information</h3>
        <div className="space-y-2">
          <div>
            <span className="font-semibold text-gray-900 text-xs">• Bidrag:</span>
            <span className="text-gray-700 ml-1 text-xs">{grant.fundingAmount}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-900 text-xs">• Deadline:</span>
            <span className="text-gray-700 ml-1 text-xs">{grant.deadline}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-900 text-xs">• Organisation:</span>
            <span className="text-gray-700 ml-1 text-xs">{grant.organization}</span>
          </div>
        </div>
      </section>

      {grant.importantDates.length > 0 && (
        <section className="bg-gray-50 p-4 rounded-lg px-[5px] py-[16px]">
          <h3 className="font-bold text-gray-900 mb-3 text-sm">Viktiga datum</h3>
          <ul className="space-y-2">
            {grant.importantDates.map((date, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700">
                <span className="font-semibold">•</span>
                <span className="text-xs">{date}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {grant.requirements.length > 0 && (
        <section className="bg-gray-50 p-4 rounded-lg px-[5px] py-[16px]">
          <h3 className="font-bold text-gray-900 mb-3 text-sm">Krav</h3>
          <div className="space-y-2">
            {grant.requirements.map((requirement, index) => (
              <div key={index}>
                <span className="font-semibold text-gray-900 text-xs">• {requirement}:</span>
              </div>
            ))}
            <div>
              <span className="font-semibold text-gray-900 text-xs">• Kvalifikationer:</span>
              <span className="text-gray-700 ml-1 text-xs">{grant.qualifications}</span>
            </div>
          </div>
        </section>
      )}

      {(grant.templates.length > 0 || grant.generalInfo.length > 0) && (
        <section className="bg-gray-50 p-4 rounded-lg px-[5px] py-[16px]">
          <h3 className="font-bold text-gray-900 mb-3 text-sm">Mallar och filer</h3>
          <div className="space-y-2">
            {grant.templates.map((template, index) => (
              <div 
                key={index} 
                className="text-blue-600 hover:text-blue-800 cursor-pointer underline text-xs break-all hover:bg-blue-50 p-1 rounded transition-colors"
                onClick={() => handleLinkClick(template)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleLinkClick(template);
                  }
                }}
                title="Klicka för att få mer information om denna fil"
              >
                📄 {template}
              </div>
            ))}
            {grant.generalInfo.map((file, index) => (
              <div 
                key={`file-${index}`} 
                className="text-blue-600 hover:text-blue-800 cursor-pointer underline text-xs break-all hover:bg-blue-50 p-1 rounded transition-colors"
                onClick={() => handleLinkClick(file)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleLinkClick(file);
                  }
                }}
                title="Klicka för att få mer information om denna fil"
              >
                📋 {file}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="bg-gray-50 p-4 rounded-lg px-[5px] py-[16px]">
        <h3 className="font-bold text-gray-900 mb-3 text-sm">Kontakt</h3>
        <div className="space-y-1">
          {grant.contact.name && (
            <div className="font-semibold text-gray-900 text-xs">{grant.contact.name}</div>
          )}
          {grant.contact.organization && (
            <div className="text-gray-700 text-xs">{grant.contact.organization}</div>
          )}
          {grant.contact.email && (
            <div className="text-blue-600 underline cursor-pointer text-xs break-all">
              <a href={`mailto:${grant.contact.email}`}>{grant.contact.email}</a>
            </div>
          )}
          {grant.contact.phone && (
            <div className="text-gray-700 text-xs">
              <a href={`tel:${grant.contact.phone}`}>{grant.contact.phone}</a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default GrantSidebar;
