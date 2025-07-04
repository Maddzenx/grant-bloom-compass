
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useGrants } from "@/hooks/useGrantsQuery";
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
import { useGrantsMatchingEngine } from "@/hooks/useGrantsMatchingEngine";
import { useSemanticSearch } from "@/hooks/useSemanticSearch";

const HomePage = () => {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();

  const { data: grants, isLoading: grantsLoading } = useGrants();
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
    
    try {
      // Perform the search first
      const searchResult = await searchGrants(inputValue);
      
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
        setInputValue(transcribedText);
      }
    } else {
      await startRecording();
    }
  };

  const handleFileUpload = () => {
    // This will be handled by ChatInput component
  };

  const onFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const extractedText = await handleFileSelect(event);
    if (extractedText) {
      setInputValue(extractedText);
    }
    if (event.target) {
      event.target.value = '';
    }
  };

  const isProcessing = isTranscribing || isUploading || isMatching || grantsLoading || isSearching;

  return (
    <div className="min-h-screen bg-[#F0F1F3] relative">
      {/* Purple cloud background overlay */}
      <div className="absolute top-0 left-0 right-0 h-screen bg-no-repeat bg-center bg-contain opacity-30 pointer-events-none" style={{
        backgroundImage: `url('/lovable-uploads/6e050f8a-703a-48a5-96e5-1c1f60977e6b.png')`,
        backgroundSize: '800px 600px',
        backgroundPosition: 'center 40%'
      }} />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-8 md:px-12 lg:px-16">
        <div className="w-full max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <HeroSection />

          {/* Chat Input Section */}
          <ChatInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            isRecording={isRecording}
            isProcessing={isProcessing}
            handleVoiceInput={handleVoiceInput}
            handleFileUpload={handleFileUpload}
            onFileSelect={onFileSelect}
            onSubmit={handleRedirect}
          />

          {/* Organization Tabs */}
          <OrganizationTabs />

          {/* Status Messages */}
          <StatusMessages
            isRecording={isRecording}
            isTranscribing={isTranscribing}
            isUploading={isUploading}
            isMatching={isMatching}
            grantsLoading={grantsLoading}
            isSearching={isSearching}
            matchingError={matchingError}
          />
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
