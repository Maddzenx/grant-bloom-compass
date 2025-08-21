import React, { useState } from 'react';
import BetaSignupModal from './BetaSignupModal';

const BetaBanner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
              <div className="sticky top-16 z-30 bg-blue-600 text-white py-3 px-4 text-center text-sm font-medium">
          <span>
            Sidan är under uppbyggnad och det är fortfarande många funktioner som saknas eller inte funkar riktigt som de ska. Vill du få uppdateringar om hur projektet utvecklas? Skriv upp dig på vår intresselista{' '}
            <button
              onClick={handleOpenModal}
              className="underline hover:text-blue-200 transition-colors duration-200 text-sm font-medium"
            >
              här
            </button>
            .
          </span>
        </div>
      
      <BetaSignupModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </>
  );
};

export default BetaBanner; 