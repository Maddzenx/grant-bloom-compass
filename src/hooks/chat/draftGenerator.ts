
import { ApplicationDraft, ConversationState } from './types';

export const generateSection = (sectionType: string, content: string, language: 'sv' | 'en'): string => {
  // Simple content extraction based on section type
  const words = content.split(' ').slice(0, 100); // Limit for demo
  return words.join(' ') + '...';
};

export const generateApplicationDraft = (conversationState: ConversationState): ApplicationDraft => {
  if (!conversationState.grantData) {
    throw new Error('Grant data is required to generate draft');
  }

  // Create application draft based on collected information
  const allContent = [
    ...conversationState.userMaterials,
    ...Object.values(conversationState.collectedAnswers)
  ].join(' ');

  const draft: ApplicationDraft = {
    sections: {
      abstract: generateSection('abstract', allContent, conversationState.language),
      objectives: generateSection('objectives', allContent, conversationState.language),
      methodology: generateSection('methodology', allContent, conversationState.language),
      budget: generateSection('budget', allContent, conversationState.language),
      timeline: generateSection('timeline', allContent, conversationState.language),
      team: generateSection('team', allContent, conversationState.language),
      impact: generateSection('impact', allContent, conversationState.language)
    },
    wordCount: allContent.split(' ').length,
    completionStatus: 90
  };

  return draft;
};
