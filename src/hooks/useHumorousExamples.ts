import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Fallback examples in case API call fails
const FALLBACK_EXAMPLES = [
  'Vi är ett konsortium av pirater som vill expandera vår verksamhet till att sälja krabbor på lokala loppmarknader',
  'Vi är en forskningsgrupp som studerar varför katter alltid landar på sina fötter och vill utveckla detta till fallskärmsteknologi',
  'Vi är ett startup som utvecklar AI-assistenter för att hjälpa plantor att nätverka med varandra',
  'Vi är ett team av ex-cirkusartister som vill revolutionera byggbranschen med akrobatisk takläggning',
  'Vi är en grupp pensionerade vikingar som vill starta ett miljövänligt skäggolje-imperium',
  'Vi är ett kollektiv av professionella gäspare som forskar om smittsamma gäspningar för stressreduktion'
];

export const useHumorousExamples = () => {
  const [example, setExample] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRandomFallbackExample = () => {
    const randomIndex = Math.floor(Math.random() * FALLBACK_EXAMPLES.length);
    return FALLBACK_EXAMPLES[randomIndex];
  };

  const generateExample = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🎭 Generating humorous example...');
      
      const { data, error } = await supabase.functions.invoke('generate-humorous-example', {
        body: {}
      });

      if (error) {
        console.error('Error generating humorous example:', error);
        setError(error.message);
        // Use fallback example
        const fallbackExample = getRandomFallbackExample();
        setExample(fallbackExample);
        console.log('🎭 Using fallback example:', fallbackExample);
        return;
      }

      if (data && data.example) {
        console.log('✅ Generated humorous example:', data.example);
        setExample(data.example);
      } else {
        // No example returned, use fallback
        const fallbackExample = getRandomFallbackExample();
        setExample(fallbackExample);
        console.log('🎭 No example returned, using fallback:', fallbackExample);
      }
    } catch (err) {
      console.error('Error generating humorous example:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Use fallback example
      const fallbackExample = getRandomFallbackExample();
      setExample(fallbackExample);
      console.log('🎭 Using fallback example due to error:', fallbackExample);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate example on mount
  useEffect(() => {
    generateExample();
  }, []);

  return {
    example,
    isLoading,
    error,
    generateExample
  };
}; 