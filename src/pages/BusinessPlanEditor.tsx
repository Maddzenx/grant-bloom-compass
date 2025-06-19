import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Check, Save, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormSection } from "@/components/business-plan/FormSection";
import { ProgressSidebar } from "@/components/business-plan/ProgressSidebar";
import { FileUpload } from "@/components/business-plan/FileUpload";
import { Section, UploadedFile } from "@/types/businessPlan";
import { Grant } from "@/types/grant";
import { useSidebar } from "@/components/ui/sidebar";

const BusinessPlanEditor = () => {
  const { state, toggleSidebar } = useSidebar();
  const location = useLocation();
  const grant = location.state?.grant as Grant | undefined;
  
  // Create dynamic sections based on grant data
  const createSectionsForGrant = (grant?: Grant): Section[] => {
    const baseSections: Section[] = [{
      id: "foretaget",
      title: "Företaget",
      isExpanded: true,
      isCompleted: true,
      fields: [{
        id: "org_number",
        label: "Organisationsnummer",
        value: "",
        type: "input"
      }, {
        id: "reg_address",
        label: "Registrerad adress",
        value: "",
        type: "input"
      }, {
        id: "antal_anstallda",
        label: "Antal anställda",
        value: "",
        type: "input"
      }, {
        id: "omsattning_2022",
        label: "Omsättning (2022, 2023)",
        value: "",
        type: "input"
      }, {
        id: "omsattning_result",
        label: "Resultat (2022, 2023)",
        value: "",
        type: "input"
      }, {
        id: "beskrivning",
        label: grant 
          ? `Beskriv kortfattat företagets verksamhet för ${grant.title}` 
          : "Beskriv kortfattat företagets verksamhet, eventuella produkter samt hur företaget finansieras. Vilka är företagets övergripande mål på 5-10 års sikt?",
        value: "",
        type: "textarea",
        placeholder: grant 
          ? `Anpassa beskrivningen till ${grant.organization}s krav för ${grant.title}`
          : undefined
      }]
    }];

    // Add grant-specific sections based on requirements
    if (grant) {
      // Add eligibility section if grant has specific qualifications
      if (grant.qualifications && grant.qualifications !== 'Ej specificerat') {
        baseSections.push({
          id: "behorighet",
          title: "Behörighet och kvalifikationer",
          isExpanded: true,
          isCompleted: false,
          fields: [{
            id: "behorighet_beskrivning",
            label: `Hur uppfyller ni kraven för ${grant.title}?`,
            value: "",
            type: "textarea",
            placeholder: `Krav från ${grant.organization}: ${grant.qualifications}`
          }]
        });
      }

      // Add funding section
      baseSections.push({
        id: "finansiering",
        title: "Projektfinansiering",
        isExpanded: true,
        isCompleted: false,
        fields: [{
          id: "budget_total",
          label: "Total projektbudget",
          value: "",
          type: "input",
          placeholder: `Tillgängligt bidrag: ${grant.fundingAmount}`
        }, {
          id: "egna_medel",
          label: "Egna medel och övrig finansiering",
          value: "",
          type: "textarea"
        }]
      });

      // Add requirements section if available
      if (grant.requirements.length > 0) {
        baseSections.push({
          id: "krav_uppfyllnad",
          title: "Uppfyllnad av specifika krav",
          isExpanded: true,
          isCompleted: false,
          fields: grant.requirements.map((req, index) => ({
            id: `krav_${index}`,
            label: `Hur uppfyller ni: ${req}`,
            value: "",
            type: "textarea"
          }))
        });
      }
    }

    // Add remaining standard sections
    baseSections.push({
      id: "utmaning",
      title: "Utmaning",
      isExpanded: true,
      isCompleted: true,
      fields: [{
        id: "utmaning_beskrivning",
        label: grant 
          ? `Beskriv den utmaning som ${grant.title} adresserar`
          : "Beskriv den utmaning i vilket och område som ni adresserar. Vilka är behoven? Vad har ni gjort för att undersöka behoven?",
        value: "",
        type: "textarea"
      }]
    }, {
      id: "losning",
      title: "Lösning och produktidé",
      isExpanded: true,
      isCompleted: false,
      fields: [{
        id: "losning_beskrivning",
        label: "Beskriv den produkt, tjänst eller lösning som ska utvecklas",
        value: "",
        type: "textarea"
      }]
    }, {
      id: "marknad",
      title: "Marknadspotential",
      isExpanded: true,
      isCompleted: false,
      fields: [{
        id: "marknad_beskrivning",
        label: "Beskriv den tänkta marknaden (nationell och internationell)",
        value: "",
        type: "textarea"
      }]
    }, {
      id: "kommersiell",
      title: "Kommersialisering och nyttjörande",
      isExpanded: true,
      isCompleted: false,
      fields: [{
        id: "kommersiell_beskrivning",
        label: "Beskriv strategin för hur idén ska kommersialiseras",
        value: "",
        type: "textarea"
      }]
    });

    return baseSections;
  };

  const [sections, setSections] = useState<Section[]>(() => createSectionsForGrant(grant));
  
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

  // Update sections when grant changes
  useEffect(() => {
    setSections(createSectionsForGrant(grant));
  }, [grant]);

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

  return (
    <div className="flex-1 bg-gray-50 min-h-screen relative">
      <div className="max-w-7xl mx-auto p-6 bg-[f8f4ec] bg-[#f8f4ec]">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {/* Expand button - only show when sidebar is collapsed */}
            {state === "collapsed" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="flex items-center justify-center w-8 h-8 rounded-md bg-white border border-gray-200 shadow-md hover:bg-gray-100 transition-colors"
                title="Visa sidopanel"
              >
                <PanelLeft className="w-4 h-4" />
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {grant ? `Ansökan för ${grant.title}` : "Business plan editor"}
              </h1>
              {grant && (
                <p className="text-sm text-gray-600 mt-1">
                  {grant.organization} • Deadline: {grant.deadline}
                </p>
              )}
            </div>
          </div>
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
    </div>
  );
};

export default BusinessPlanEditor;
