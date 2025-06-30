
import { Grant } from '@/types/grant';
import { QuestionObject } from './types';
import { hasAnswer } from './utils';

export const analyzeMissingInformation = (
  grantData: Grant,
  collectedAnswers: Record<string, any>,
  userMaterials: string[],
  language: 'sv' | 'en'
): Array<{criterion: string, question: string, mandatory: boolean}> => {
  const missing = [];

  // Essential project information
  if (!hasAnswer('projectDescription', collectedAnswers, userMaterials)) {
    missing.push({
      criterion: 'project_description',
      question: language === 'sv' 
        ? 'Beskriv kort ditt projekt och dess huvudsakliga mål.'
        : 'Briefly describe your project and its main objectives.',
      mandatory: true
    });
  }

  if (!hasAnswer('methodology', collectedAnswers, userMaterials)) {
    missing.push({
      criterion: 'methodology',
      question: language === 'sv'
        ? 'Vilken metodik eller tillvägagångssätt kommer ni att använda?'
        : 'What methodology or approach will you use?',
      mandatory: true
    });
  }

  if (!hasAnswer('budget', collectedAnswers, userMaterials)) {
    missing.push({
      criterion: 'budget',
      question: language === 'sv'
        ? 'Vad är er preliminära budget och hur planerar ni att använda medlen?'
        : 'What is your preliminary budget and how do you plan to use the funds?',
      mandatory: true
    });
  }

  if (!hasAnswer('team', collectedAnswers, userMaterials)) {
    missing.push({
      criterion: 'team_qualifications',
      question: language === 'sv'
        ? 'Vilka är teammedlemmarna och deras relevanta kvalifikationer?'
        : 'Who are the team members and their relevant qualifications?',
      mandatory: false
    });
  }

  if (!hasAnswer('timeline', collectedAnswers, userMaterials)) {
    missing.push({
      criterion: 'timeline',
      question: language === 'sv'
        ? 'Vilken är er förväntade tidsplan för projektet?'
        : 'What is your expected timeline for the project?',
      mandatory: false
    });
  }

  if (!hasAnswer('impact', collectedAnswers, userMaterials)) {
    missing.push({
      criterion: 'expected_impact',
      question: language === 'sv'
        ? 'Vilken påverkan förväntar ni er att projektet kommer att ha?'
        : 'What impact do you expect the project to have?',
      mandatory: false
    });
  }

  return missing;
};

export const formatQuestionsForUser = (questions: QuestionObject[], language: 'sv' | 'en'): string => {
  const header = language === 'sv' ? 'Jag behöver lite mer information:' : 'I need some more information:';
  const questionList = questions.map((q, index) => 
    `${index + 1}. ${q.question} ${q.mandatory ? (language === 'sv' ? '(obligatorisk)' : '(required)') : ''}`
  ).join('\n\n');
  
  return `${header}\n\n${questionList}`;
};
