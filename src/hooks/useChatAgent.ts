
import { useState, useCallback, useEffect } from 'react';
import { Grant } from '@/types/grant';
import { Message } from '@/components/chat/ChatMessage';
import { useToast } from '@/hooks/use-toast';

export interface ApplicationDraft {
  sections: Record<string, string>;
  wordCount: number;
  completionStatus: number;
}

interface ConversationState {
  currentStep: number;
  collectedInfo: Record<string, any>;
  questions: string[];
}

export const useChatAgent = (grant: Grant | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [applicationDraft, setApplicationDraft] = useState<ApplicationDraft | null>(null);
  const [isDraftReady, setIsDraftReady] = useState(false);
  const [conversationState, setConversationState] = useState<ConversationState>({
    currentStep: 0,
    collectedInfo: {},
    questions: []
  });
  const { toast } = useToast();

  // Initialize conversation with welcome message
  useEffect(() => {
    if (grant && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `Hej! Jag är din AI-assistent som hjälper dig att skriva en ansökan för "${grant.title}" från ${grant.organization}.\n\nJag kommer att ställa några frågor för att samla in den information som behövs för din ansökan. Vi börjar med grundläggande information om ditt projekt.\n\nKan du berätta kort om ditt projekt och vad du vill uppnå?`,
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage]);
      
      // Set up the conversation flow
      setConversationState({
        currentStep: 0,
        collectedInfo: { grant: grant },
        questions: [
          "Kan du berätta kort om ditt projekt och vad du vill uppnå?",
          "Vilken utmaning eller problem löser ditt projekt?",
          "Vad är målet med projektet och vilka resultat förväntar du dig?",
          "Vilken är din målgrupp och hur kommer de att gynnas?",
          "Vilka resurser och kompetenser har ni för att genomföra projektet?",
          "Hur passar ert projekt in i bidragets syfte och kriterier?",
          "Vilken är er budget och hur planerar ni att använda medlen?"
        ]
      });
    }
  }, [grant, messages.length]);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Store user input
    const updatedInfo = {
      ...conversationState.collectedInfo,
      [`step_${conversationState.currentStep}`]: content
    };

    // Simulate AI thinking time
    setTimeout(async () => {
      const nextStep = conversationState.currentStep + 1;
      let assistantResponse = '';

      if (nextStep < conversationState.questions.length) {
        // Continue with next question
        assistantResponse = `Tack för den informationen! ${conversationState.questions[nextStep]}`;
        
        setConversationState(prev => ({
          ...prev,
          currentStep: nextStep,
          collectedInfo: updatedInfo
        }));
      } else {
        // All questions answered, generate draft
        assistantResponse = "Fantastiskt! Jag har nu all information jag behöver. Låt mig skapa ett utkast av din ansökan baserat på vårt samtal. Detta kan ta en stund...";
        
        // Generate application draft
        setTimeout(() => {
          generateApplicationDraft(updatedInfo);
        }, 2000);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: assistantResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay for realistic feel

  }, [conversationState]);

  const generateApplicationDraft = useCallback((collectedInfo: Record<string, any>) => {
    // Simulate draft generation
    setTimeout(() => {
      const draft: ApplicationDraft = {
        sections: {
          projektbeskrivning: collectedInfo.step_0 || '',
          problemformulering: collectedInfo.step_1 || '',
          mal_och_resultat: collectedInfo.step_2 || '',
          malgrupp: collectedInfo.step_3 || '',
          resurser_och_kompetens: collectedInfo.step_4 || '',
          relevans: collectedInfo.step_5 || '',
          budget: collectedInfo.step_6 || ''
        },
        wordCount: Object.values(collectedInfo).join(' ').split(' ').length,
        completionStatus: 85
      };

      setApplicationDraft(draft);
      setIsDraftReady(true);

      const draftReadyMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: "🎉 Ditt ansökningsutkast är klart! Du kan nu förhandsgranska det i panelen till höger eller exportera det som en fil. Behöver du göra några ändringar eller har du frågor om innehållet?",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, draftReadyMessage]);
      setIsTyping(false);
    }, 3000);
  }, []);

  const exportDraft = useCallback(() => {
    if (!applicationDraft || !grant) return;

    const draftText = Object.entries(applicationDraft.sections)
      .map(([section, content]) => `${section.toUpperCase()}\n${content}\n\n`)
      .join('');

    const blob = new Blob([draftText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ansökan_${grant.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Utkast exporterat",
      description: "Din ansökan har laddats ner som en textfil."
    });
  }, [applicationDraft, grant, toast]);

  return {
    messages,
    isTyping,
    applicationDraft,
    isDraftReady,
    sendMessage,
    exportDraft
  };
};
