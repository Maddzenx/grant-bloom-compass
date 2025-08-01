import React from "react";
import { Grant } from "@/types/grant";
import { FileText, Download } from "lucide-react";

interface GrantTemplatesSectionProps {
  grant: Grant;
  isMobile?: boolean;
}

const GrantTemplatesSection = ({ grant, isMobile = false }: GrantTemplatesSectionProps) => {
  const titleClass = isMobile ? 'text-lg' : 'text-xl';
  const textClass = isMobile ? 'text-sm' : 'text-sm';

  const handleFileClick = (fileName: string) => {
    console.log('Clicking on file:', fileName);
    
    // Check if the text contains a direct URL (http/https)
    const urlMatch = fileName.match(/https?:\/\/[^\s]+/);
    if (urlMatch) {
      console.log('Found direct URL:', urlMatch[0]);
      window.open(urlMatch[0], '_blank', 'noopener,noreferrer');
      return;
    }
    
    // Check if it looks like a domain without protocol
    const possibleUrl = fileName.trim();
    if (possibleUrl.includes('.') && !possibleUrl.includes(' ') && possibleUrl.length < 100 && (possibleUrl.includes('.se') || possibleUrl.includes('.com') || possibleUrl.includes('.org') || possibleUrl.includes('.net') || possibleUrl.includes('.gov'))) {
      console.log('Treating as domain:', possibleUrl);
      window.open(`https://${possibleUrl}`, '_blank', 'noopener,noreferrer');
      return;
    }
    
    // Check if it's a downloadable file by extension
    const downloadableExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip', '.rar', '.txt', '.csv'];
    const hasDownloadableExtension = downloadableExtensions.some(ext => fileName.toLowerCase().includes(ext));
    
    if (hasDownloadableExtension) {
      // Try to construct a direct download URL or search for it
      const searchTerm = encodeURIComponent(fileName);
      const searchUrl = `https://www.google.com/search?q=${searchTerm}+filetype:${fileName.split('.').pop()?.toLowerCase() || 'pdf'}+site:vinnova.se`;
      console.log('Searching for downloadable file:', searchUrl);
      window.open(searchUrl, '_blank', 'noopener,noreferrer');
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

  const hasTemplates = grant.templates.length > 0;
  const hasGeneralInfo = grant.generalInfo.length > 0;
  const hasOtherSources = grant.other_sources_names && grant.other_sources_names.length > 0;

  if (!hasTemplates && !hasGeneralInfo && !hasOtherSources) return null;

  return (
            <section className="p-4 md:p-6 rounded-lg border-2" style={{ backgroundColor: '#FAF5FF', borderColor: '#D7CFFC' }}>
      <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <FileText className="w-5 h-5" style={{ color: '#8B5CF6' }} />
                  <h2 className={`font-bold ${titleClass}`} style={{ color: '#8B5CF6' }}>
          Mallar och dokument
        </h2>
      </div>
      <div className="space-y-3">
        {/* Allmän information och dokument - now first, combining both generalInfo and other_sources_names */}
        {(hasGeneralInfo || hasOtherSources) && (
          <div>
            <h3 className={`font-semibold mb-2 ${isMobile ? 'text-sm' : 'text-base'}`} style={{ color: '#8B5CF6' }}>
              Allmän information och dokument
            </h3>
            <div className="grid gap-2">
              {/* General info files */}
              {grant.generalInfo.map((file, index) => (
                <div 
                  key={`general-${index}`}
                  className="bg-white p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md group"
                  style={{ borderColor: '#D7CFFC' }}
                  onClick={() => handleFileClick(file)}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4" style={{ color: '#8B5CF6' }} />
                    <span className={`${textClass} flex-1`} style={{ color: '#8B5CF6' }}>
                      {file}
                    </span>
                    <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#8B5CF6' }}>
                      Klicka för mer info
                    </span>
                  </div>
                </div>
              ))}
              
              {/* Other sources */}
              {grant.other_sources_names && grant.other_sources_names.map((source, index) => (
                <div 
                  key={`source-${index}`}
                  className="bg-white p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md group"
                  style={{ borderColor: '#D7CFFC' }}
                  onClick={() => handleFileClick(source)}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4" style={{ color: '#8B5CF6' }} />
                    <span className={`${textClass} flex-1`} style={{ color: '#8B5CF6' }}>
                      {source}
                    </span>
                    <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#8B5CF6' }}>
                      Klicka för mer info
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Ansökningsmallar - now second */}
        {hasTemplates && (
          <div>
            <h3 className={`font-semibold mb-2 ${isMobile ? 'text-sm' : 'text-base'}`} style={{ color: '#8B5CF6' }}>
              Ansökningsmallar
            </h3>
            <div className="grid gap-2">
              {grant.templates.map((template, index) => (
                <div 
                  key={index}
                  className="bg-white p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md group"
                  style={{ borderColor: '#D7CFFC' }}
                  onClick={() => handleFileClick(template)}
                >
                  <div className="flex items-center gap-3">
                    <Download className="w-4 h-4" style={{ color: '#8B5CF6' }} />
                    <span className={`${textClass} flex-1`} style={{ color: '#8B5CF6' }}>
                      {template}
                    </span>
                    <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#8B5CF6' }}>
                      Klicka för att ladda ner
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GrantTemplatesSection;
