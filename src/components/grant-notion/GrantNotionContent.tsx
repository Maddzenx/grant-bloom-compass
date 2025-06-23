
import React from "react";
import { ChevronDown, FileText } from "lucide-react";
import { Grant } from "@/types/grant";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface GrantNotionContentProps {
  grant: Grant;
  isMobile?: boolean;
}

const GrantNotionContent = ({ grant, isMobile = false }: GrantNotionContentProps) => {
  const handleFileClick = (fileName: string) => {
    console.log('Clicking on file:', fileName);
    
    const urlMatch = fileName.match(/https?:\/\/[^\s]+/);
    if (urlMatch) {
      window.open(urlMatch[0], '_blank', 'noopener,noreferrer');
      return;
    }
    
    const possibleUrl = fileName.trim();
    if (possibleUrl.includes('.') && !possibleUrl.includes(' ') && possibleUrl.length < 100) {
      window.open(`https://${possibleUrl}`, '_blank', 'noopener,noreferrer');
      return;
    }
    
    alert(`Detta verkar vara en referens till en fil: "${fileName}". Kontakta organisationen för att få tillgång till filen.`);
  };

  return (
    <div className="space-y-6">
      {/* Utvärderingskriterier */}
      {grant.evaluationCriteria && (
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center gap-2 w-full text-left group">
            <ChevronDown className="w-3 h-3 text-gray-400 transition-transform group-data-[state=closed]:rotate-[-90deg]" />
            <span className="text-base font-semibold text-gray-900">Utvärderingskriterier</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 ml-5">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 leading-relaxed">
                {grant.evaluationCriteria}
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Ansökningsprocess */}
      {grant.applicationProcess && (
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center gap-2 w-full text-left group">
            <ChevronDown className="w-3 h-3 text-gray-400 transition-transform group-data-[state=closed]:rotate-[-90deg]" />
            <span className="text-base font-semibold text-gray-900">Ansökningsprocess</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 ml-5">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 leading-relaxed">
                {grant.applicationProcess}
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Mallar och dokument */}
      {(grant.templates.length > 0 || grant.generalInfo.length > 0) && (
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center gap-2 w-full text-left group">
            <ChevronDown className="w-3 h-3 text-gray-400 transition-transform group-data-[state=closed]:rotate-[-90deg]" />
            <span className="text-base font-semibold text-gray-900">Mallar och dokument</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 ml-5">
            <div className="space-y-4">
              {/* Ansökningsmallar */}
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
                        <ChevronDown className="w-3 h-3 text-gray-400 rotate-[-90deg]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Allmän information och dokument */}
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
                        <ChevronDown className="w-3 h-3 text-gray-400 rotate-[-90deg]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Finansieringsregler */}
      {grant.fundingRules.length > 0 && (
        <Collapsible>
          <CollapsibleTrigger className="flex items-center gap-2 w-full text-left group">
            <ChevronDown className="w-3 h-3 text-gray-400 transition-transform group-data-[state=closed]:rotate-[-90deg]" />
            <span className="text-base font-semibold text-gray-900">Finansieringsregler</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 ml-5">
            <div className="space-y-2">
              {grant.fundingRules.map((rule, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-3 h-3 bg-gray-200 rounded-full mt-0.5 flex-shrink-0"></div>
                  <span className="text-xs text-gray-700 leading-relaxed">{rule}</span>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Ytterligare information */}
      {grant.qualifications && (
        <Collapsible>
          <CollapsibleTrigger className="flex items-center gap-2 w-full text-left group">
            <ChevronDown className="w-3 h-3 text-gray-400 transition-transform group-data-[state=closed]:rotate-[-90deg]" />
            <span className="text-base font-semibold text-gray-900">Ytterligare information</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 ml-5">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 leading-relaxed">
                {grant.qualifications}
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Contact section in sidebar style */}
      <div className="mt-10 pt-6 border-t border-gray-200">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Kontakt</h3>
          <div className="space-y-2">
            {grant.contact.name && (
              <div>
                <span className="text-xs text-gray-600 block">{grant.contact.organization || grant.organization}</span>
                <span className="text-xs font-medium text-gray-900">{grant.contact.name}</span>
              </div>
            )}
            {grant.contact.email && (
              <div>
                <a 
                  href={`mailto:${grant.contact.email}`}
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  {grant.contact.email}
                </a>
              </div>
            )}
            {grant.contact.phone && (
              <div>
                <a 
                  href={`tel:${grant.contact.phone}`}
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  {grant.contact.phone}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrantNotionContent;
