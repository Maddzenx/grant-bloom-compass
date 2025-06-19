
import { useState, useEffect } from "react";
import { Section, UploadedFile } from "@/types/businessPlan";
import { Grant } from "@/types/grant";

export const useBusinessPlanEditor = (grant?: Grant) => {
  const [sections, setSections] = useState<Section[]>(() => createSectionsForGrant(grant));
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
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

  return {
    sections,
    uploadedFiles,
    autoSaved,
    updateFieldValue,
    toggleSectionCompletion,
    removeFile
  };
};

// Create dynamic sections based on real grant data from database
const createSectionsForGrant = (grant?: Grant): Section[] => {
  const baseSections: Section[] = [{
    id: "foretaget",
    title: "Företaget",
    isExpanded: true,
    isCompleted: false,
    fields: [{
      id: "org_number",
      label: "Organisationsnummer",
      value: "",
      type: "input",
      placeholder: "XXXXXX-XXXX"
    }, {
      id: "reg_address",
      label: "Registrerad adress",
      value: "",
      type: "input",
      placeholder: "Gatuadress, postnummer, ort"
    }, {
      id: "antal_anstallda",
      label: "Antal anställda",
      value: "",
      type: "input",
      placeholder: "Antal heltidsekvivalenter"
    }, {
      id: "omsattning_2022",
      label: "Omsättning (2022, 2023)",
      value: "",
      type: "input",
      placeholder: "Belopp i SEK för de senaste två åren"
    }, {
      id: "omsattning_result",
      label: "Resultat (2022, 2023)",
      value: "",
      type: "input",
      placeholder: "Resultat i SEK för de senaste två åren"
    }, {
      id: "beskrivning",
      label: grant 
        ? `Beskriv kortfattat företagets verksamhet för ${grant.title}` 
        : "Beskriv kortfattat företagets verksamhet",
      value: "",
      type: "textarea",
      placeholder: grant 
        ? `Anpassa beskrivningen till ${grant.organization}s krav för ${grant.title}. Inkludera hur ni uppfyller eventuella branschkrav.`
        : "Beskriv företagets verksamhet, produkter och finansiering samt övergripande mål på 5-10 års sikt."
    }]
  }];

  // Add grant-specific sections based on real database content
  if (grant) {
    console.log('Creating sections for grant:', grant);

    // Add eligibility section if grant has specific qualifications
    if (grant.qualifications && grant.qualifications !== 'Ej specificerat') {
      baseSections.push({
        id: "behorighet",
        title: "Behörighet och kvalifikationer",
        isExpanded: true,
        isCompleted: false,
        fields: [{
          id: "behorighet_beskrivning",
          label: `Hur uppfyller ni behörighetskraven för ${grant.title}?`,
          value: "",
          type: "textarea",
          placeholder: `Krav från ${grant.organization}: ${grant.qualifications}`
        }]
      });
    }

    // Add evaluation criteria section if available
    if (grant.evaluationCriteria && grant.evaluationCriteria !== '') {
      baseSections.push({
        id: "utvarderings_kriterier",
        title: "Utvärderingskriterier",
        isExpanded: true,
        isCompleted: false,
        fields: [{
          id: "utvarderings_svar",
          label: "Hur uppfyller ert projekt utvärderingskriterierna?",
          value: "",
          type: "textarea",
          placeholder: `Utvärderingskriterier: ${grant.evaluationCriteria}`
        }]
      });
    }

    // Add funding section with real grant data
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
        id: "sokt_bidrag",
        label: "Sökt bidragsbelopp",
        value: "",
        type: "input",
        placeholder: "Ange det belopp ni söker"
      }, {
        id: "egna_medel",
        label: "Egna medel och övrig finansiering",
        value: "",
        type: "textarea",
        placeholder: "Beskriv hur resterande budget finansieras"
      }]
    });

    // Add requirements section if available from database
    if (grant.requirements.length > 0) {
      const requirementFields = grant.requirements.slice(0, 5).map((req, index) => ({
        id: `krav_${index}`,
        label: `Krav: ${req}`,
        value: "",
        type: "textarea" as const,
        placeholder: `Beskriv hur ni uppfyller detta krav`
      }));

      if (requirementFields.length > 0) {
        baseSections.push({
          id: "krav_uppfyllnad",
          title: "Uppfyllnad av specifika krav",
          isExpanded: true,
          isCompleted: false,
          fields: requirementFields
        });
      }
    }

    // Add application process section if available
    if (grant.applicationProcess && grant.applicationProcess !== '') {
      baseSections.push({
        id: "ansoknings_process",
        title: "Ansökningsprocess",
        isExpanded: true,
        isCompleted: false,
        fields: [{
          id: "process_bekraftelse",
          label: "Bekräfta att ni förstår ansökningsprocessen",
          value: "",
          type: "textarea",
          placeholder: `Process: ${grant.applicationProcess}`
        }]
      });
    }
  }

  // Add remaining standard sections
  baseSections.push({
    id: "utmaning",
    title: "Utmaning och behov",
    isExpanded: true,
    isCompleted: false,
    fields: [{
      id: "utmaning_beskrivning",
      label: grant 
        ? `Beskriv den utmaning som ${grant.title} ska adressera`
        : "Beskriv den utmaning och det behov som projektet adresserar",
      value: "",
      type: "textarea",
      placeholder: "Vilka är behoven? Vad har ni gjort för att undersöka dem?"
    }]
  }, {
    id: "losning",
    title: "Lösning och innovation",
    isExpanded: true,
    isCompleted: false,
    fields: [{
      id: "losning_beskrivning",
      label: "Beskriv den innovativa lösning som ska utvecklas",
      value: "",
      type: "textarea",
      placeholder: "Vad är nytt med er lösning? Hur skiljer den sig från befintliga alternativ?"
    }, {
      id: "teknisk_genomforbarhet",
      label: "Teknisk genomförbarhet",
      value: "",
      type: "textarea",
      placeholder: "Beskriv den tekniska genomförbarheten och eventuella risker"
    }]
  }, {
    id: "marknad",
    title: "Marknad och kommersialisering",
    isExpanded: true,
    isCompleted: false,
    fields: [{
      id: "marknad_beskrivning",
      label: "Marknadsanalys",
      value: "",
      type: "textarea",
      placeholder: "Beskriv målmarknaden nationellt och internationellt"
    }, {
      id: "kommersiell_strategi",
      label: "Kommersialiseringsstrategi",
      value: "",
      type: "textarea",
      placeholder: "Hur ska lösningen kommersialiseras och nå marknaden?"
    }]
  });

  console.log('Created sections:', baseSections);
  return baseSections;
};
