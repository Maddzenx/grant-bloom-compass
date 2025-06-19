
import { Section, FormField } from "@/types/businessPlan";
import { Grant } from "@/types/grant";

export const createSectionsForGrant = (grant?: Grant): Section[] => {
  const baseSections: Section[] = [{
    id: "foretaget",
    title: "Företaget",
    isExpanded: true,
    isCompleted: false,
    completionPercentage: 0,
    fields: [{
      id: "org_number",
      label: "Organisationsnummer",
      value: "",
      type: "input" as const,
      placeholder: "XXXXXX-XXXX",
      required: true,
      validation: { isValid: true }
    }, {
      id: "reg_address",
      label: "Registrerad adress",
      value: "",
      type: "input" as const,
      placeholder: "Gatuadress, postnummer, ort",
      required: true,
      validation: { isValid: true }
    }, {
      id: "antal_anstallda",
      label: "Antal anställda",
      value: "",
      type: "input" as const,
      placeholder: "Antal heltidsekvivalenter",
      required: true,
      validation: { isValid: true }
    }, {
      id: "omsattning_2022",
      label: "Omsättning (2022, 2023)",
      value: "",
      type: "input" as const,
      placeholder: "Belopp i SEK för de senaste två åren",
      required: true,
      validation: { isValid: true }
    }, {
      id: "omsattning_result",
      label: "Resultat (2022, 2023)",
      value: "",
      type: "input" as const,
      placeholder: "Resultat i SEK för de senaste två åren",
      required: true,
      validation: { isValid: true }
    }, {
      id: "beskrivning",
      label: grant 
        ? `Beskriv kortfattat företagets verksamhet för ${grant.title}` 
        : "Beskriv kortfattat företagets verksamhet",
      value: "",
      type: "textarea" as const,
      placeholder: grant 
        ? `Anpassa beskrivningen till ${grant.organization}s krav för ${grant.title}. Inkludera hur ni uppfyller eventuella branschkrav.`
        : "Beskriv företagets verksamhet, produkter och finansiering samt övergripande mål på 5-10 års sikt.",
      required: true,
      validation: { isValid: true }
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
        completionPercentage: 0,
        fields: [{
          id: "behorighet_beskrivning",
          label: `Hur uppfyller ni behörighetskraven för ${grant.title}?`,
          value: "",
          type: "textarea" as const,
          placeholder: `Krav från ${grant.organization}: ${grant.qualifications}`,
          required: true,
          validation: { isValid: true }
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
        completionPercentage: 0,
        fields: [{
          id: "utvarderings_svar",
          label: "Hur uppfyller ert projekt utvärderingskriterierna?",
          value: "",
          type: "textarea" as const,
          placeholder: `Utvärderingskriterier: ${grant.evaluationCriteria}`,
          required: true,
          validation: { isValid: true }
        }]
      });
    }

    // Add funding section with real grant data
    baseSections.push({
      id: "finansiering",
      title: "Projektfinansiering",
      isExpanded: true,
      isCompleted: false,
      completionPercentage: 0,
      fields: [{
        id: "budget_total",
        label: "Total projektbudget",
        value: "",
        type: "input" as const,
        placeholder: `Tillgängligt bidrag: ${grant.fundingAmount}`,
        required: true,
        validation: { isValid: true }
      }, {
        id: "sokt_bidrag",
        label: "Sökt bidragsbelopp",
        value: "",
        type: "input" as const,
        placeholder: "Ange det belopp ni söker",
        required: true,
        validation: { isValid: true }
      }, {
        id: "egna_medel",
        label: "Egna medel och övrig finansiering",
        value: "",
        type: "textarea" as const,
        placeholder: "Beskriv hur resterande budget finansieras",
        required: true,
        validation: { isValid: true }
      }]
    });

    // Add requirements section if available from database
    if (grant.requirements.length > 0) {
      const requirementFields: FormField[] = grant.requirements.slice(0, 5).map((req, index) => ({
        id: `krav_${index}`,
        label: `Krav: ${req}`,
        value: "",
        type: "textarea" as const,
        placeholder: `Beskriv hur ni uppfyller detta krav`,
        required: true,
        validation: { isValid: true }
      }));

      if (requirementFields.length > 0) {
        baseSections.push({
          id: "krav_uppfyllnad",
          title: "Uppfyllnad av specifika krav",
          isExpanded: true,
          isCompleted: false,
          completionPercentage: 0,
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
        completionPercentage: 0,
        fields: [{
          id: "process_bekraftelse",
          label: "Bekräfta att ni förstår ansökningsprocessen",
          value: "",
          type: "textarea" as const,
          placeholder: `Process: ${grant.applicationProcess}`,
          required: true,
          validation: { isValid: true }
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
    completionPercentage: 0,
    fields: [{
      id: "utmaning_beskrivning",
      label: grant 
        ? `Beskriv den utmaning som ${grant.title} ska adressera`
        : "Beskriv den utmaning och det behov som projektet adresserar",
      value: "",
      type: "textarea" as const,
      placeholder: "Vilka är behoven? Vad har ni gjort för att undersöka dem?",
      required: true,
      validation: { isValid: true }
    }]
  }, {
    id: "losning",
    title: "Lösning och innovation",
    isExpanded: true,
    isCompleted: false,
    completionPercentage: 0,
    fields: [{
      id: "losning_beskrivning",
      label: "Beskriv den innovativa lösning som ska utvecklas",
      value: "",
      type: "textarea" as const,
      placeholder: "Vad är nytt med er lösning? Hur skiljer den sig från befintliga alternativ?",
      required: true,
      validation: { isValid: true }
    }, {
      id: "teknisk_genomforbarhet",
      label: "Teknisk genomförbarhet",
      value: "",
      type: "textarea" as const,
      placeholder: "Beskriv den tekniska genomförbarheten och eventuella risker",
      required: false,
      validation: { isValid: true }
    }]
  }, {
    id: "marknad",
    title: "Marknad och kommersialisering",
    isExpanded: true,
    isCompleted: false,
    completionPercentage: 0,
    fields: [{
      id: "marknad_beskrivning",
      label: "Marknadsanalys",
      value: "",
      type: "textarea" as const,
      placeholder: "Beskriv målmarknaden nationellt och internationellt",
      required: true,
      validation: { isValid: true }
    }, {
      id: "kommersiell_strategi",
      label: "Kommersialiseringsstrategi",
      value: "",
      type: "textarea" as const,
      placeholder: "Hur ska lösningen kommersialiseras och nå marknaden?",
      required: true,
      validation: { isValid: true }
    }]
  });

  console.log('Created sections:', baseSections);
  return baseSections;
};
