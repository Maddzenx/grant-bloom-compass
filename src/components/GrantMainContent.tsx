
import React from "react";
import { Grant } from "@/types/grant";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { FileText, Download, CheckCircle, ClipboardList } from "lucide-react";

interface GrantMainContentProps {
  grant: Grant;
  isMobile?: boolean;
}

const GrantMainContent = ({
  grant,
  isMobile = false
}: GrantMainContentProps) => {
  const spacingClass = isMobile ? 'space-y-6' : 'space-y-8';
  const titleClass = isMobile ? 'text-lg' : 'text-xl';
  const textClass = isMobile ? 'text-sm' : 'text-sm';

  const handleFileClick = (fileName: string) => {
    console.log('Clicking on file:', fileName);
    
    // Check if the text contains a direct URL
    const urlMatch = fileName.match(/https?:\/\/[^\s]+/);
    if (urlMatch) {
      console.log('Found direct URL:', urlMatch[0]);
      window.open(urlMatch[0], '_blank', 'noopener,noreferrer');
      return;
    }
    
    // Check if it looks like a domain without protocol
    const possibleUrl = fileName.trim();
    if (possibleUrl.includes('.') && !possibleUrl.includes(' ') && possibleUrl.length < 100) {
      console.log('Treating as domain:', possibleUrl);
      window.open(`https://${possibleUrl}`, '_blank', 'noopener,noreferrer');
      return;
    }
    
    // For file names or descriptions, show helpful message
    alert(`Detta verkar vara en referens till en fil: "${fileName}". Kontakta organisationen för att få tillgång till filen.`);
  };

  return (
    <div className={spacingClass}>
      {/* Main Description */}
      <section>
        <h2 className={`font-bold text-gray-900 mb-3 md:mb-4 ${titleClass}`}>
          Om detta bidrag
        </h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className={`text-gray-800 leading-relaxed ${textClass} mb-3 md:mb-4`}>{grant.aboutGrant}</p>
          {grant.description !== grant.aboutGrant && (
            <p className={`text-gray-700 leading-relaxed ${textClass}`}>{grant.description}</p>
          )}
        </div>
      </section>

      {/* Eligibility */}
      <section>
        <h2 className={`font-bold text-gray-900 mb-3 md:mb-4 ${titleClass}`}>
          Vem kan ansöka?
        </h2>
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <p className={`text-gray-800 leading-relaxed ${textClass}`}>{grant.whoCanApply}</p>
        </div>
      </section>

      {/* Evaluation Criteria - Prominent Display */}
      {grant.evaluationCriteria && (
        <section className="bg-yellow-50 p-4 md:p-6 rounded-lg border-2 border-yellow-200">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <CheckCircle className="w-5 h-5 text-yellow-600" />
            <h2 className={`font-bold text-yellow-900 ${titleClass}`}>
              Utvärderingskriterier
            </h2>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className={`text-gray-800 leading-relaxed ${textClass}`}>{grant.evaluationCriteria}</p>
          </div>
        </section>
      )}

      {/* Application Process - Prominent Display */}
      {grant.applicationProcess && (
        <section className="bg-green-50 p-4 md:p-6 rounded-lg border-2 border-green-200">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <ClipboardList className="w-5 h-5 text-green-600" />
            <h2 className={`font-bold text-green-900 ${titleClass}`}>
              Ansökningsprocess
            </h2>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className={`text-gray-800 leading-relaxed ${textClass}`}>{grant.applicationProcess}</p>
          </div>
        </section>
      )}

      {/* Templates and Files - Enhanced Display */}
      {(grant.templates.length > 0 || grant.generalInfo.length > 0) && (
        <section className="bg-purple-50 p-4 md:p-6 rounded-lg border-2 border-purple-200">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <FileText className="w-5 h-5 text-purple-600" />
            <h2 className={`font-bold text-purple-900 ${titleClass}`}>
              Mallar och dokument att ladda ner
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
      )}

      {/* Funding Rules */}
      {grant.fundingRules.length > 0 && (
        <section>
          <h2 className={`font-bold text-gray-900 mb-3 md:mb-4 ${titleClass}`}>
            Finansieringsregler
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ul className="space-y-2 md:space-y-3">
              {grant.fundingRules.map((rule, index) => (
                <li key={index} className={`${textClass} flex items-start gap-3`}>
                  <span className="font-bold text-green-600 mt-1 flex-shrink-0">✓</span>
                  <span className="text-gray-800 leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Additional Information - Collapsible */}
      <Accordion type="single" collapsible className="bg-white rounded-lg border">
        <AccordionItem value="additional-info">
          <AccordionTrigger className="px-4 hover:no-underline">
            <span className={`font-semibold text-gray-900 ${titleClass}`}>
              Ytterligare information
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              {grant.qualifications && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Kvalifikationer</h4>
                  <p className={`text-gray-700 ${textClass}`}>{grant.qualifications}</p>
                </div>
              )}
              
              {grant.requirements.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Specifika krav</h4>
                  <ul className="space-y-1">
                    {grant.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold text-sm flex-shrink-0">•</span>
                        <span className={`text-gray-700 ${textClass}`}>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default GrantMainContent;
