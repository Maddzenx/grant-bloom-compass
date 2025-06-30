
import { useState, useCallback, useEffect } from 'react';
import { Grant } from '@/types/grant';
import { Message } from '@/components/chat/ChatMessage';
import { useToast } from '@/hooks/use-toast';

export interface ApplicationDraft {
  sections: Record<string, string>;
  wordCount: number;
  completionStatus: number;
}

interface QuestionObject {
  criterion: string;
  question: string;
  mandatory: boolean;
}

interface ConversationState {
  grantData: Grant | null;
  userMaterials: string[];
  hardConstraints: Record<string, any>;
  softPreferences: Record<string, any>;
  collectedAnswers: Record<string, any>;
  currentQuestions: QuestionObject[];
  isComplete: boolean;
  language: 'sv' | 'en';
}

export const useChatAgent = (grant: Grant | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [applicationDraft, setApplicationDraft] = useState<ApplicationDraft | null>(null);
  const [isDraftReady, setIsDraftReady] = useState(false);
  const [conversationState, setConversationState] = useState<ConversationState>({
    grantData: null,
    userMaterials: [],
    hardConstraints: {},
    softPreferences: {},
    collectedAnswers: {},
    currentQuestions: [],
    isComplete: false,
    language: 'sv'
  });
  const { toast } = useToast();

  // Initialize conversation with grant analysis
  useEffect(() => {
    if (grant && messages.length === 0) {
      analyzeGrantAndInitiate(grant);
    }
  }, [grant, messages.length]);

  const analyzeGrantAndInitiate = useCallback((grantData: Grant) => {
    // Extract hard constraints
    const hardConstraints = {
      eligibility: grantData.eligibility,
      closingDate: grantData.applicationClosingDate,
      maxGrant: grantData.maxGrantPerProject,
      currency: grantData.currency,
      duration: grantData.projectDurationMonths
    };

    // Extract soft preferences
    const softPreferences = {
      description: grantData.description,
      evaluationCriteria: grantData.evaluationCriteria,
      keywords: grantData.keywords,
      organization: grantData.organization
    };

    // Determine language (Swedish if description contains Swedish words)
    const language = detectLanguage(grantData.description || '');

    // Check for deadline pressure
    const isDeadlineImminent = checkDeadlineUrgency(grantData.applicationClosingDate);

    // Generate initial welcome message
    const welcomeContent = language === 'sv' 
      ? `Hej! Jag är din Grant Application Copilot för "${grantData.title}" från ${grantData.organization}.\n\n${isDeadlineImminent ? '⚠️ **Deadline nära - endast kritiska frågor kommer att ställas.**\n\n' : ''}Jag kommer att ställa några riktade frågor för att samla in nödvändig information för din ansökan. Låt oss börja!`
      : `Hello! I'm your Grant Application Copilot for "${grantData.title}" from ${grantData.organization}.\n\n${isDeadlineImminent ? '⚠️ **Deadline imminent—only critical questions will be asked.**\n\n' : ''}I'll ask targeted questions to gather the necessary information for your application. Let's begin!`;

    const welcomeMessage: Message = {
      id: Date.now().toString(),
      type: 'assistant',
      content: welcomeContent,
      timestamp: new Date()
    };

    setMessages([welcomeMessage]);
    
    setConversationState({
      grantData,
      userMaterials: [],
      hardConstraints,
      softPreferences,
      collectedAnswers: {},
      currentQuestions: [],
      isComplete: false,
      language
    });

    // Generate first set of questions
    setTimeout(() => {
      generateNextQuestions(grantData, hardConstraints, softPreferences, {}, []);
    }, 1000);
  }, []);

  const detectLanguage = (text: string): 'sv' | 'en' => {
    const swedishWords = ['och', 'för', 'att', 'med', 'av', 'på', 'är', 'som', 'den', 'det'];
    const words = text.toLowerCase().split(/\s+/);
    const swedishCount = words.filter(word => swedishWords.includes(word)).length;
    return swedishCount > words.length * 0.1 ? 'sv' : 'en';
  };

  const checkDeadlineUrgency = (closingDate?: string): boolean => {
    if (!closingDate) return false;
    const deadline = new Date(closingDate);
    const now = new Date();
    const hoursUntilDeadline = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilDeadline <= 48;
  };

  const generateNextQuestions = useCallback((
    grantData: Grant,
    hardConstraints: Record<string, any>,
    softPreferences: Record<string, any>,
    collectedAnswers: Record<string, any>,
    userMaterials: string[]
  ) => {
    const questions: QuestionObject[] = [];
    const language = conversationState.language;

    // Check what's still needed based on grant requirements
    const missingInfo = analyzeMissingInformation(grantData, collectedAnswers, userMaterials);

    if (missingInfo.length === 0) {
      // All information collected, proceed to draft
      setConversationState(prev => ({ ...prev, isComplete: true }));
      generateCompletionMessage(language);
      return;
    }

    // Generate up to 3 questions, prioritizing mandatory ones
    const prioritizedMissing = missingInfo
      .sort((a, b) => Number(b.mandatory) - Number(a.mandatory))
      .slice(0, 3);

    prioritizedMissing.forEach(item => {
      questions.push({
        criterion: item.criterion,
        question: item.question,
        mandatory: item.mandatory
      });
    });

    setConversationState(prev => ({ ...prev, currentQuestions: questions }));
    
    // Send questions to user
    const questionText = formatQuestionsForUser(questions, language);
    const assistantMessage: Message = {
      id: Date.now().toString(),
      type: 'assistant',
      content: questionText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
  }, [conversationState.language]);

  const analyzeMissingInformation = (
    grantData: Grant,
    collectedAnswers: Record<string, any>,
    userMaterials: string[]
  ): Array<{criterion: string, question: string, mandatory: boolean}> => {
    const missing = [];
    const language = conversationState.language;

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

  const hasAnswer = (topic: string, answers: Record<string, any>, materials: string[]): boolean => {
    // Check if topic is covered in collected answers or user materials
    return answers[topic] !== undefined || 
           materials.some(material => 
             material.toLowerCase().includes(topic.toLowerCase()) ||
             material.length > 100 // Assume substantial material might contain the answer
           );
  };

  const formatQuestionsForUser = (questions: QuestionObject[], language: 'sv' | 'en'): string => {
    const header = language === 'sv' ? 'Jag behöver lite mer information:' : 'I need some more information:';
    const questionList = questions.map((q, index) => 
      `${index + 1}. ${q.question} ${q.mandatory ? (language === 'sv' ? '(obligatorisk)' : '(required)') : ''}`
    ).join('\n\n');
    
    return `${header}\n\n${questionList}`;
  };

  const generateCompletionMessage = useCallback((language: 'sv' | 'en') => {
    const completionText = language === 'sv'
      ? 'Perfekt! Jag har nu all nödvändig information. Låt mig skapa ett första utkast av din ansökan...'
      : 'Perfect! I now have all the necessary information. Let me create a first draft of your application...';

    const completionMessage: Message = {
      id: Date.now().toString(),
      type: 'assistant',
      content: completionText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, completionMessage]);
    
    // Generate application draft
    setTimeout(() => {
      generateApplicationDraft();
    }, 2000);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Add user response to materials and answers
    const updatedMaterials = [...conversationState.userMaterials, content];
    const updatedAnswers = {
      ...conversationState.collectedAnswers,
      [`response_${Date.now()}`]: content
    };

    setConversationState(prev => ({
      ...prev,
      userMaterials: updatedMaterials,
      collectedAnswers: updatedAnswers
    }));

    // Analyze response and generate next questions or complete
    setTimeout(() => {
      if (conversationState.grantData) {
        generateNextQuestions(
          conversationState.grantData,
          conversationState.hardConstraints,
          conversationState.softPreferences,
          updatedAnswers,
          updatedMaterials
        );
      }
    }, 1000 + Math.random() * 1500);
  }, [conversationState, generateNextQuestions]);

  const generateApplicationDraft = useCallback(() => {
    if (!conversationState.grantData) return;

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

    setApplicationDraft(draft);
    setIsDraftReady(true);

    const draftReadyMessage: Message = {
      id: Date.now().toString(),
      type: 'assistant',
      content: conversationState.language === 'sv' 
        ? '🎉 Ditt ansökningsutkast är klart! Du kan nu förhandsgranska det eller exportera det. Behöver du göra några ändringar?'
        : '🎉 Your application draft is ready! You can now preview it or export it. Do you need any changes?',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, draftReadyMessage]);
    setIsTyping(false);
  }, [conversationState]);

  const generateSection = (sectionType: string, content: string, language: 'sv' | 'en'): string => {
    // Simple content extraction based on section type
    const words = content.split(' ').slice(0, 100); // Limit for demo
    return words.join(' ') + '...';
  };

  const exportDraft = useCallback(() => {
    if (!applicationDraft || !conversationState.grantData) return;

    const draftText = Object.entries(applicationDraft.sections)
      .map(([section, content]) => `${section.toUpperCase()}\n${content}\n\n`)
      .join('');

    const blob = new Blob([draftText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `application_${conversationState.grantData.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: conversationState.language === 'sv' ? "Utkast exporterat" : "Draft exported",
      description: conversationState.language === 'sv' 
        ? "Din ansökan har laddats ner som en textfil." 
        : "Your application has been downloaded as a text file."
    });
  }, [applicationDraft, conversationState, toast]);

  return {
    messages,
    isTyping,
    applicationDraft,
    isDraftReady,
    sendMessage,
    exportDraft
  };
};
