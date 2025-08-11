
import React from "react";

const SecurityTrustSection = () => {
  const securityCards = [{
    title: "Trained on real grants",
    content: "Our model is trained on real grants. Our model is trained on real grants. Our model is trained on real grants."
  }, {
    title: "Trained on real grants",
    content: "Our model is trained on real grants. Our model is trained on real grants. Our model is trained on real grants."
  }, {
    title: "Trained on real grants",
    content: "Our model is trained on real grants. Our model is trained on real grants. Our model is trained on real grants."
  }, {
    title: "Trained on real grants",
    content: "Our model is trained on real grants. Our model is trained on real grants. Our model is trained on real grants."
  }, {
    title: "Trained on real grants",
    content: "Our model is trained on real grants. Our model is trained on real grants. Our model is trained on real grants."
  }, {
    title: "Trained on real grants",
    content: "Our model is trained on real grants. Our model is trained on real grants. Our model is trained on real grants."
  }];

  return (
    <div className="relative z-10 w-full py-24 px-6 bg-[#f0f1f3]">
      <div className="w-full max-w-6xl mx-auto">
        {/* Headline */}
        <div className="mb-16">
          <h2 className="font-['Source_Sans_3'] font-normal text-gray-900 text-left" style={{
            fontSize: 'clamp(32px, 6vw, 48px)',
            letterSpacing: '0.5px'
          }}>
            Security & Trust
          </h2>
        </div>

        {/* Security Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 grid-rows-auto">
          {securityCards.map((card, index) => (
            <div key={index} className="border border-[#CEC5F9] rounded bg-white p-10 flex flex-col h-full" tabIndex={0} role="region" aria-label={`Security feature: ${card.title}`}>
              {/* Card Title */}
              <h3 className="font-['Source_Sans_3'] font-normal type-title text-zinc-900 mb-4 leading-[1.25] text-left md:text-left">
                {card.title}
              </h3>
              
              {/* Card Content */}
              <p className="font-['Source_Sans_3'] type-secondary text-zinc-700 leading-[1.5] flex-1 text-left md:text-left" style={{
                maxWidth: '60ch'
              }}>
                {card.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityTrustSection;
