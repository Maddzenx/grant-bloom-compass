
import React from 'react';
import { Grant } from '@/types/grant';
import { ApplicationDraft } from '@/hooks/useChatAgent';

interface ApplicationPreviewProps {
  draft: ApplicationDraft;
  grant: Grant;
}

export const ApplicationPreview = ({ draft, grant }: ApplicationPreviewProps) => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 bg-white m-4 rounded-lg shadow-sm border">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Ansökan för {grant.title}
          </h2>
          <p className="text-sm text-gray-600">{grant.organization}</p>
        </div>

        <div className="space-y-6">
          {Object.entries(draft.sections).map(([sectionKey, sectionContent]) => (
            <div key={sectionKey} className="border-b border-gray-200 pb-4 last:border-b-0">
              <h3 className="font-semibold text-gray-900 mb-3 capitalize">
                {sectionKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {sectionContent}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Ordantal: {draft.wordCount}</span>
            
          </div>
        </div>
      </div>
    </div>
  );
};
