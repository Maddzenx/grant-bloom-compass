
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ApplicationDraft } from "@/hooks/useChatAgent";
import { Section } from "@/types/businessPlan";

interface EditableBusinessPlanContentProps {
  draft: ApplicationDraft;
  sections: Section[];
  onUpdateField: (sectionId: string, fieldId: string, value: string) => void;
}

export const EditableBusinessPlanContent: React.FC<EditableBusinessPlanContentProps> = ({
  draft,
  sections,
  onUpdateField
}) => {
  return <div className="space-y-8">
      {/* Utmaning Section */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Utmaning</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Beskriv den utmaning i ditt och omvärld som ni adresserar. Vilka är behoven? Vad har ni gjort för att undersöka behoven?
          </label>
          <Textarea 
            value={draft.sections.problemformulering || ''} 
            onChange={e => onUpdateField("utmaning", "utmaning_beskrivning", e.target.value)} 
            className="bg-gray-50 border-gray-200 min-h-[100px] focus:ring-2 focus:ring-blue-500" 
            placeholder="Beskriv utmaningen..." 
          />
        </div>
      </div>

      {/* Lösning och produktidé Section */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Lösning och produktidé</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Beskriv den produkt, tjänst eller lösning som ska utvecklas eller förbättras för marknaden i projektet. På vilket sätt är den innovativ? Vad är nytten för kunden? Beskriv hur långt projektet har kommit i sin utveckling. I vilket skede ska produkten befinna sig vid projektets slut?
          </label>
          <Textarea 
            value={draft.sections.mal_och_resultat || ''} 
            onChange={e => onUpdateField("losning", "losning_beskrivning", e.target.value)} 
            className="bg-gray-50 border-gray-200 min-h-[100px] focus:ring-2 focus:ring-blue-500" 
            placeholder="Beskriv lösningen..." 
          />
        </div>
      </div>

      {/* Immaterialrätt Section */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Immaterialrätt</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Har det genomförts en nyhetsgranskning? Har ni skyddat eller planerar ni att skydda produkten med ett patent, designskydd eller förvaradt?
          </label>
          <Textarea 
            value={draft.sections.immaterial || ''} 
            onChange={e => onUpdateField("immaterial", "immaterial_beskrivning", e.target.value)} 
            className="bg-gray-50 border-gray-200 min-h-[100px] focus:ring-2 focus:ring-blue-500" 
            placeholder="Beskriv immaterialrätt..." 
          />
        </div>
      </div>

      {/* Marknadspotential Section */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Marknadspotential</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Beskriv den tänkta marknaden (nationell och internationell). Vilka potentiella kundgrupper finns? Vilka andra företag finns som konkurrenter med er produktidé? Har företaget oss er så till framtidsvarande förening? Vad gör er lösning unik?
          </label>
          <Textarea 
            value={draft.sections.malgrupp || ''} 
            onChange={e => onUpdateField("marknad", "marknad_beskrivning", e.target.value)} 
            className="bg-gray-50 border-gray-200 min-h-[100px] focus:ring-2 focus:ring-blue-500" 
            placeholder="Beskriv marknaden..." 
          />
        </div>
      </div>

      {/* Kommersialisering och nyttiggörande Section */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Kommersialisering och nyttiggörande</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Beskriv strategin för hur idén ska kommersialiseras, nyttiggöras och implementeras. Vilka nationella och internationella samarbeten kan komma att behövas för att kommersialisera produkten? Har det utvecklats konkreta sätt eller en eventull finansiering från första?
          </label>
          <Textarea 
            value={draft.sections.kommersialisering || ''} 
            onChange={e => onUpdateField("kommersialisering", "kommersiell_strategi", e.target.value)} 
            className="bg-gray-50 border-gray-200 min-h-[100px] focus:ring-2 focus:ring-blue-500" 
            placeholder="Beskriv kommersialisering..." 
          />
        </div>
      </div>
    </div>;
};
