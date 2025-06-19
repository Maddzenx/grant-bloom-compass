
import { Section } from "@/types/businessPlan";
import { createInputField, createTextareaField } from "./fieldCreators";
import { Grant } from "@/types/grant";

export const createCompanySection = (grant?: Grant): Section => ({
  id: "foretaget",
  title: "Företaget",
  isExpanded: true,
  isCompleted: false,
  completionPercentage: 0,
  fields: [
    createInputField("org_number", "Organisationsnummer", "XXXXXX-XXXX"),
    createInputField("reg_address", "Registrerad adress", "Gatuadress, postnummer, ort"),
    createInputField("antal_anstallda", "Antal anställda", "Antal heltidsekvivalenter"),
    createInputField("omsattning_2022", "Omsättning (2022, 2023)", "Belopp i SEK för de senaste två åren"),
    createInputField("omsattning_result", "Resultat (2022, 2023)", "Resultat i SEK för de senaste två åren"),
    createTextareaField(
      "beskrivning",
      grant 
        ? `Beskriv kortfattat företagets verksamhet för ${grant.title}` 
        : "Beskriv kortfattat företagets verksamhet",
      grant 
        ? `Anpassa beskrivningen till ${grant.organization}s krav för ${grant.title}. Inkludera hur ni uppfyller eventuella branschkrav.`
        : "Beskriv företagets verksamhet, produkter och finansiering samt övergripande mål på 5-10 års sikt."
    )
  ]
});

export const createChallengeSection = (grant?: Grant): Section => ({
  id: "utmaning",
  title: "Utmaning och behov",
  isExpanded: true,
  isCompleted: false,
  completionPercentage: 0,
  fields: [
    createTextareaField(
      "utmaning_beskrivning",
      grant 
        ? `Beskriv den utmaning som ${grant.title} ska adressera`
        : "Beskriv den utmaning och det behov som projektet adresserar",
      "Vilka är behoven? Vad har ni gjort för att undersöka dem?"
    )
  ]
});

export const createSolutionSection = (): Section => ({
  id: "losning",
  title: "Lösning och innovation",
  isExpanded: true,
  isCompleted: false,
  completionPercentage: 0,
  fields: [
    createTextareaField(
      "losning_beskrivning",
      "Beskriv den innovativa lösning som ska utvecklas",
      "Vad är nytt med er lösning? Hur skiljer den sig från befintliga alternativ?"
    ),
    createTextareaField(
      "teknisk_genomforbarhet",
      "Teknisk genomförbarhet",
      "Beskriv den tekniska genomförbarheten och eventuella risker",
      false
    )
  ]
});

export const createMarketSection = (): Section => ({
  id: "marknad",
  title: "Marknad och kommersialisering",
  isExpanded: true,
  isCompleted: false,
  completionPercentage: 0,
  fields: [
    createTextareaField(
      "marknad_beskrivning",
      "Marknadsanalys",
      "Beskriv målmarknaden nationellt och internationellt"
    ),
    createTextareaField(
      "kommersiell_strategi",
      "Kommersialiseringsstrategi",
      "Hur ska lösningen kommersialiseras och nå marknaden?"
    )
  ]
});
