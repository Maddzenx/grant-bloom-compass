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

  if (grant.templates.length === 0 && grant.generalInfo.length === 0) return null;

  return (
    <section className="bg-purple-50 p-4 md:p-6 rounded-lg border-2 border-purple-200">
      <div className="flex items-center gap-2 mb-3 md:mb-4">
        <FileText className="w-5 h-5 text-purple-600" />
        <h2 className={`font-bold text-purple-900 ${titleClass}`}>
          Mallar och dokument
        </h2>
      </div>
      <div className="space-y-3">
        {grant.templates.length > 0 && (
          <div>
            <h3 className={`font-semibold text-purple-800 mb-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
              Ansökningsmallar
            </h3>
            <div className="grid gap-2">
              {grant.templates.map((template, index) => (
                <div 
                  key={index}
                  className="bg-white p-3 rounded-lg border border-purple-200 hover:border-purple-400 cursor-pointer transition-all hover:shadow-md group"
                  onClick={() => handleFileClick(template)}
                >
                  <div className="flex items-center gap-3">
                    <Download className="w-4 h-4 text-purple-600 group-hover:text-purple-800" />
                    <span className={`text-purple-700 group-hover:text-purple-900 ${textClass} flex-1`}>
                      {template}
                    </span>
                    <span className="text-xs text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      Klicka för att ladda ner
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {grant.generalInfo.length > 0 && (
          <div>
            <h3 className={`font-semibold text-purple-800 mb-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
              Allmän information och dokument
            </h3>
            <div className="grid gap-2">
              {grant.generalInfo.map((file, index) => (
                <div 
                  key={index}
                  className="bg-white p-3 rounded-lg border border-purple-200 hover:border-purple-400 cursor-pointer transition-all hover:shadow-md group"
                  onClick={() => handleFileClick(file)}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-purple-600 group-hover:text-purple-800" />
                    <span className={`text-purple-700 group-hover:text-purple-900 ${textClass} flex-1`}>
                      {file}
                    </span>
                    <span className="text-xs text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      Klicka för mer info
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
