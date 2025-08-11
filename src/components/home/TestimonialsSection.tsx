
import React from "react";

const TestimonialsSection = () => {
  const testimonials = [{
    author: "Bardia Pourvakil",
    role: "@thepericulum",
    quote: "The Firecrawl team ships. I wanted types for their node SDK, and less than an hour later, I got them."
  }, {
    author: "Bardia Pourvakil",
    role: "@thepericulum",
    quote: "The Firecrawl team ships. I wanted types for their node SDK, and less than an hour later, I got them."
  }, {
    author: "Bardia Pourvakil",
    role: "@thepericulum",
    quote: "The Firecrawl team ships. I wanted types for their node SDK, and less than an hour later, I got them."
  }, {
    author: "Bardia Pourvakil",
    role: "@thepericulum",
    quote: "The Firecrawl team ships. I wanted types for their node SDK, and less than an hour later, I got them."
  }, {
    author: "Bardia Pourvakil",
    role: "@thepericulum",
    quote: "The Firecrawl team ships. I wanted types for their node SDK, and less than an hour later, I got them."
  }, {
    author: "Bardia Pourvakil",
    role: "@thepericulum",
    quote: "The Firecrawl team ships. I wanted types for their node SDK, and less than an hour later, I got them."
  }];

  return (
    <div className="relative z-10 w-full py-28 pb-24 px-6 bg-[#f0f1f3]">
      <div className="w-full max-w-6xl mx-auto">
        {/* Headline */}
        <div className="text-center mb-16">
          <h2 className="font-['Source_Sans_3'] font-normal text-gray-900" style={{
            fontSize: 'clamp(32px, 6vw, 48px)',
            letterSpacing: '0.5px'
          }}>
            Vad användare säger
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              {/* Quote */}
              <blockquote className="font-['Source_Sans_3'] text-[15px] leading-[1.45] text-gray-800 opacity-80 mb-6">
                "{testimonial.quote}"
              </blockquote>
              
              {/* Author Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="font-['Source_Sans_3'] text-[17px] font-normal text-gray-900 leading-tight">
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-['Source_Sans_3'] text-[17px] font-normal text-gray-900 leading-tight">
                    {testimonial.author}
                  </div>
                  <div className="font-['Source_Sans_3'] text-[14px] text-gray-500 leading-tight">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
