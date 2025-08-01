
import React, { useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ApplicationDraft } from "@/hooks/useChatAgent";
import { Section } from "@/types/businessPlan";

interface EditableBusinessPlanContentProps {
  draft: ApplicationDraft;
  sections: Section[];
  onUpdateField: (sectionId: string, fieldId: string, value: string) => void;
  highlightedSection?: string;
  onSectionRef?: (sectionKey: string, ref: HTMLTextAreaElement | null) => void;
}

export const EditableBusinessPlanContent: React.FC<EditableBusinessPlanContentProps> = ({
  draft,
  sections,
  onUpdateField,
  highlightedSection,
  onSectionRef
}) => {
  const getSectionClassName = (sectionKey: string) => {
    const baseClass = "bg-gray-50 border-gray-200 min-h-[100px] focus:ring-2 focus:ring-blue-500 transition-all duration-300";
    return highlightedSection === sectionKey ? `${baseClass} ring-2 ring-yellow-400 bg-yellow-50` : baseClass;
  };

  const handleFieldChange = (sectionId: string, fieldId: string, value: string, draftKey: keyof ApplicationDraft['sections']) => {
    // Update the business plan sections
    onUpdateField(sectionId, fieldId, value);
    
    // Also update the draft object directly for immediate UI feedback
    if (draft && draft.sections) {
      draft.sections[draftKey] = value;
    }
  };

  return (
    <div className="space-y-1">
      {/* Utmaning Section */}
      <div className="bg-white rounded-lg p-6 py-[24px]">
        <h2 className="font-semibold text-gray-900 mb-4 text-base">Utmaning</h2>
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            Beskriv den utmaning i ditt och omvärld som ni adresserar. Vilka är behoven? Vad har ni gjort för att undersöka behoven?
          </label>
          <Textarea 
            ref={ref => onSectionRef?.("utmaning", ref)} 
            value={draft.sections.problemformulering || ''} 
            onChange={e => handleFieldChange("utmaning", "utmaning_beskrivning", e.target.value, "problemformulering")} 
            className={getSectionClassName("utmaning")} 
            placeholder="Beskriv utmaningen..." 
          />
        </div>
      </div>

      {/* Lösning och produktidé Section */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="font-semibold text-gray-900 mb-4 text-base">Lösning och produktidé</h2>
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            Beskriv den produkt, tjänst eller lösning som ska utvecklas eller förbättras för marknaden i projektet. På vilket sätt är den innovativ? Vad är nytten för kunden? Beskriv hur långt projektet har kommit i sin utveckling. I vilket skede ska produkten befinna sig vid projektets slut?
          </label>
          <Textarea 
            ref={ref => onSectionRef?.("losning", ref)} 
            value={draft.sections.mal_och_resultat || ''} 
            onChange={e => handleFieldChange("losning", "losning_beskrivning", e.target.value, "mal_och_resultat")} 
            className={getSectionClassName("losning")} 
            placeholder="Beskriv lösningen..." 
          />
        </div>
      </div>

      {/* Immaterialrätt Section */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="font-semibold text-gray-900 mb-4 text-base">Immaterialrätt</h2>
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            Har det genomförts en nyhetsgranskning? Har ni skyddat eller planerar ni att skydda produkten med ett patent, designskydd eller förvaradt?
          </label>
          <Textarea 
            ref={ref => onSectionRef?.("immaterial", ref)} 
            value={draft.sections.immaterial || ''} 
            onChange={e => handleFieldChange("immaterial", "immaterial_beskrivning", e.target.value, "immaterial")} 
            className={getSectionClassName("immaterial")} 
            placeholder="Beskriv immaterialrätt..." 
          />
        </div>
      </div>

      {/* Marknadspotential Section */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="font-semibold text-gray-900 mb-4 text-base">Marknadspotential</h2>
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            Beskriv den tänkta marknaden (nationell och internationell). Vilka potentiella kundgrupper finns? Vilka andra företag finns som konkurrenter med er produktidé? Har företaget oss er så till framtidsvarande förening? Vad gör er lösning unik?
          </label>
          <Textarea 
            ref={ref => onSectionRef?.("marknad", ref)} 
            value={draft.sections.malgrupp || ''} 
            onChange={e => handleFieldChange("marknad", "marknad_beskrivning", e.target.value, "malgrupp")} 
            className={getSectionClassName("marknad")} 
            placeholder="Beskriv marknaden..." 
          />
        </div>
      </div>

      {/* Kommersialisering och nyttiggörande Section */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="font-semibold text-gray-900 mb-4 text-base">Kommersialisering och nyttiggörande</h2>
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            Beskriv strategin för hur idén ska kommersialiseras, nyttiggöras och implementeras. Vilka nationella och internationella samarbeten kan komma att behövas för att kommersialisera produkten? Har det utvecklats konkreta sätt eller en eventull finansiering från första?
          </label>
          <Textarea 
            ref={ref => onSectionRef?.("kommersialisering", ref)} 
            value={draft.sections.kommersialisering || ''} 
            onChange={e => handleFieldChange("kommersialisering", "kommersiell_strategi", e.target.value, "kommersialisering")} 
            className={getSectionClassName("kommersialisering")} 
            placeholder="Beskriv kommersialisering..." 
          />
        </div>
      </div>
    </div>
  );
};
