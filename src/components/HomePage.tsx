
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
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useGrantsMatchingEngine } from "@/hooks/useGrantsMatchingEngine";
import { useSemanticSearch } from "@/hooks/useSemanticSearch";

const HomePage = () => {
  const [inputValue, setInputValue] = useState("");
  const [selectedOrganizations, setSelectedOrganizations] = useState<string[]>([]);
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
    
    try {
      // Perform the search first with organization filtering
      const searchResult = await searchGrants(inputValue, selectedOrganizations);
      
      console.log('🔍 Search completed, navigating to discover page with results:', searchResult);
      
      // Navigate to discover page with search term and results
      navigate("/discover", {
        state: {
          searchTerm: inputValue,
          searchResults: searchResult
        }
      });
    } catch (error) {
      console.error('❌ Search failed on home page:', error);
      
      // Navigate anyway but let discover page handle the error
      navigate("/discover", {
        state: {
          searchTerm: inputValue,
          searchError: true
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
        className="absolute left-1/2 top-20 z-0 w-[700px] h-[700px] -translate-x-1/2 pointer-events-none select-none animate-liquid-blob"
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

          {/* Organization Tabs */}
          <OrganizationTabs onSelectionChange={handleOrganizationSelectionChange} />

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
      <VideoDemo />

      {/* Metrics Section */}
      <MetricsSection />

      {/* Security & Trust Section */}
      <SecurityTrustSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
};

export default HomePage;
