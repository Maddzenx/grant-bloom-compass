
import React from "react";
import { Grant } from "@/types/grant";

interface GrantSidebarProps {
  grant: Grant;
}

const GrantSidebar = ({ grant }: GrantSidebarProps) => {
  const formatCurrency = (amount: string) => {
    // Extract numbers from the funding amount string
    const numbers = amount.match(/[\d\s]+/g);
    if (numbers) {
      return numbers.join(' - ') + ' SEK';
    }
    return amount;
  };

  return (
    <div className="space-y-6">
      <section className="bg-gray-50 p-4 rounded-lg px-[5px] py-[16px]">
        <h3 className="font-bold text-gray-900 mb-3 text-sm">Allmän information</h3>
        <div className="space-y-2">
          <div>
            <span className="font-semibold text-gray-900 text-xs">• Bidrag:</span>
            <span className="text-gray-700 ml-1 text-xs">{grant.fundingAmount}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-900 text-xs">• Deadline:</span>
            <span className="text-gray-700 ml-1 text-xs">{grant.deadline}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-900 text-xs">• Organisation:</span>
            <span className="text-gray-700 ml-1 text-xs">{grant.organization}</span>
          </div>
        </div>
      </section>

      {grant.importantDates.length > 0 && (
        <section className="bg-gray-50 p-4 rounded-lg px-[5px] py-[16px]">
          <h3 className="font-bold text-gray-900 mb-3 text-sm">Viktiga datum</h3>
          <ul className="space-y-2">
            {grant.importantDates.map((date, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700">
                <span className="font-semibold">•</span>
                <span className="text-xs">{date}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {grant.requirements.length > 0 && (
        <section className="bg-gray-50 p-4 rounded-lg px-[5px] py-[16px]">
          <h3 className="font-bold text-gray-900 mb-3 text-sm">Krav</h3>
          <div className="space-y-2">
            {grant.requirements.map((requirement, index) => (
              <div key={index}>
                <span className="font-semibold text-gray-900 text-xs">• {requirement}:</span>
              </div>
            ))}
            <div>
              <span className="font-semibold text-gray-900 text-xs">• Kvalifikationer:</span>
              <span className="text-gray-700 ml-1 text-xs">{grant.qualifications}</span>
            </div>
          </div>
        </section>
      )}

      {grant.templates.length > 0 && (
        <section className="bg-gray-50 p-4 rounded-lg px-[5px] py-[16px]">
          <h3 className="font-bold text-gray-900 mb-3 text-sm">Mallar och filer</h3>
          <div className="space-y-2">
            {grant.templates.map((template, index) => (
              <div key={index} className="text-blue-600 hover:text-blue-800 cursor-pointer underline text-xs break-all">
                {template}
              </div>
            ))}
            {grant.generalInfo.map((file, index) => (
              <div key={`file-${index}`} className="text-blue-600 hover:text-blue-800 cursor-pointer underline text-xs break-all">
                {file}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="bg-gray-50 p-4 rounded-lg px-[5px] py-[16px]">
        <h3 className="font-bold text-gray-900 mb-3 text-sm">Kontakt</h3>
        <div className="space-y-1">
          {grant.contact.name && (
            <div className="font-semibold text-gray-900 text-xs">{grant.contact.name}</div>
          )}
          {grant.contact.organization && (
            <div className="text-gray-700 text-xs">{grant.contact.organization}</div>
          )}
          {grant.contact.email && (
            <div className="text-blue-600 underline cursor-pointer text-xs break-all">
              <a href={`mailto:${grant.contact.email}`}>{grant.contact.email}</a>
            </div>
          )}
          {grant.contact.phone && (
            <div className="text-gray-700 text-xs">
              <a href={`tel:${grant.contact.phone}`}>{grant.contact.phone}</a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default GrantSidebar;
