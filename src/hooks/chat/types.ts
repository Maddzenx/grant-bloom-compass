
import { Grant } from '@/types/grant';

export interface ApplicationDraft {
  sections: Record<string, string>;
  wordCount: number;
  completionStatus: number;
}

export interface QuestionObject {
  criterion: string;
  question: string;
  mandatory: boolean;
}

export interface ConversationState {
  grantData: Grant | null;
  userMaterials: string[];
  hardConstraints: Record<string, any>;
  softPreferences: Record<string, any>;
  collectedAnswers: Record<string, any>;
  currentQuestions: QuestionObject[];
  isComplete: boolean;
  language: 'sv' | 'en';
}

// Re-export Grant type for convenience
export type { Grant } from '@/types/grant';
