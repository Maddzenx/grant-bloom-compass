import React from "react";
import { FileText, ExternalLink } from "lucide-react";
import { Grant } from "@/types/grant";

interface GrantNotionContentProps {
  grant: Grant;
  isMobile?: boolean;
}

const GrantNotionContent = ({
  grant,
  isMobile = false
}: GrantNotionContentProps) => {
  const handleFileClick = (fileName: string) => {
    console.log('Clicking on file:', fileName);
    
    // Check if the text contains a direct URL (http/https)
    const urlMatch = fileName.match(/https?:\/\/[^\s]+/);
    if (urlMatch) {
      console.log('Found direct URL:', urlMatch[0]);
      // For direct URLs, try to download if it's a file, otherwise open
      const url = urlMatch[0];
      const downloadableExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip', '.rar', '.txt', '.csv'];
      const hasDownloadableExtension = downloadableExtensions.some(ext => url.toLowerCase().includes(ext));
      
      if (hasDownloadableExtension) {
        // Create a temporary link to trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName.split('/').pop() || 'document';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
      return;
    }
    
    // Check if it looks like a domain without protocol
    const possibleUrl = fileName.trim();
    if (possibleUrl.includes('.') && !possibleUrl.includes(' ') && possibleUrl.length < 100 && (possibleUrl.includes('.se') || possibleUrl.includes('.com') || possibleUrl.includes('.org') || possibleUrl.includes('.net') || possibleUrl.includes('.gov'))) {
      console.log('Treating as domain:', possibleUrl);
      window.open(`https://${possibleUrl}`, '_blank', 'noopener,noreferrer');
      return;
    }
    
    // Check if it's a downloadable file by extension - try direct download first
    const downloadableExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip', '.rar', '.txt', '.csv'];
    const hasDownloadableExtension = downloadableExtensions.some(ext => fileName.toLowerCase().includes(ext));
    
    if (hasDownloadableExtension) {
      // Try to construct potential direct download URLs from common Swedish grant organizations
      const potentialUrls = [
        `https://www.vinnova.se/contentassets/${fileName}`,
        `https://www.vinnova.se/globalassets/${fileName}`,
        `https://www.vinnova.se/upload/${fileName}`,
        `https://www.energimyndigheten.se/contentassets/${fileName}`,
        `https://www.tillvaxtverket.se/download/${fileName}`,
        `https://www.formas.se/contentassets/${fileName}`
      ];
      
      // Try each potential URL
      let downloadAttempted = false;
      for (const url of potentialUrls) {
        try {
          // Create a temporary link to trigger download
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          downloadAttempted = true;
          console.log('Attempted download from:', url);
          break;
        } catch (error) {
          console.log('Failed to download from:', url);
          continue;
        }
      }
      
      // If direct download attempts fail, fall back to search
      if (!downloadAttempted) {
        const searchTerm = encodeURIComponent(fileName);
        const searchUrl = `https://www.google.com/search?q=${searchTerm}+filetype:${fileName.split('.').pop()?.toLowerCase() || 'pdf'}+site:vinnova.se`;
        console.log('Fallback: Searching for downloadable file:', searchUrl);
        window.open(searchUrl, '_blank', 'noopener,noreferrer');
      }
      return;
    }
    
    // Check for document-related keywords that should trigger a search
    const documentKeywords = ['beslutslista', 'mall', 'dokument', 'rules', 'villkor', 'intyg', 'formulär', 'ansökan', 'template', 'form', 'application', 'guidelines', 'regler', 'instruktion', 'manual', 'handbok', 'guide'];
    const containsDocumentKeyword = documentKeywords.some(keyword => fileName.toLowerCase().includes(keyword.toLowerCase()));
    
    if (containsDocumentKeyword) {
      // Try to search for the document on the organization's website
      const searchTerm = encodeURIComponent(fileName);
      const searchUrl = `https://www.google.com/search?q=${searchTerm}+site:vinnova.se`;
      console.log('Searching for document:', searchUrl);
      window.open(searchUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    
    // If nothing else matches, try a general search for the term
    const searchTerm = encodeURIComponent(fileName);
    const generalSearchUrl = `https://www.google.com/search?q=${searchTerm}+vinnova`;
    console.log('Performing general search:', generalSearchUrl);
    window.open(generalSearchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-8">
      {/* Utvärderingskriterier - only show if exists */}
      {grant.evaluationCriteria && (
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Utvärderingskriterier</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700 leading-relaxed">
              {grant.evaluationCriteria}
            </p>
          </div>
        </div>
      )}

      {/* Ansökningsprocess - only show if exists */}
      {grant.applicationProcess && (
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Ansökningsprocess</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700 leading-relaxed">
              {grant.applicationProcess}
            </p>
          </div>
        </div>
      )}

      {/* Mallar och dokument - only show if templates or generalInfo exist */}
      {(grant.templates.length > 0 || grant.generalInfo.length > 0) && (
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Mallar och dokument</h3>
          <div className="space-y-4">
            {grant.templates.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Ansökningsmallar</h4>
                <div className="space-y-1">
                  {grant.templates.map((template, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleFileClick(template)}
                    >
                      <FileText className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-700 flex-1">{template}</span>
                      <ExternalLink className="w-3 h-3 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {grant.generalInfo.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Allmän information och dokument</h4>
                <div className="space-y-1">
                  {grant.generalInfo.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleFileClick(file)}
                    >
                      <FileText className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-700 flex-1">{file}</span>
                      <ExternalLink className="w-3 h-3 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Finansieringsregler - only show if exists */}
      {grant.fundingRules.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Finansieringsregler</h3>
          <div className="space-y-2">
            {grant.fundingRules.map((rule, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-3 h-3 bg-gray-200 rounded-full mt-0.5 flex-shrink-0"></div>
                <span className="text-xs text-gray-700 leading-relaxed">{rule}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ytterligare information - only show if qualifications or originalUrl exist */}
      {(grant.qualifications || grant.originalUrl) && (
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Ytterligare information</h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            {grant.qualifications && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Kvalifikationer</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {grant.qualifications}
                </p>
              </div>
            )}
            
            {grant.originalUrl && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Läs mer om utlysningen här</h4>
                <a
                  href={grant.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 underline break-all"
                >
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  {grant.originalUrl}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contact section - only show if contact info exists */}
      {(grant.contact.name || grant.contact.email || grant.contact.phone || grant.contact.organization) && (
        <div className="pt-6 border-t border-gray-200">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Kontakt</h3>
            <div className="space-y-2">
              {(grant.contact.name || grant.contact.organization) && (
                <div>
                  {grant.contact.organization && (
                    <span className="text-xs text-gray-600 block">{grant.contact.organization}</span>
                  )}
                  {grant.contact.name && (
                    <span className="text-xs font-medium text-gray-900">{grant.contact.name}</span>
                  )}
                </div>
              )}
              {grant.contact.email && (
                <div>
                  <a href={`mailto:${grant.contact.email}`} className="text-xs text-blue-600 hover:text-blue-800 underline">
                    {grant.contact.email}
                  </a>
                </div>
              )}
              {grant.contact.phone && (
                <div>
                  <a href={`tel:${grant.contact.phone}`} className="text-xs text-blue-600 hover:text-blue-800 underline">
                    {grant.contact.phone}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrantNotionContent;
