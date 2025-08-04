
import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import HeroSection from "@/components/home/HeroSection";
import ChatInput from "@/components/home/ChatInput";
import OrganizationTabs from "@/components/home/OrganizationTabs";
import StatusMessages from "@/components/home/StatusMessages";
import VideoDemo from "@/components/home/VideoDemo";
import MetricsSection from "@/components/home/MetricsSection";
import SecurityTrustSection from "@/components/home/SecurityTrustSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import PricingSection from "@/components/home/PricingSection";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";
import Footer from "@/components/home/Footer";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useGrantsMatchingEngine } from "@/hooks/useGrantsMatchingEngine";
import { useSemanticSearch } from "@/hooks/useSemanticSearch";

const HomePage = () => {
  const [inputValue, setInputValue] = useState("");
  const [selectedOrganizations, setSelectedOrganizations] = useState<string[]>([]);
  const [grantType, setGrantType] = useState<'swedish' | 'eu' | 'both'>('both');
  const navigate = useNavigate();
  const { t } = useLanguage();

  const { matchGrants, isMatching, matchingError } = useGrantsMatchingEngine();
  const { searchGrants, isSearching } = useSemanticSearch();
  const {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
    cancelRecording
  } = useVoiceRecording();
  const { isUploading, handleFileSelect } = useFileUpload();

  const handleRedirect = async () => {
    if (!inputValue.trim()) {
      navigate("/discover");
      return;
    }

    console.log('🚀 Starting search on home page for:', inputValue);
    console.log('🏢 With organization filter:', selectedOrganizations);
    console.log('🌍 Grant type:', grantType);
    
    try {
      // Perform the search first with organization filtering
      const searchResult = await searchGrants(inputValue, selectedOrganizations);
      
      console.log('🔍 Search completed, navigating to discover page with results:', searchResult);
      
      // Navigate to discover page with search term and results
      navigate("/discover", {
        state: {
          searchTerm: inputValue,
          searchResults: searchResult,
          grantType: grantType
        }
      });
    } catch (error) {
      console.error('❌ Search failed on home page:', error);
      
      // Navigate anyway but let discover page handle the error
      navigate("/discover", {
        state: {
          searchTerm: inputValue,
          searchError: true,
          grantType: grantType
        }
      });
    }
  };

  const handleVoiceInput = async () => {
    if (isRecording) {
      const transcribedText = await stopRecording();
      if (transcribedText) {
        setInputValue(prev => prev ? `${prev} ${transcribedText}` : transcribedText);
      }
    } else {
      await startRecording();
    }
  };

  const handleFileUpload = () => {
    // This will be handled by ChatInput component
  };

  const handleOrganizationSelectionChange = useCallback((organizations: string[]) => {
    console.log('🏢 Organization selection changed:', organizations);
    setSelectedOrganizations(organizations);
  }, []);

  const onFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const extractedText = await handleFileSelect(event);
    if (extractedText) {
      setInputValue(extractedText);
    }
    if (event.target) {
      event.target.value = '';
    }
  };

  const isProcessing = isTranscribing || isUploading || isMatching || isSearching;

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#fafafa' }}>
      <img
        src="/lovable-uploads/purple-cloud.png"
        alt="Purple Cloud"
        className="absolute left-1/2 top-20 z-0 w-[700px] h-[700px] -translate-x-1/2 pointer-events-none select-none animate-liquid-blob opacity-90"
        style={{
          filter: 'blur(35px) contrast(0.5) brightness(1.3) saturate(0.8)',
          mixBlendMode: 'multiply'
        }}
        draggable={false}
      />
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-8 md:px-12 lg:px-16">
        <div className="w-full max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center">
            <HeroSection />
          </div>

          {/* Chat Input Section */}
          <ChatInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            isRecording={isRecording}
            isTranscribing={isTranscribing}
            isProcessing={isProcessing}
            isSearching={isSearching}
            handleVoiceInput={handleVoiceInput}
            handleFileUpload={handleFileUpload}
            onFileSelect={onFileSelect}
            onSubmit={handleRedirect}
          />

          {/* Grant Type Filter */}
          <div className="mt-4 mb-3">
            <h3 className="text-base font-[Basic] font-normal mb-3 text-center text-black">
              Visa endast:
            </h3>
            <div className="flex justify-center">
              <div className="flex bg-gray-100 rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setGrantType('swedish')}
                  className={`px-6 py-3 rounded-l-md font-medium text-sm transition-all duration-200 ${
                    grantType === 'swedish' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  Svenska bidrag
                </button>
                <button
                  onClick={() => setGrantType('both')}
                  className={`px-6 py-3 font-medium text-sm transition-all duration-200 ${
                    grantType === 'both' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  Alla bidrag
                </button>
                <button
                  onClick={() => setGrantType('eu')}
                  className={`px-6 py-3 rounded-r-md font-medium text-sm transition-all duration-200 ${
                    grantType === 'eu' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  EU-bidrag
                </button>
              </div>
            </div>
          </div>

          {/* Organization Tabs */}
          <div className="mt-4 mb-3">
            <h3 className="text-base font-[Basic] font-normal mb-3 text-center text-black">
             Jag söker som:
            </h3>
            <OrganizationTabs onSelectionChange={handleOrganizationSelectionChange} />
          </div>

          {/* Status Messages */}
          <div className="text-center">
            <StatusMessages
              isRecording={isRecording}
              isTranscribing={isTranscribing}
              isUploading={isUploading}
              isMatching={isMatching}
              grantsLoading={false}
              isSearching={isSearching}
              matchingError={matchingError}
            />
          </div>
        </div>
      </div>

      {/* Video Demo Section */}
      {/* <VideoDemo /> */}

      {/* Metrics Section */}
      <MetricsSection />

      {/* Security & Trust Section */}
      {/* <SecurityTrustSection /> */}

      {/* Testimonials Section */}
      {/* <TestimonialsSection /> */}

      {/* Pricing Section */}
      {/* <PricingSection /> */}

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      {/* <CTASection /> */}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
