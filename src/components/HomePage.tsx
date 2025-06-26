
import React, { useState, useRef } from "react";
import { Mic, Upload, ArrowRight, Square } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useGrantMatching } from "@/hooks/useGrantMatching";
import { useGrants } from "@/hooks/useGrants";

const HomePage = () => {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    fileInputRef.current?.click();
  };

  const onFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const extractedText = await handleFileSelect(event);
    if (extractedText) {
      setInputValue(extractedText);
    }
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isProcessing = isTranscribing || isUploading || isMatching || grantsLoading;

  const organizationTabs = [
    "Vinnova", "Formas", "Tillväxtverket", "Energimyndigheten", 
    "VGR", "EU", "Vetenskapsrådet"
  ];

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
      <nav className="absolute top-0 right-0 p-6 z-10">
        <div className="flex items-center space-x-8">
          <a 
            href="/discover" 
            className="font-newsreader font-medium text-gray-700 hover:text-gray-900 transition-colors text-lg"
          >
            Hem
          </a>
          <a 
            href="/discover" 
            className="font-newsreader font-medium text-gray-700 hover:text-gray-900 transition-colors text-lg"
          >
            Upptäck bidrag
          </a>
          <a 
            href="/saved" 
            className="font-newsreader font-medium text-gray-700 hover:text-gray-900 transition-colors text-lg"
          >
            Sparade bidrag
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="font-newsreader font-semibold text-5xl md:text-6xl lg:text-7xl text-gray-900 mb-6 leading-tight">
              <span className="italic">"I like writing grants!"</span> – said no one ever.
            </h1>
            <p className="font-newsreader font-normal text-xl md:text-2xl text-gray-700 mb-12">
              Get matched with grants and drafts by chatting with AI
            </p>
          </div>

          {/* Chat Input Section */}
          <div className="mb-8">
            <div className="relative max-w-3xl mx-auto">
              <div className="flex items-center bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow px-4 py-4 gap-3">
                {/* Voice Recording Button */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`p-3 rounded-full flex-shrink-0 transition-colors ${
                    isRecording 
                      ? 'bg-red-100 hover:bg-red-200 text-red-600' 
                      : 'hover:bg-gray-100 text-gray-500'
                  }`}
                  onClick={handleVoiceInput} 
                  disabled={isProcessing}
                  title={isRecording ? "Stop recording" : "Start voice recording"}
                >
                  {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
                
                {/* Upload File Button */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-3 rounded-full hover:bg-gray-100 flex-shrink-0 text-gray-500" 
                  onClick={handleFileUpload} 
                  disabled={isProcessing}
                  title="Upload file"
                >
                  <Upload className="w-5 h-5" />
                </Button>
                
                {/* Hidden File Input */}
                <input 
                  ref={fileInputRef} 
                  type="file" 
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif" 
                  onChange={onFileSelect} 
                  className="hidden" 
                />
                
                {/* Text Input Field */}
                <Input 
                  placeholder={
                    isTranscribing ? "Transcribing audio..." :
                    isUploading ? "Processing file..." :
                    isMatching ? "Matching grants..." :
                    grantsLoading ? "Loading grants..." :
                    "Type your question..."
                  }
                  className="flex-1 border-0 bg-transparent text-lg placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 font-newsreader"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isProcessing}
                />
              </div>
            </div>
          </div>

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
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto mb-16">
            {organizationTabs.map((org, index) => (
              <button
                key={index}
                className="px-4 py-2 bg-white/50 hover:bg-white/100 rounded-full font-newsreader font-medium text-gray-700 transition-all duration-200 hover:shadow-sm"
              >
                {org}
              </button>
            ))}
          </div>

          {/* Status Messages */}
          {isRecording && (
            <div className="mt-6 text-sm text-red-600 flex items-center justify-center gap-2 font-newsreader">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              Recording... Click the microphone to stop
            </div>
          )}
          
          {isTranscribing && (
            <div className="mt-6 text-sm text-blue-600 flex items-center justify-center gap-2 font-newsreader">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              Transcribing audio...
            </div>
          )}
          
          {isUploading && (
            <div className="mt-6 text-sm text-blue-600 flex items-center justify-center gap-2 font-newsreader">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              Processing file...
            </div>
          )}

          {isMatching && (
            <div className="mt-6 text-sm text-blue-600 flex items-center justify-center gap-2 font-newsreader">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              Matching grants with your project...
            </div>
          )}

          {grantsLoading && (
            <div className="mt-6 text-sm text-blue-600 flex items-center justify-center gap-2 font-newsreader">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              Loading available grants...
            </div>
          )}

          {matchingError && (
            <div className="mt-6 text-sm text-red-600 text-center font-newsreader">
              {matchingError}
            </div>
          )}
        </div>
      </div>

      {/* Video Demo Section */}
      <div className="relative z-10 w-full bg-[#F0F1F3] py-16 px-6">
        <div className="w-full max-w-6xl mx-auto">
          {/* Video Container with 16:9 aspect ratio */}
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <div className="absolute inset-0 border-4 border-dashed border-gray-400 rounded-lg bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <p className="font-newsreader font-medium text-gray-600 text-lg md:text-xl">
                  Video på hur verktyget fungerar
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
