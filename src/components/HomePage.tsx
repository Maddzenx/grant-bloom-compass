
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useGrants } from "@/hooks/useGrants";
import { useAIGrantSearch } from "@/hooks/useAIGrantSearch";
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

const HomePage = () => {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();

  const { data: grants, isLoading: grantsLoading } = useGrants();
  const { searchGrants, isSearching, searchError } = useAIGrantSearch();
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

    // Use AI search when there's input
    console.log('🚀 Starting AI-powered grant search...');
    const aiResult = await searchGrants(inputValue);
    
    if (aiResult && aiResult.rankedGrants.length > 0 && grants) {
      // Sort grants based on AI ranking
      const rankedGrantIds = aiResult.rankedGrants
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .map(match => match.grantId);
      
      const sortedGrants = rankedGrantIds
        .map(id => grants.find(grant => grant.id === id))
        .filter(Boolean);
      
      // Add any remaining grants not ranked by AI
      const unrankedGrants = grants.filter(grant => 
        !rankedGrantIds.includes(grant.id)
      );
      
      const finalSortedGrants = [...sortedGrants, ...unrankedGrants];

      console.log('✅ AI search successful, navigating with sorted results...');
      navigate("/discover", {
        state: {
          matchedGrants: finalSortedGrants,
          aiSearchResult: aiResult,
          searchTerm: inputValue
        }
      });
    } else {
      console.log('❌ AI search failed or no results, navigating to discover page...');
      navigate("/discover", {
        state: {
          searchTerm: inputValue,
          searchError: searchError
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

  const isProcessing = isTranscribing || isUploading || isSearching || grantsLoading;

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
          />

          {/* Primary CTA */}
          <div className="mb-12">
            <Button
              onClick={handleRedirect}
              disabled={isProcessing}
              className="bg-[#D1F364] hover:bg-[#C5E858] text-gray-900 font-newsreader font-semibold text-lg px-8 py-4 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              {t('hero.findGrants')}
            </Button>
          </div>

          {/* Organization Tabs */}
          <OrganizationTabs />

          {/* Status Messages */}
          <StatusMessages
            isRecording={isRecording}
            isTranscribing={isTranscribing}
            isUploading={isUploading}
            isMatching={isSearching}
            grantsLoading={grantsLoading}
            matchingError={searchError}
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
