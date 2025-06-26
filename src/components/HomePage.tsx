
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useGrantMatching } from "@/hooks/useGrantMatching";
import { useGrants } from "@/hooks/useGrants";
import HeroSection from "@/components/home/HeroSection";
import ChatInput from "@/components/home/ChatInput";
import OrganizationTabs from "@/components/home/OrganizationTabs";
import StatusMessages from "@/components/home/StatusMessages";
import VideoDemo from "@/components/home/VideoDemo";
import TopNavigation from "@/components/home/TopNavigation";

const HomePage = () => {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  // Hardcoded API key
  const apiKey = "key_MByf0khg5w7tZlB7";
  const {
    data: grants,
    isLoading: grantsLoading
  } = useGrants();
  const {
    matchGrants,
    isMatching,
    matchingError
  } = useGrantMatching();
  const {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
    cancelRecording
  } = useVoiceRecording();
  const {
    isUploading,
    handleFileSelect
  } = useFileUpload();

  const handleRedirect = async () => {
    if (!inputValue.trim()) {
      navigate("/discover");
      return;
    }

    // Perform grant matching if we have grants and input
    if (grants && grants.length > 0 && inputValue.trim()) {
      console.log('🚀 Starting grant matching process...');
      const result = await matchGrants(grants, {
        description: inputValue
      }, apiKey);
      if (result) {
        console.log('✅ Grant matching successful, navigating to discover page...');
        // Navigate to discover page with matched grants
        navigate("/discover", {
          state: {
            matchedGrants: result.sortedGrants,
            matchResponse: result.matchResponse,
            searchTerm: inputValue
          }
        });
      } else {
        console.log('❌ Grant matching failed, navigating to discover page without matching...');
        // Navigate without matching if it fails
        navigate("/discover", {
          state: {
            searchTerm: inputValue
          }
        });
      }
    } else {
      navigate("/discover");
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
    // Reset the file input
    if (event.target) {
      event.target.value = '';
    }
  };

  const isProcessing = isTranscribing || isUploading || isMatching || grantsLoading;

  return (
    <div className="min-h-screen bg-[#F0F1F3] relative">
      {/* Purple cloud background overlay */}
      <div 
        className="absolute top-0 left-0 right-0 h-screen bg-no-repeat bg-center bg-contain opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url('/lovable-uploads/6e050f8a-703a-48a5-96e5-1c1f60977e6b.png')`,
          backgroundSize: '800px 600px',
          backgroundPosition: 'center 40%'
        }}
      />
      
      {/* Top Navigation */}
      <TopNavigation />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
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
              Find grants
            </Button>
          </div>

          {/* Organization Tabs */}
          <OrganizationTabs />

          {/* Status Messages */}
          <StatusMessages 
            isRecording={isRecording}
            isTranscribing={isTranscribing}
            isUploading={isUploading}
            isMatching={isMatching}
            grantsLoading={grantsLoading}
            matchingError={matchingError}
          />
        </div>
      </div>

      {/* Video Demo Section */}
      <VideoDemo />
    </div>
  );
};

export default HomePage;
