
import React from "react";
import { ExternalLink } from "lucide-react";
import { Grant } from "@/types/grant";

interface GrantNotionAdditionalInfoSectionProps {
  grant: Grant;
}

const GrantNotionAdditionalInfoSection = ({ grant }: GrantNotionAdditionalInfoSectionProps) => {
  if (!grant.qualifications && !grant.originalUrl) return null;

  return (
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
  );
};

export default GrantNotionAdditionalInfoSection;
