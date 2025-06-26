
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
    <section className="bg-accent-lavender-10 p-4 md:p-6 rounded-lg border border-accent-lavender">
      <div className="flex items-center gap-2 mb-3 md:mb-4">
        <CheckCircle className="w-5 h-5 text-ink-obsidian" />
        <h2 className={`font-bold text-ink-obsidian ${titleClass}`}>
          Utvärderingskriterier
        </h2>
      </div>
      <div className="bg-white p-4 rounded-lg">
        <p className={`text-ink-obsidian leading-relaxed ${textClass}`}>{grant.evaluationCriteria}</p>
      </div>
    </section>
  );
};

export default GrantEvaluationSection;
