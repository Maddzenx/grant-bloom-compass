
import React from "react";
import { Grant } from "@/types/grant";
import { CheckCircle } from "lucide-react";

interface GrantEvaluationSectionProps {
  grant: Grant;
  isMobile?: boolean;
}

const GrantEvaluationSection = ({ grant, isMobile = false }: GrantEvaluationSectionProps) => {
  const titleClass = isMobile ? 'text-lg' : 'text-xl';
  const textClass = isMobile ? 'text-sm' : 'text-sm';

  if (!grant.evaluationCriteria) return null;

  return (
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
  );
};

export default GrantEvaluationSection;
