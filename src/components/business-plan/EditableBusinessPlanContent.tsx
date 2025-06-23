
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
  return (
    <div className="space-y-8">
      {/* Företaget Section */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Företaget</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organisationsnummer
            </label>
            <Input
              value="827735592"
              onChange={(e) => onUpdateField("foretaget", "org_number", e.target.value)}
              className="bg-gray-50 border-gray-200"
              placeholder="XXXXXX-XXXX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registrerad adress
            </label>
            <Input
              value="Value"
              onChange={(e) => onUpdateField("foretaget", "reg_address", e.target.value)}
              className="bg-gray-50 border-gray-200"
              placeholder="Gatuadress, postnummer, ort"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Antal anställda
            </label>
            <Input
              value="Value"
              onChange={(e) => onUpdateField("foretaget", "antal_anstallda", e.target.value)}
              className="bg-gray-50 border-gray-200"
              placeholder="Antal heltidsekvivalenter"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beskrivnummer
            </label>
            <Input
              value="Value"
              onChange={(e) => onUpdateField("foretaget", "beskrivnummer", e.target.value)}
              className="bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Omsättning (2022, 2023)
            </label>
            <Input
              value="Value"
              onChange={(e) => onUpdateField("foretaget", "omsattning", e.target.value)}
              className="bg-gray-50 border-gray-200"
              placeholder="Belopp i SEK"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resultat (2022, 2023)
            </label>
            <Input
              value="Value"
              onChange={(e) => onUpdateField("foretaget", "resultat", e.target.value)}
              className="bg-gray-50 border-gray-200"
              placeholder="Resultat i SEK"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Beskriv kortfattat företagets verksamhet, eventuella produkter samt hur företaget finansieras. Vilka är företagets övergripande mål på 5-10 års sikt?
          </label>
          <Textarea
            value="Företaget, EcoTech Solutions, fokuserar på att utveckla hållbara energilösningar för både hushåll och företag. Vi erbjuder innovativa produkter som solpaneler och energieffektiva apparater, vilket gör det möjligt för våra kunder att minska sina energikostnader och koldioxidutsläpp. Finansieringen kommer från en kombination av privata investeringar och statliga bidrag för gröna teknologier. På 5-10 års sikt strävar vi efter att bli ledande inom den hållbara energisektorn i Skandinavien och expandera våra tjänster internationellt."
            onChange={(e) => onUpdateField("foretaget", "beskrivning", e.target.value)}
            className="bg-gray-50 border-gray-200 min-h-[120px]"
            placeholder="Beskriv företagets verksamhet..."
          />
        </div>
      </div>

      {/* Utmaning Section */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Utmaning</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Beskriv den utmaning i ditt och omvärld som ni adresserar. Vilka är behoven? Vad har ni gjort för att undersöka behoven?
          </label>
          <Textarea
            value={draft.sections.problemformulering || 'Value'}
            onChange={(e) => onUpdateField("utmaning", "utmaning_beskrivning", e.target.value)}
            className="bg-gray-50 border-gray-200 min-h-[100px]"
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
            value={draft.sections.mal_och_resultat || 'Value'}
            onChange={(e) => onUpdateField("losning", "losning_beskrivning", e.target.value)}
            className="bg-gray-50 border-gray-200 min-h-[100px]"
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
            value="Value"
            onChange={(e) => onUpdateField("immaterial", "immaterial_beskrivning", e.target.value)}
            className="bg-gray-50 border-gray-200 min-h-[100px]"
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
            value={draft.sections.malgrupp || 'Value'}
            onChange={(e) => onUpdateField("marknad", "marknad_beskrivning", e.target.value)}
            className="bg-gray-50 border-gray-200 min-h-[100px]"
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
            value="Value"
            onChange={(e) => onUpdateField("kommersialisering", "kommersiell_strategi", e.target.value)}
            className="bg-gray-50 border-gray-200 min-h-[100px]"
            placeholder="Beskriv kommersialisering..."
          />
        </div>
      </div>
    </div>
  );
};
