import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BetaSignupModal from './BetaSignupModal';

const BetaBanner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <>
      <div className="bg-primary text-primary-foreground px-4 py-3 text-center text-sm relative">
        <p className="max-w-4xl mx-auto">
          Sidan är under uppbyggnad och det är fortfarande många funktioner som saknas eller inte funkar riktigt som de ska. Vill du få uppdateringar om hur projektet utvecklas? Skriv gärna upp dig på vår intresselista{" "}
          <button
            onClick={() => setIsModalOpen(true)}
            className="underline font-medium hover:no-underline cursor-pointer"
          >
            här
          </button>
          .
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:opacity-70 transition-opacity"
          aria-label="Stäng banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <BetaSignupModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default BetaBanner;