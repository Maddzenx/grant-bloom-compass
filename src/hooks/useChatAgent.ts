
import { useState, useCallback, useEffect } from 'react';
import { Grant } from '@/types/grant';
import { Message } from '@/components/chat/ChatMessage';
import { useToast } from '@/hooks/use-toast';
import { ApplicationDraft, ConversationState, QuestionObject } from './chat/types';
import { detectLanguage, checkDeadlineUrgency } from './chat/utils';
import { analyzeMissingInformation, formatQuestionsForUser } from './chat/questionGenerator';
import { generateApplicationDraft } from './chat/draftGenerator';

export type { ApplicationDraft } from './chat/types';

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
    // Extract hard constraints - mapping to correct Grant properties
    const hardConstraints = {
      qualifications: grantData.qualifications, // using qualifications instead of eligibility
      closingDate: grantData.deadline, // using deadline instead of applicationClosingDate
      fundingAmount: grantData.fundingAmount, // using fundingAmount instead of maxGrantPerProject
      // Note: currency and projectDurationMonths don't exist in current Grant type
    };

    // Extract soft preferences - mapping to correct Grant properties
    const softPreferences = {
      description: grantData.description,
      evaluationCriteria: grantData.evaluationCriteria,
      tags: grantData.tags, // using tags instead of keywords
      organization: grantData.organization,
      aboutGrant: grantData.aboutGrant,
      whoCanApply: grantData.whoCanApply
    };

    // Determine language (Swedish if description contains Swedish words)
    const language = detectLanguage(grantData.description || '');

    // Check for deadline pressure - using deadline property
    const isDeadlineImminent = checkDeadlineUrgency(grantData.deadline);

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
    const missingInfo = analyzeMissingInformation(grantData, collectedAnswers, userMaterials, language);

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
      handleGenerateApplicationDraft();
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

  const handleGenerateApplicationDraft = useCallback(() => {
    if (!conversationState.grantData) return;

    try {
      const draft = generateApplicationDraft(conversationState);
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
    } catch (error) {
      console.error('Error generating application draft:', error);
      setIsTyping(false);
    }
  }, [conversationState]);

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
