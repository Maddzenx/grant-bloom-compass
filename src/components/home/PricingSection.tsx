
import React from "react";

const PricingSection = () => {
  const plans = [
    {
      name: "Free Plan",
      price: "0 SEK",
      background: "#D7CFFC",
      features: [
        "See all active grants",
        "See all active grants"
      ]
    },
    {
      name: "Standard Plan", 
      price: "499 SEK",
      background: "#EEE3EA",
      features: [
        "See all active grants",
        "See all active grants"
      ]
    },
    {
      name: "Custom Plan",
      price: "X SEK", 
      background: "#E8FCBD",
      features: [
        "See all active grants",
        "See all active grants"
      ]
    }
  ];

  return (
    <div className="relative z-10 w-full py-28 pb-24 px-6 bg-[#F0F1F3]">
      <div className="w-full max-w-6xl mx-auto">
        {/* Headline with highlighted "Pri" */}
        <div className="text-center mb-16">
          <h2 className="font-['Source_Sans_3'] font-normal text-gray-900 leading-[1.15]"
            style={{ fontSize: 'clamp(32px, 6vw, 48px)' }}>
            Enkla priser för alla
          </h2>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {/* Free Plan */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="font-['Source_Sans_3'] font-normal text-[28px] text-gray-900 mb-6">
              Gratis
            </h3>
            <div className="mb-6">
              <div className="font-['Source_Sans_3'] font-semibold text-[38px] text-gray-900 leading-tight">
                $0
              </div>
              <div className="font-['Source_Sans_3'] font-normal text-[24px] text-gray-900">
                /månad
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="font-['Source_Sans_3'] text-[18px] text-gray-800 opacity-80">
                  Obegränsade sökningar
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="font-['Source_Sans_3'] text-[18px] text-gray-800 opacity-80">
                  AI-matchning
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="font-['Source_Sans_3'] text-[18px] text-gray-800 opacity-80">
                  Grundläggande support
                </span>
              </li>
            </ul>
            <button 
              className="bg-[#7D54F4] hover:bg-[#6a40f2] text-white font-['Source_Sans_3'] font-medium text-[20px] px-10 py-4 rounded-full transition-colors duration-200 w-full"
            >
              Kom igång gratis
            </button>
          </div>
          {plans.map((plan, index) => (
            <div 
              key={index}
              className="w-full max-w-[360px] border-2 border-white rounded-xl p-12 pb-10 text-center"
              style={{ backgroundColor: plan.background }}
            >
              {/* Plan Name */}
              <h3 className="font-['Source_Sans_3'] font-normal text-[28px] text-gray-900 mb-6">
                {plan.name}
              </h3>
              
              {/* Price */}
              <div className="mb-8">
                <div className="font-['Source_Sans_3'] font-semibold text-[38px] text-gray-900 leading-tight">
                  {plan.price}
                </div>
                <div className="font-['Source_Sans_3'] font-normal text-[24px] text-gray-900">
                  /month
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-3 mb-10 text-left">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <span 
                      className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
                      style={{ backgroundColor: '#7D54F4' }}
                      aria-hidden="true"
                    />
                    <span className="font-['Source_Sans_3'] text-[18px] text-gray-800 opacity-80">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Subscribe Button */}
              <button 
                className="bg-[#7D54F4] hover:bg-[#6a40f2] text-white font-['Source_Sans_3'] font-medium text-[20px] px-10 py-4 rounded-full transition-colors duration-200 w-full"
                style={{ borderRadius: '999px' }}
              >
                Subscribe
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
