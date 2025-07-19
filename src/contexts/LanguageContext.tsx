
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'sv';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Translation dictionaries
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.discover': 'Discover grants',
    'nav.saved': 'Saved grants',
    
    // Hero Section
    'hero.title': '"I like writing grants!" – said no one ever.',
    'hero.subtitle': 'Get matched with grants and drafts by chatting with AI',
    'hero.findGrants': 'Find grants',
    
    // Chat Input
    'chat.placeholder': 'Type your question...',
    'chat.startRecording': 'Start voice recording',
    'chat.stopRecording': 'Stop recording',
    'chat.uploadFile': 'Upload file',
    
    // Organization tabs
    'org.vinnova': 'Vinnova',
    'org.formas': 'Formas',
    'org.tillvaxtverket': 'Tillväxtverket',
    'org.energimyndigheten': 'Energimyndigheten',
    'org.vgr': 'VGR',
    'org.eu': 'EU',
    'org.vetenskapsradet': 'Vetenskapsrådet',
    
    // Video Demo
    'demo.title': 'Video on how the tool works',
    
    // Metrics Section
    'metrics.title': 'It\'s like AI agents and Grants had a baby',
    'metrics.dataPrivacy': 'Your data is never shared with third parties',
    'metrics.timeSave': 'Save time up to',
    'metrics.efficiency': 'Efficiency increase',
    
    // Security Section
    'security.title': 'Security & Trust',
    'security.cardTitle': 'Trained on real grants',
    'security.cardContent': 'Our model is trained on real grants. Our model is trained on real grants. Our model is trained on real grants.',
    
    // Testimonials
    'testimonials.title': 'Our wall of fame 💜',
    'testimonials.quote': 'The Firecrawl team ships. I wanted types for their node SDK, and less than an hour later, I got them.',
    
    // Pricing
    'pricing.title': 'Pricing',
    'pricing.freePlan': 'Free Plan',
    'pricing.standardPlan': 'Standard Plan',
    'pricing.customPlan': 'Custom Plan',
    'pricing.month': '/month',
    'pricing.feature': 'See all active grants',
    'pricing.subscribe': 'Subscribe',
    
    // FAQ
    'faq.title': 'Questions & Answers',
    'faq.howWorks': 'How does this work?',
    'faq.howWorksAnswer': 'Our platform uses advanced AI technology to match you with relevant grants based on your organization\'s profile and needs. Simply describe your project or upload your documents, and we\'ll find the best funding opportunities for you.',
    'faq.different': 'How is this different from other LLMs?',
    'faq.differentAnswer': 'Unlike general-purpose AI models, our system is specifically trained on grant databases and funding criteria. We understand the nuances of grant applications and can provide targeted matches with higher success rates.',
    'faq.whoCan': 'Who can benefit from using Graigent?',
    'faq.whoCanAnswer': 'Anyone can use it. Independent or academic researchers pushing the boundaries of knowledge. Early-stage and growth-stage startups turning bold ideas into scalable products or services.',
    'faq.accurate': 'How do I know it is accurate?',
    'faq.accurateAnswer': 'Our matching algorithm is continuously validated against successful grant applications. We provide confidence scores for each match and allow you to verify the criteria directly with the funding sources.',
    
    // CTA Section
    'cta.title': 'Try it yourself!',
    'cta.button': 'Start for free',
    'cta.questions': 'More questions?',
    'cta.contact': 'Contact us at',
    
    // Status Messages
    'status.recording': 'Recording...',
    'status.transcribing': 'Transcribing audio...',
    'status.uploading': 'Processing file...',
    'status.matching': 'Finding matching grants...',
    'status.loading': 'Loading grants...',
    'status.error': 'Error occurred during matching',
    
    // Grant Cards
    'grant.fundingAmount': 'Grant Amount',
    'grant.deadline': 'Application Deadline',
    'grant.organization': 'Organization',
    'grant.readMore': 'Read More',
    'grant.startApplication': 'Start Application',
    'grant.save': 'Save',
    'grant.saved': 'Saved',
    
    // Saved Grants
    'saved.dashboard': 'Dashboard',
    'saved.activeApplications': 'Active Applications',
    'saved.pendingReview': 'Pending Review',
    'saved.savedGrants': 'Saved Grants',
    'saved.noActive': 'No active applications.',
    'saved.noActiveDesc': 'Start working on applications to see them here.',
    'saved.noPending': 'No applications under review.',
    'saved.noPendingDesc': 'Submit applications to see them here.',
    'saved.noSaved': 'No saved grants.',
    'saved.noSavedDesc': 'Save grants that interest you to see them here.',
    'saved.edit': 'Edit',
    'saved.delete': 'Delete',
    'saved.deleteConfirm': 'Delete application',
    'saved.deleteMessage': 'Are you sure you want to delete this active application? This action cannot be undone.',
    'saved.cancel': 'Cancel',
    'saved.lastChange': 'Last change: Updated "Problem" section',
    'saved.lastEdited': 'Last edited',
    'saved.submitted': 'Submitted',
    'saved.saved': 'Saved',
    
    // Search
    'search.placeholder': 'Search',
    'search.selectGrant': 'Select a grant to view details',
    
    // Grant Details
    'details.whoCanApply': 'Who can apply',
    'details.qualifications': 'Qualifications:',
    'details.applicationProcess': 'Application Process',
    'details.evaluationCriteria': 'Evaluation Criteria',
    'details.fundingRules': 'Funding Rules',
    'details.importantDates': 'Important Dates',
    'details.contact': 'Contact',
    
    // Language Selector
    'lang.english': 'English',
    'lang.swedish': 'Svenska'
  },
  sv: {
    // Navigation
    'nav.home': 'Hem',
    'nav.discover': 'Upptäck bidrag',
    'nav.saved': 'Sparade bidrag',
    
    // Hero Section
    'hero.title': '"Jag älskar att skriva bidrag!"\n- sa ingen någonsin.',
    'hero.subtitle': 'Hitta rätt bidrag och få utkast med hjälp av AI.',
    'hero.findGrants': 'Hitta bidrag',
    
    // Chat Input
    'chat.placeholder': 'Skriv din fråga...',
    'chat.startRecording': 'Starta röstinspelning',
    'chat.stopRecording': 'Stoppa inspelning',
    'chat.uploadFile': 'Ladda upp fil',
    
    // Organization tabs
    'org.vinnova': 'Vinnova',
    'org.formas': 'Formas',
    'org.tillvaxtverket': 'Tillväxtverket',
    'org.energimyndigheten': 'Energimyndigheten',
    'org.vgr': 'VGR',
    'org.eu': 'EU',
    'org.vetenskapsradet': 'Vetenskapsrådet',
    
    // Video Demo
    'demo.title': 'Video på hur verktyget fungerar',
    
    // Metrics Section
    'metrics.title': 'Det är som om AI-agenter och bidrag fick ett barn',
    'metrics.dataPrivacy': 'Din data delas aldrig med tredje part',
    'metrics.timeSave': 'Spara tid upp till',
    'metrics.efficiency': 'Effektivitetsökning',
    
    // Security Section
    'security.title': 'Säkerhet & Förtroende',
    'security.cardTitle': 'Tränad på riktiga bidrag',
    'security.cardContent': 'Vår modell är tränad på riktiga bidrag. Vår modell är tränad på riktiga bidrag. Vår modell är tränad på riktiga bidrag.',
    
    // Testimonials
    'testimonials.title': 'Vår hall of fame 💜',
    'testimonials.quote': 'Firecrawl-teamet levererar. Jag ville ha typer för deras node SDK, och mindre än en timme senare fick jag dem.',
    
    // Pricing
    'pricing.title': 'Prissättning',
    'pricing.freePlan': 'Gratisplan',
    'pricing.standardPlan': 'Standardplan',
    'pricing.customPlan': 'Anpassad plan',
    'pricing.month': '/månad',
    'pricing.feature': 'Se alla aktiva bidrag',
    'pricing.subscribe': 'Prenumerera',
    
    // FAQ
    'faq.title': 'Frågor & Svar',
    'faq.howWorks': 'Hur fungerar detta?',
    'faq.howWorksAnswer': 'Vår plattform använder avancerad AI-teknik för att matcha dig med relevanta bidrag baserat på din organisations profil och behov. Beskriv helt enkelt ditt projekt eller ladda upp dina dokument, så hittar vi de bästa finansieringsmöjligheterna för dig.',
    'faq.different': 'Hur skiljer sig detta från andra LLM:er?',
    'faq.differentAnswer': 'Till skillnad från allmänna AI-modeller är vårt system specifikt tränat på bidragsdatabaser och finansieringskriterier. Vi förstår nyanserna i bidragsansökningar och kan ge riktade matchningar med högre framgångsfrekvens.',
    'faq.whoCan': 'Vem kan dra nytta av att använda Graigent?',
    'faq.whoCanAnswer': 'Vem som helst kan använda det. Oberoende eller akademiska forskare som driver kunskapsgränserna framåt. Tidiga och tillväxtfas-startups som förvandlar djärva idéer till skalbara produkter eller tjänster.',
    'faq.accurate': 'Hur vet jag att det är korrekt?',
    'faq.accurateAnswer': 'Vår matchningsalgoritm valideras kontinuerligt mot framgångsrika bidragsansökningar. Vi tillhandahåller konfidenspoäng för varje matchning och låter dig verifiera kriterierna direkt med finansieringskällorna.',
    
    // CTA Section
    'cta.title': 'Prova själv!',
    'cta.button': 'Börja gratis',
    'cta.questions': 'Fler frågor?',
    'cta.contact': 'Kontakta oss på',
    
    // Status Messages
    'status.recording': 'Spelar in...',
    'status.transcribing': 'Transkriberar ljud...',
    'status.uploading': 'Bearbetar fil...',
    'status.matching': 'Hittar matchande bidrag...',
    'status.loading': 'Laddar bidrag...',
    'status.error': 'Ett fel uppstod under matchning',
    
    // Grant Cards
    'grant.fundingAmount': 'Bidragsbelopp',
    'grant.deadline': 'Ansökningsdeadline',
    'grant.organization': 'Organisation',
    'grant.readMore': 'Läs mer',
    'grant.startApplication': 'Starta ansökan',
    'grant.save': 'Spara',
    'grant.saved': 'Sparad',
    
    // Saved Grants
    'saved.dashboard': 'Dashboard',
    'saved.activeApplications': 'Aktiva ansökningar',
    'saved.pendingReview': 'Väntar på granskning',
    'saved.savedGrants': 'Sparade bidrag',
    'saved.noActive': 'Inga aktiva ansökningar.',
    'saved.noActiveDesc': 'Börja arbeta med ansökningar för att se dem här.',
    'saved.noPending': 'Inga ansökningar under granskning.',
    'saved.noPendingDesc': 'Skicka in ansökningar för att se dem här.',
    'saved.noSaved': 'Inga sparade bidrag.',
    'saved.noSavedDesc': 'Spara bidrag som intresserar dig för att se dem här.',
    'saved.edit': 'Redigera',
    'saved.delete': 'Ta bort',
    'saved.deleteConfirm': 'Ta bort ansökan',
    'saved.deleteMessage': 'Är du säker på att du vill ta bort denna aktiva ansökan? Denna åtgärd kan inte ångras.',
    'saved.cancel': 'Avbryt',
    'saved.lastChange': 'Senaste ändring: Uppdaterade "Problem" avsnitt',
    'saved.lastEdited': 'Senast redigerad',
    'saved.submitted': 'Skickad',
    'saved.saved': 'Sparad',
    
    // Search
    'search.placeholder': 'Sök',
    'search.selectGrant': 'Välj ett bidrag för att visa detaljer',
    
    // Grant Details
    'details.whoCanApply': 'Vem kan söka',
    'details.qualifications': 'Kvalifikationer:',
    'details.applicationProcess': 'Ansökningsprocess',
    'details.evaluationCriteria': 'Utvärderingskriterier',
    'details.fundingRules': 'Finansieringsregler',
    'details.importantDates': 'Viktiga datum',
    'details.contact': 'Kontakt',
    
    // Language Selector
    'lang.english': 'English',
    'lang.swedish': 'Svenska'
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('sv'); // Default to Swedish

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
