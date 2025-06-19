
import { Section, FormField } from "@/types/businessPlan";
import { Grant } from "@/types/grant";
import { createTextareaField, createInputField } from "./fieldCreators";

export const createEligibilitySection = (grant: Grant): Section | null => {
  if (!grant.qualifications || grant.qualifications === 'Ej specificerat') {
    return null;
  }

  return {
    id: "behorighet",
    title: "Behörighet och kvalifikationer",
    isExpanded: true,
    isCompleted: false,
    completionPercentage: 0,
    fields: [
      createTextareaField(
        "behorighet_beskrivning",
        `Hur uppfyller ni behörighetskraven för ${grant.title}?`,
        `Krav från ${grant.organization}: ${grant.qualifications}`
      )
    ]
  };
};

export const createEvaluationCriteriaSection = (grant: Grant): Section | null => {
  if (!grant.evaluationCriteria || grant.evaluationCriteria === '') {
    return null;
  }

  return {
    id: "utvarderings_kriterier",
    title: "Utvärderingskriterier",
    isExpanded: true,
    isCompleted: false,
    completionPercentage: 0,
    fields: [
      createTextareaField(
        "utvarderings_svar",
        "Hur uppfyller ert projekt utvärderingskriterierna?",
        `Utvärderingskriterier: ${grant.evaluationCriteria}`
      )
    ]
  };
};

export const createFundingSection = (grant: Grant): Section => ({
  id: "finansiering",
  title: "Projektfinansiering",
  isExpanded: true,
  isCompleted: false,
  completionPercentage: 0,
  fields: [
    createInputField(
      "budget_total",
      "Total projektbudget",
      `Tillgängligt bidrag: ${grant.fundingAmount}`
    ),
    createInputField(
      "sokt_bidrag",
      "Sökt bidragsbelopp",
      "Ange det belopp ni söker"
    ),
    createTextareaField(
      "egna_medel",
      "Egna medel och övrig finansiering",
      "Beskriv hur resterande budget finansieras"
    )
  ]
});

export const createRequirementsSection = (grant: Grant): Section | null => {
  if (!grant.requirements || grant.requirements.length === 0) {
    return null;
  }

  const requirementFields: FormField[] = grant.requirements.slice(0, 5).map((req, index) => 
    createTextareaField(
      `krav_${index}`,
      `Krav: ${req}`,
      `Beskriv hur ni uppfyller detta krav`
    )
  );

  if (requirementFields.length === 0) {
    return null;
  }

  return {
    id: "krav_uppfyllnad",
    title: "Uppfyllnad av specifika krav",
    isExpanded: true,
    isCompleted: false,
    completionPercentage: 0,
    fields: requirementFields
  };
};

export const createApplicationProcessSection = (grant: Grant): Section | null => {
  if (!grant.applicationProcess || grant.applicationProcess === '') {
    return null;
  }

  return {
    id: "ansoknings_process",
    title: "Ansökningsprocess",
    isExpanded: true,
    isCompleted: false,
    completionPercentage: 0,
    fields: [
      createTextareaField(
        "process_bekraftelse",
        "Bekräfta att ni förstår ansökningsprocessen",
        `Process: ${grant.applicationProcess}`
      )
    ]
  };
};
