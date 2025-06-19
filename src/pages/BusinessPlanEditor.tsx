import React, { useState } from "react";
import { Check, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormSection } from "@/components/business-plan/FormSection";
import { ProgressSidebar } from "@/components/business-plan/ProgressSidebar";
import { FileUpload } from "@/components/business-plan/FileUpload";
import { Section, UploadedFile } from "@/types/businessPlan";
const BusinessPlanEditor = () => {
  const [sections, setSections] = useState<Section[]>([{
    id: "foretaget",
    title: "Företaget",
    isExpanded: true,
    isCompleted: true,
    fields: [{
      id: "org_number",
      label: "Organisationsnummer",
      value: "827773392",
      type: "input"
    }, {
      id: "reg_address",
      label: "Registrerad adress",
      value: "Value",
      type: "input"
    }, {
      id: "antal_anstallda",
      label: "Antal anställda",
      value: "Value",
      type: "input"
    }, {
      id: "omsattning_2022",
      label: "Omsättning (2022, 2023)",
      value: "Value",
      type: "input"
    }, {
      id: "omsattning_result",
      label: "Resultat (2022, 2023)",
      value: "Value",
      type: "input"
    }, {
      id: "beskrivning",
      label: "Beskriv kortfattat företagets verksamhet, eventuella produkter samt hur företaget finansieras. Vilka är företagets övergripande mål på 5-10 års sikt?",
      value: "Value",
      type: "textarea"
    }]
  }, {
    id: "utmaning",
    title: "Utmaning",
    isExpanded: true,
    isCompleted: true,
    fields: [{
      id: "utmaning_beskrivning",
      label: "Beskriv den utmaning i vilket och område som ni adresserar. Vilka är behoven? Vad har ni gjort för att undersöka behoven?",
      value: "Value",
      type: "textarea"
    }]
  }, {
    id: "losning",
    title: "Lösning och produktidé",
    isExpanded: true,
    isCompleted: false,
    fields: [{
      id: "losning_beskrivning",
      label: "Beskriv den produkt, tjänst eller lösning som ska utvecklas efter förståelse för marknadens ryndselekt. På vilket sätt är den innovativ? Vad är nytten för användaren? Beskriv för lägre prioritet hos kunnet i din utveckling. I vilket ställe ska produktidén befinn sig vid projektets slut?",
      value: "Value",
      type: "textarea"
    }]
  }, {
    id: "immaterial",
    title: "Immaterialrätt",
    isExpanded: true,
    isCompleted: false,
    fields: [{
      id: "immaterial_beskrivning",
      label: "Har det genererita im nyhetsföbandlag? Har ni skyddad andra platener ni att skydda produktiden med ett patent, designskydd eller liknande?",
      value: "Value",
      type: "textarea"
    }]
  }, {
    id: "marknad",
    title: "Marknadspotential",
    isExpanded: true,
    isCompleted: false,
    fields: [{
      id: "marknad_beskrivning",
      label: "Beskriv den tänkta marknaden (nationell och internationell). Vilka potentiella kundgrupper finns? Vilka andra företag finns som konkurrerar med er produkter? Hur förhåller sig er till konkurrenende förtregg? Vad gör er lösing unik?",
      value: "Value",
      type: "textarea"
    }]
  }, {
    id: "kommersiell",
    title: "Kommersialisering och nyttjörande",
    isExpanded: true,
    isCompleted: false,
    fields: [{
      id: "kommersiell_beskrivning",
      label: "Beskriv strategin för hur idén ska kommersialisera, nyttigöras och implementeras. Vilka nätvreerk och internationella samarbeten kan komma att behövas för att kommersialisaera produktidén? Har ska utvecklingstyrelsen fönga efter att eventuellt finansiering från Vinnova?",
      value: "Value",
      type: "textarea"
    }]
  }]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([{
    id: "1",
    name: "Ansökning_dokument.pdf",
    type: "pdf",
    size: "2.4 MB"
  }, {
    id: "2",
    name: "Ansökning_dokument.pdf",
    type: "pdf",
    size: "2.4 MB"
  }, {
    id: "3",
    name: "Ansökning_dokument.pdf",
    type: "pdf",
    size: "2.4 MB"
  }, {
    id: "4",
    name: "Ansökning_dokument.pdf",
    type: "pdf",
    size: "2.4 MB"
  }]);
  const [autoSaved, setAutoSaved] = useState(true);
  const updateFieldValue = (sectionId: string, fieldId: string, value: string) => {
    setSections(sections.map(section => section.id === sectionId ? {
      ...section,
      fields: section.fields.map(field => field.id === fieldId ? {
        ...field,
        value
      } : field)
    } : section));
    setAutoSaved(false);
    setTimeout(() => setAutoSaved(true), 1000);
  };
  const toggleSectionCompletion = (sectionId: string) => {
    setSections(sections.map(section => section.id === sectionId ? {
      ...section,
      isCompleted: !section.isCompleted
    } : section));
  };
  const removeFile = (fileId: string) => {
    setUploadedFiles(uploadedFiles.filter(file => file.id !== fileId));
  };
  return <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6 bg-[f8f4ec] bg-[#f8f4ec]">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Business plan editor</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {autoSaved ? <>
                  <Check className="w-4 h-4 text-green-500" />
                  Auto-saved
                </> : <>
                  <Save className="w-4 h-4 text-gray-400" />
                  Saving...
                </>}
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 px-6">
              Review
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {sections.map(section => <FormSection key={section.id} section={section} onUpdateField={updateFieldValue} />)}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <ProgressSidebar sections={sections} onToggleSectionCompletion={toggleSectionCompletion} />
            <FileUpload uploadedFiles={uploadedFiles} onRemoveFile={removeFile} />
          </div>
        </div>
      </div>
    </div>;
};
export default BusinessPlanEditor;