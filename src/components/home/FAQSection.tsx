
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQSection = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does this work?",
      answer: "Our platform uses advanced AI technology to match you with relevant grants based on your organization's profile and needs. Simply describe your project or upload your documents, and we'll find the best funding opportunities for you."
    },
    {
      question: "How is this different from other LLMs?",
      answer: "Unlike general-purpose AI models, our system is specifically trained on grant databases and funding criteria. We understand the nuances of grant applications and can provide targeted matches with higher success rates."
    },
    {
      question: "Who can benefit from using Graigent?",
      answer: "Anyone can use it. Independent or academic researchers pushing the boundaries of knowledge. Early-stage and growth-stage startups turning bold ideas into scalable products or services."
    },
    {
      question: "How do I know it is accurate?",
      answer: "Our matching algorithm is continuously validated against successful grant applications. We provide confidence scores for each match and allow you to verify the criteria directly with the funding sources."
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  const handleKeyPress = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleItem(index);
    }
  };

  return (
    <div className="relative z-10 w-full py-24 pb-20 px-6 bg-[#F0F1F3]">
      <div className="w-full max-w-6xl mx-auto">
        {/* Headline */}
        <div className="text-center mb-16">
          <h2 
            className="font-newsreader font-normal text-gray-900 leading-[1.2]" 
            style={{ fontSize: 'clamp(34px, 5vw, 54px)' }}
          >
            Questions & Answers
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-0">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-[#B8A8FF]">
              {/* Question Button */}
              <button
                onClick={() => toggleItem(index)}
                onKeyDown={(e) => handleKeyPress(e, index)}
                aria-expanded={openItem === index}
                aria-controls={`faq-answer-${index}`}
                className="w-full text-left py-6 flex items-center justify-between hover:bg-black hover:bg-opacity-5 transition-colors duration-200 focus:outline-none focus:bg-black focus:bg-opacity-5"
                style={{ minHeight: '32px' }}
              >
                <h3 
                  className="font-newsreader font-normal text-gray-900 pr-4 leading-[1.3]"
                  style={{ fontSize: 'clamp(20px, 4.5vw, 26px)' }}
                >
                  {faq.question}
                </h3>
                <ChevronDown 
                  className={`w-6 h-6 text-gray-600 transition-transform duration-250 ease-out flex-shrink-0 ${
                    openItem === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Answer Panel */}
              <div
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
                className={`overflow-hidden transition-all duration-300 ease-out ${
                  openItem === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
                style={{
                  transitionProperty: 'max-height, opacity',
                }}
              >
                <div className="pt-5 pb-8">
                  <p 
                    className="font-newsreader text-gray-800 leading-[1.55]"
                    style={{ 
                      fontSize: 'clamp(16px, 3vw, 18px)',
                      color: 'rgba(51, 51, 51, 0.8)'
                    }}
                  >
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
