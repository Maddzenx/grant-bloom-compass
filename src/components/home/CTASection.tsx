
import React from "react";

const CTASection = () => {
  return (
    <div className="relative z-10 w-full py-32 pb-28 px-6 bg-[#F0F1F3]" id="cta-section" style={{ scrollMarginTop: '6rem' }}>
      <div className="w-full max-w-6xl mx-auto text-center">
        {/* Primary Headline */}
        <h2 
          className="font-[Basic] font-normal text-gray-900 mb-12 leading-[1.15]"
          style={{ fontSize: 'clamp(42px, 6vw, 68px)' }}
        >
          Try it yourself!
        </h2>

        {/* CTA Button */}
        <div className="mb-16">
          <button
            className="bg-[#7D54F4] hover:bg-[#6a40f2] text-white font-[Basic] font-medium px-12 py-4 rounded-full transition-all duration-200 hover:shadow-lg"
            style={{ 
              fontSize: '22px',
              padding: '1.1rem 3.2rem',
              boxShadow: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 3px 6px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Start for free
          </button>
        </div>

        {/* Secondary Contact Line */}
        <div className="mb-8">
          <p 
            className="font-[Basic] font-normal leading-[1.4] mb-2"
            style={{ 
              fontSize: 'clamp(18px, 4.5vw, 24px)',
              color: '#78797A'
            }}
          >
            More questions?
          </p>
          <p 
            className="font-[Basic] font-normal leading-[1.4]"
            style={{ 
              fontSize: 'clamp(18px, 4.5vw, 24px)',
              color: '#78797A'
            }}
          >
            Contact us at{' '}
            <a 
              href="mailto:graigent@graigent.com"
              className="hover:underline transition-colors duration-200"
              style={{ color: '#78797A' }}
            >
              graigent@graigent.com
            </a>
          </p>
        </div>

        {/* Brand Mark */}
        <div className="mt-8">
          <div 
            className="font-[Basic] font-normal inline-block"
            style={{ fontSize: 'clamp(36px, 5vw, 46px)' }}
            role="img"
            aria-label="Graigent logo"
          >
            <span className="text-black">gr</span>
            <span style={{ color: '#8162F4' }}>ai</span>
            <span className="text-black">gent</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
