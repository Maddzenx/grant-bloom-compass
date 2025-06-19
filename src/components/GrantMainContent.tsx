
import React from "react";
import { Grant } from "@/types/grant";

interface GrantMainContentProps {
  grant: Grant;
}

const GrantMainContent = ({ grant }: GrantMainContentProps) => {
  return (
    <div className="space-y-8">
      {/* Main Description */}
      <section>
        <h2 className="font-bold text-gray-900 mb-4 text-xl flex items-center gap-2">
          📝 Om detta bidrag
        </h2>
        <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
          <p className="text-gray-800 leading-relaxed text-sm mb-4">{grant.aboutGrant}</p>
          {grant.description !== grant.aboutGrant && (
            <p className="text-gray-700 leading-relaxed text-sm">{grant.description}</p>
          )}
        </div>
      </section>

      {/* Eligibility */}
      <section>
        <h2 className="font-bold text-gray-900 mb-4 text-xl flex items-center gap-2">
          🎯 Vem kan ansöka?
        </h2>
        <div className="bg-amber-50 p-6 rounded-lg border-l-4 border-amber-500">
          <p className="text-gray-800 leading-relaxed text-sm">{grant.whoCanApply}</p>
        </div>
      </section>

      {/* Funding Rules */}
      {grant.fundingRules.length > 0 && (
        <section>
          <h2 className="font-bold text-gray-900 mb-4 text-xl flex items-center gap-2">
            💰 Finansieringsregler
          </h2>
          <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
            <ul className="space-y-3">
              {grant.fundingRules.map((rule, index) => (
                <li key={index} className="text-sm flex items-start gap-3">
                  <span className="font-bold text-green-600 mt-1">✓</span>
                  <span className="text-gray-800 leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Keywords/Tags */}
      {grant.tags.length > 0 && (
        <section>
          <h2 className="font-bold text-gray-900 mb-4 text-xl flex items-center gap-2">
            🏷️ Nyckelord och kategorier
          </h2>
          <div className="flex flex-wrap gap-3">
            {grant.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center bg-gradient-to-r from-teal-50 to-blue-50 text-teal-800 px-4 py-2 rounded-full text-sm font-medium border border-teal-200 hover:from-teal-100 hover:to-blue-100 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Quick Summary Box */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
        <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
          📊 Sammanfattning
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <span className="text-xs text-gray-600 block mb-1">Bidragsbelopp</span>
            <span className="font-bold text-lg text-blue-600">{grant.fundingAmount}</span>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <span className="text-xs text-gray-600 block mb-1">Ansökningsdeadline</span>
            <span className="font-bold text-lg text-red-600">{grant.deadline}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GrantMainContent;
