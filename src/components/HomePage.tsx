
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, Upload } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-canvas-cloud">
      {/* Main Hero Section */}
      <section className="relative px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-16">
            <div className="text-2xl font-bold text-ink-obsidian">
              gr<span className="text-accent-lavender">ai</span>gent
            </div>
          </div>

          {/* Purple blob background */}
          <div className="relative">
            {/* Large purple blob */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[900px] h-[700px] bg-gradient-to-br from-accent-lavender/40 to-accent-lavender/20 rounded-full blur-3xl"></div>
            </div>
            
            {/* Content over blob */}
            <div className="relative z-10 text-center py-20">
              {/* Main heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ink-obsidian mb-8 leading-tight">
                <span className="italic">"I like writing grants!"</span>
                <span className="block font-normal">- said no one ever.</span>
              </h1>
              
              {/* Subheading */}
              <p className="text-lg md:text-xl text-ink-obsidian/80 mb-12 max-w-2xl mx-auto">
                Get matched with grants and drafts by chatting with AI
              </p>

              {/* Input field */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Input
                    placeholder="Describe the project do you need funding for..."
                    className="w-full h-14 px-6 pr-20 text-base bg-white border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-accent-lavender focus:border-accent-lavender placeholder:text-gray-500"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <Upload className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <Mic className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Find grants button */}
              <Button className="bg-highlight-amber hover:bg-highlight-amber/90 text-ink-obsidian font-semibold px-8 py-3 text-lg rounded-full mb-16">
                Find grants
              </Button>

              {/* Organization badges */}
              <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
                {/* Top row */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
                  <div className="bg-highlight-amber/80 backdrop-blur-sm px-6 py-3 rounded-full border border-white/50">
                    <span className="text-sm font-medium text-ink-obsidian">Vinnova</span>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-white/50">
                    <span className="text-sm font-medium text-ink-obsidian">Formas</span>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-white/50">
                    <span className="text-sm font-medium text-ink-obsidian">Tillväxtverket</span>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-white/50">
                    <span className="text-sm font-medium text-ink-obsidian">Energimyndigheten</span>
                  </div>
                </div>
                
                {/* Bottom row */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-white/50">
                    <span className="text-sm font-medium text-ink-obsidian">VGR</span>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-white/50">
                    <span className="text-sm font-medium text-ink-obsidian">EU</span>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-white/50">
                    <span className="text-sm font-medium text-ink-obsidian">Vetenskapsrådet</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
