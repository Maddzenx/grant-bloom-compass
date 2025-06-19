
import React from "react";
import { Grant } from "@/types/grant";
import { ClipboardList } from "lucide-react";

interface GrantApplicationSectionProps {
  grant: Grant;
  isMobile?: boolean;
}

const GrantApplicationSection = ({ grant, isMobile = false }: GrantApplicationSectionProps) => {
  const titleClass = isMobile ? 'text-lg' : 'text-xl';
  const textClass = isMobile ? 'text-sm' : 'text-sm';

  if (!grant.applicationProcess) return null;

  return (
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
  );
};

export default GrantApplicationSection;
