
import { Section } from "@/types/businessPlan";
import { Grant } from "@/types/grant";
import { 
  createCompanySection, 
  createChallengeSection, 
  createSolutionSection, 
  createMarketSection 
} from "./businessPlan/baseSections";
import {
  createEligibilitySection,
  createEvaluationCriteriaSection,
  createFundingSection,
  createRequirementsSection,
  createApplicationProcessSection
} from "./businessPlan/grantSpecificSections";

export const createSectionsForGrant = (grant?: Grant): Section[] => {
  const sections: Section[] = [];

  // Add base company section
  sections.push(createCompanySection(grant));

  // Add grant-specific sections if grant is provided
  if (grant) {
    console.log('Creating sections for grant:', grant);

    // Add eligibility section if grant has specific qualifications
    const eligibilitySection = createEligibilitySection(grant);
    if (eligibilitySection) {
      sections.push(eligibilitySection);
    }

    // Add evaluation criteria section if available
    const evaluationSection = createEvaluationCriteriaSection(grant);
    if (evaluationSection) {
      sections.push(evaluationSection);
    }

    // Add funding section with real grant data
    sections.push(createFundingSection(grant));

    // Add requirements section if available from database
    const requirementsSection = createRequirementsSection(grant);
    if (requirementsSection) {
      sections.push(requirementsSection);
    }

    // Add application process section if available
    const applicationProcessSection = createApplicationProcessSection(grant);
    if (applicationProcessSection) {
      sections.push(applicationProcessSection);
    }
  }

  // Add remaining standard sections
  sections.push(createChallengeSection(grant));
  sections.push(createSolutionSection());
  sections.push(createMarketSection());

  console.log('Created sections:', sections);
  return sections;
};
