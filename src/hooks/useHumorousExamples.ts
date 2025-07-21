import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Fallback examples in case API call fails
const FALLBACK_EXAMPLES = [
  'Vi är ett konsortium av pirater som vill expandera vår verksamhet till att sälja krabbor på lokala loppmarknader',
  'Vi är en forskningsgrupp som studerar varför katter alltid landar på sina fötter och vill utveckla detta till fallskärmsteknologi',
  'Vi är ett startup som utvecklar AI-assistenter för att hjälpa plantor att nätverka med varandra',
  'Vi är ett team av ex-cirkusartister som vill revolutionera byggbranschen med akrobatisk takläggning',
  'Vi är en grupp pensionerade vikingar som vill starta ett miljövänligt skäggolje-imperium',
  'Vi är ett kollektiv av professionella gäspare som forskar om smittsamma gäspningar för stressreduktion',
  'Vi är ett företag av tidigare operasångare som utvecklar ljudisolering med hjälp av klassisk musik',
  'Vi är en kooperativ av forna trollkarlar som forskar om hur man får sockor att aldrig försvinna i tvättmaskinen',
  'Vi är ett startup som tränar myror att leverera minipaket inom stadskärnan för miljövänlig transport',
  'Vi är en forskningsgrupp som utvecklar översättningsappar för att förstå vad hundar egentligen menar',
  'Vi är ett kollektiv av pensionerade astronauter som odlar grönsaker i tyngdlöshetssimulering',
  'Vi är en grupp före detta mimar som revolutionerar ljudlös kommunikationsteknologi för bibliotek',
  'Vi är ett företag av ex-detektiver som utvecklar AI för att hitta försvunna nycklar och fjärrkontroller',
  'Vi är en kooperativ av tidigare schackspelare som designar möbler som bara kan monteras med strategiskt tänkande',
  'Vi är ett startup som tränar katter att sortera återvinning för att minska miljöpåverkan',
  'Vi är en forskningsgrupp som studerar varför toast alltid landar på smörsidan och vill använda detta för energiproduktion',
  'Vi är ett kollektiv av före detta skräddare som utvecklar självläkande kläder med nanoteknik',
  'Vi är en grupp pensionerade brandmän som forskar om hur man kan släcka eld med musik istället för vatten',
  'Vi är ett företag av tidigare djurtränare som utvecklar appar för att kommunicera med husdjur via emojis',
  'Vi är en kooperativ av ex-bagare som forskar om hur man kan baka bröd som aldrig blir gammalt',
  'Vi är ett startup som tränar fiskar att rena vattenreservoarer genom avancerad simteknik',
  'Vi är en forskningsgrupp som utvecklar robotar som kan klappa kuddar perfekt för hotellbranschen',
  'Vi är ett kollektiv av tidigare meteorologer som förutspår humör baserat på lufttryck och temperatur',
  'Vi är en grupp pensionerade clowner som revolutionerar terapimetoder genom strategisk humor',
  'Vi är ett företag av ex-bibliotekarie som utvecklar AI som kan tysta folk på avstånd utan att säga "schh"',
  'Vi är en kooperativ av tidigare fotografer som forskar om hur man tar selfies utan att se narcissistisk ut',
  'Vi är ett startup som tränar bin att producera honung med olika smaker baserat på kundens önskemål'
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