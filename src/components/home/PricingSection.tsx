
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
          <h2 className="font-newsreader font-normal text-gray-900 leading-[1.15]" 
              style={{ fontSize: 'clamp(38px, 6vw, 60px)' }}>
            <span className="relative inline-block">
              <span 
                className="absolute bg-[#D1F364] -z-10"
                style={{
                  width: '110%',
                  height: '70%',
                  bottom: '10%',
                  left: '4px',
                  transform: 'translateY(4px)'
                }}
                aria-hidden="true"
              />
              <span className="relative z-10">Pri</span>
            </span>
            cing
          </h2>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className="w-full max-w-[360px] border-2 border-white rounded-xl p-12 pb-10 text-center"
              style={{ backgroundColor: plan.background }}
            >
              {/* Plan Name */}
              <h3 className="font-newsreader font-normal text-[28px] text-gray-900 mb-6">
                {plan.name}
              </h3>
              
              {/* Price */}
              <div className="mb-8">
                <div className="font-newsreader font-semibold text-[38px] text-gray-900 leading-tight">
                  {plan.price}
                </div>
                <div className="font-newsreader font-normal text-[24px] text-gray-900">
                  /month
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-3 mb-10 text-left">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <span 
                      className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
                      style={{ backgroundColor: '#B3E93B' }}
                      aria-hidden="true"
                    />
                    <span className="font-newsreader text-[18px] text-gray-800 opacity-80">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Subscribe Button */}
              <button 
                className="bg-[#D1F364] hover:bg-[#C5E858] text-gray-900 font-newsreader font-medium text-[20px] px-10 py-4 rounded-full transition-colors duration-200 w-full"
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
