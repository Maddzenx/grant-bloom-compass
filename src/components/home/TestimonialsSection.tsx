
import React from "react";

const TestimonialsSection = () => {
  const testimonials = [{
    name: "Bardia Pourvakil",
    handle: "@thepericulum",
    quote: "The Firecrawl team ships. I wanted types for their node SDK, and less than an hour later, I got them."
  }, {
    name: "Bardia Pourvakil",
    handle: "@thepericulum",
    quote: "The Firecrawl team ships. I wanted types for their node SDK, and less than an hour later, I got them."
  }, {
    name: "Bardia Pourvakil",
    handle: "@thepericulum",
    quote: "The Firecrawl team ships. I wanted types for their node SDK, and less than an hour later, I got them."
  }, {
    name: "Bardia Pourvakil",
    handle: "@thepericulum",
    quote: "The Firecrawl team ships. I wanted types for their node SDK, and less than an hour later, I got them."
  }, {
    name: "Bardia Pourvakil",
    handle: "@thepericulum",
    quote: "The Firecrawl team ships. I wanted types for their node SDK, and less than an hour later, I got them."
  }, {
    name: "Bardia Pourvakil",
    handle: "@thepericulum",
    quote: "The Firecrawl team ships. I wanted types for their node SDK, and less than an hour later, I got them."
  }];

  return (
    <div className="relative z-10 w-full py-28 pb-24 px-6 bg-[#f0f1f3]">
      <div className="w-full max-w-6xl mx-auto">
        {/* Headline */}
        <div className="text-center mb-16">
          <h2 className="font-[Basic] font-normal text-gray-900" style={{
          fontSize: 'clamp(36px, 6vw, 56px)',
          lineHeight: '1.15'
        }} role="heading" aria-level={2}>
            Our wall of fame 💜
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg p-7 max-w-[360px] mx-auto w-full animate-fade-in" style={{
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          animationDelay: `${index * 0.1}s`
        }}>
              <div className="flex items-start gap-3 mb-4">
                {/* Avatar Placeholder */}
                <div className="w-10 h-10 rounded-full bg-[#E0E0E0] flex-shrink-0" aria-hidden="true" />
                
                {/* Name and Handle */}
                <div className="flex flex-col">
                  <div className="font-[Basic] text-[17px] font-normal text-gray-900 leading-tight">
                    {testimonial.name}
                  </div>
                  <div className="font-[Basic] text-[14px] text-gray-500 leading-tight">
                    {testimonial.handle}
                  </div>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="font-[Basic] text-[15px] leading-[1.45] text-gray-800 opacity-80">
                "{testimonial.quote}"
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
