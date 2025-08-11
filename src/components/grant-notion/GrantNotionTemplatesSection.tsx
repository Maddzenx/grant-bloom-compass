
import React from "react";
import { FileText, ExternalLink } from "lucide-react";
import { GrantDetails as GrantDetailsType } from "@/types/grant";

interface GrantNotionTemplatesSectionProps {
  grant: GrantDetailsType;
}

const GrantNotionTemplatesSection = ({ grant }: GrantNotionTemplatesSectionProps) => {
  const hasTemplates = grant.templates.length > 0;
  const hasGeneralInfo = grant.generalInfo.length > 0;
  const hasOtherSources = grant.other_sources_names && grant.other_sources_names.length > 0;
  
  if (!hasTemplates && !hasGeneralInfo && !hasOtherSources) return null;

  const handleTemplateClick = (templateName: string, templateIndex: number, templateLinks: string[]) => {
    const link = templateLinks[templateIndex];
    if (link) {
      // Check if it's a direct URL
      if (link.startsWith('http://') || link.startsWith('https://')) {
        window.open(link, '_blank', 'noopener,noreferrer');
      } else {
        // If it's not a full URL, try to construct one
        window.open(`https://${link}`, '_blank', 'noopener,noreferrer');
      }
    } else {
      // Fallback to the old file handler if no link is available
      console.log('No direct link available for template:', templateName);
    }
  };

  const handleGeneralInfoClick = (fileName: string, fileIndex: number, fileLinks: string[]) => {
    const link = fileLinks[fileIndex];
    if (link) {
      // Check if it's a direct URL
      if (link.startsWith('http://') || link.startsWith('https://')) {
        window.open(link, '_blank', 'noopener,noreferrer');
      } else {
        // If it's not a full URL, try to construct one
        window.open(`https://${link}`, '_blank', 'noopener,noreferrer');
      }
    } else {
      // Fallback to the old file handler if no link is available
      console.log('No direct link available for file:', fileName);
    }
  };

  const handleOtherSourcesClick = (sourceName: string, sourceIndex: number, sourceLinks: string[]) => {
    const link = sourceLinks[sourceIndex];
    if (link) {
      // Check if it's a direct URL
      if (link.startsWith('http://') || link.startsWith('https://')) {
        window.open(link, '_blank', 'noopener,noreferrer');
      } else {
        // If it's not a full URL, try to construct one
        window.open(`https://${link}`, '_blank', 'noopener,noreferrer');
      }
    } else {
      // Fallback to the old file handler if no link is available
      console.log('No direct link available for source:', sourceName);
    }
  };

  return (
    <div>
      <h3 className="type-title text-zinc-900 mb-4">Mallar och dokument</h3>
      <div className="space-y-4">
        {/* Allmän information och dokument - now first, combining both generalInfo and other_sources_names */}
        {(hasGeneralInfo || hasOtherSources) && (
          <div>
            <h4 className="type-secondary font-medium text-zinc-900 mb-2">Allmän information och dokument</h4>
            <div className="space-y-1">
              {/* General info files */}
              {grant.generalInfo.map((file, index) => (
                <div
                  key={`general-${index}`}
                  className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleGeneralInfoClick(file, index, grant.other_templates_links || [])}
                >
                  <FileText className="w-3 h-3 text-gray-400" />
                  <span className="type-caption text-zinc-700 flex-1">{file}</span>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </div>
              ))}
              
              {/* Other sources */}
              {grant.other_sources_names && grant.other_sources_names.map((source, index) => (
                <div
                  key={`source-${index}`}
                  className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleOtherSourcesClick(source, index, grant.other_sources_links || [])}
                >
                  <FileText className="w-3 h-3 text-gray-400" />
                  <span className="type-caption text-zinc-700 flex-1">{source}</span>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ansökningsmallar - now second */}
        {hasTemplates && (
          <div>
            <h4 className="type-secondary font-medium text-zinc-900 mb-2">Ansökningsmallar</h4>
            <div className="space-y-1">
              {grant.templates.map((template, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleTemplateClick(template, index, grant.application_templates_links || [])}
                >
                  <FileText className="w-3 h-3 text-gray-400" />
                  <span className="type-caption text-zinc-700 flex-1">{template}</span>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrantNotionTemplatesSection;
