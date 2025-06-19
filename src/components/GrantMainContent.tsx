
import React from "react";
import { Grant } from "@/types/grant";

interface GrantMainContentProps {
  grant: Grant;
}

const GrantMainContent = ({ grant }: GrantMainContentProps) => {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-bold text-gray-900 mb-4 text-lg">Om detta bidrag</h2>
        <div className="text-gray-700 leading-relaxed">
          <p className="text-sm mb-4">{grant.aboutGrant}</p>
          {grant.description !== grant.aboutGrant && (
            <p className="text-sm">{grant.description}</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="font-bold text-gray-900 mb-4 text-lg">Vem kan ansöka?</h2>
        <div className="text-gray-700 leading-relaxed">
          <p className="text-sm">{grant.whoCanApply}</p>
        </div>
      </section>

      {grant.fundingRules.length > 0 && (
        <section>
          <h2 className="font-bold text-gray-900 mb-4 text-lg">Finansieringsregler</h2>
          <div className="text-gray-700 leading-relaxed">
            <ul className="space-y-2">
              {grant.fundingRules.map((rule, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="font-semibold">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {grant.tags.length > 0 && (
        <section>
          <h2 className="font-bold text-gray-900 mb-4 text-lg">Nyckelord</h2>
          <div className="flex flex-wrap gap-2">
            {grant.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default GrantMainContent;
