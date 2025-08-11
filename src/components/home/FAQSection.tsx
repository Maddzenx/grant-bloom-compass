import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
const FAQSection = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);
  const faqs = [{
    question: "Hur hittar jag rätt bidrag för mitt projekt?",
    answer: "Verktyget analyserar ditt projekt och matchar det mot hundratals bidrag i realtid. Du behöver bara beskriva ditt projekt eller ladda upp relevanta dokument för att få personliga rekommendationer baserade på din organisations profil och specifika behov."
  }, {
    question: "Vilka typer av organisationer kan använda plattformen?",
    answer: "Bidragsprånget är designat för alla som söker finansiering, från startups och småföretag till forskningsinstitut, universitet, ideella organisationer och offentliga myndigheter. Vår plattform täcker både svenska och EU-bidrag för olika branscher och projekttyper."
  }, {
    question: "Hur mycket tid sparar jag jämfört med traditionell sökning?",
    answer: "Istället för att söka genom hundratals sidor och databaser manuellt kan du få relevanta matchningar på sekunder. Vår AI filtrerar bort irrelevanta bidrag och fokuserar på de som verkligen passar ditt projekt, vilket kan spara flera timmar per sökning."
  }, {
    question: "Är informationen uppdaterad och tillförlitlig?",
    answer: "Vi uppdaterar vår databas kontinuerligt med de senaste bidragen från officiella källor. Varje matchning inkluderar förtroendepoäng och direktlänkar till källorna så du alltid kan verifiera informationen."
  }, {
    question: "Är Bidragsprånget gratis att använda?",
    answer: "Ja, Bidragsprånget är helt gratis att använda. Du kan söka efter bidrag, få AI-matchningar och använda alla funktioner utan kostnad."
  }];
  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };
  const handleKeyPress = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleItem(index);
    }
  };
  return <div className="relative z-10 w-full py-24 pb-20 px-6 bg-inherit">
      <div className="w-full max-w-6xl mx-auto">
        {/* Headline */}
        <div className="text-center mb-16">
          <h2 className="font-newsreader font-normal text-gray-900 leading-[1.2]" style={{
          fontSize: 'clamp(34px, 5vw, 54px)'
        }}>
            Frågor & Svar
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-0">
          {faqs.map((faq, index) => <div key={index} className="border-b border-[#B8A8FF]">
              {/* Question Button */}
              <button onClick={() => toggleItem(index)} onKeyDown={e => handleKeyPress(e, index)} aria-expanded={openItem === index} aria-controls={`faq-answer-${index}`} className="w-full text-left py-6 flex items-center justify-between focus:outline-none" style={{
            minHeight: '32px'
          }}>
                <h3 className="font-newsreader font-normal text-gray-900 pr-4 leading-[1.3]" style={{
              fontSize: 'clamp(20px, 4.5vw, 26px)'
            }}>
                  {faq.question}
                </h3>
                <ChevronDown className={`w-6 h-6 text-gray-600 transition-transform duration-250 ease-out flex-shrink-0 ${openItem === index ? 'rotate-180' : ''}`} />
              </button>

              {/* Answer Panel */}
              <div id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} className={`overflow-hidden transition-all duration-300 ease-out ${openItem === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`} style={{
            transitionProperty: 'max-height, opacity'
          }}>
                <div className="pt-5 pb-8">
                  <p className="font-newsreader text-gray-800 leading-[1.55]" style={{
                fontSize: 'clamp(16px, 3vw, 18px)',
                color: 'rgba(51, 51, 51, 0.8)'
              }}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
};
export default FAQSection;