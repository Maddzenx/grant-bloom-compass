import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Fallback messages in case API call fails
const FALLBACK_MESSAGES = [
  "🔍 Letar igenom alla bidrag som om det vore en skattjakt...",
  "☕ Tar en snabb fika medan AI:n kör på högvarv...",
  "🧐 Analyserar bidrag som om det vore hem-bak-recept...",
  "📊 Räknar på siffror medan katten sitter på tangentbordet...",
  "🎯 Matchar din förfrågan som en professionell cupid...",
  "✨ Polerar resultaten innan de presenteras..."
];

export const useSearchStatusMessages = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMessages = useCallback(async (searchQuery: string): Promise<string[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🎭 Generating search status messages for query:', searchQuery);
      
      const { data, error } = await supabase.functions.invoke('generate-search-status-messages', {
        body: { query: searchQuery }
      });

      if (error) {
        console.error('Error generating search status messages:', error);
        setError(error.message);
        setMessages(FALLBACK_MESSAGES);
        return FALLBACK_MESSAGES;
      }

      if (data && data.messages && Array.isArray(data.messages)) {
        console.log('✅ Generated search status messages:', data.messages);
        setMessages(data.messages);
        return data.messages;
      } else {
        // No messages returned, use fallback
        console.log('🎭 No messages returned, using fallback');
        setMessages(FALLBACK_MESSAGES);
        return FALLBACK_MESSAGES;
      }
    } catch (err) {
      console.error('Error generating search status messages:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setMessages(FALLBACK_MESSAGES);
      return FALLBACK_MESSAGES;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    generateMessages,
    isLoading,
    error
  };
}; 