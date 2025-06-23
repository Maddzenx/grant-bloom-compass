
import React, { useState, useRef } from "react";
import { Mic, Upload, ArrowRight, Square } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { useFileUpload } from "@/hooks/useFileUpload";

const Index = () => {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
    cancelRecording
  } = useVoiceRecording();
  
  const { isUploading, handleFileSelect } = useFileUpload();

  const handleRedirect = () => {
    navigate("/discover");
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

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f8f4ec]">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-normal text-gray-900 mb-12">What is your project about?</h1>
          
          <div className="relative max-w-3xl mx-auto">
            <div className="flex items-center border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow px-6 py-4 gap-4 bg-white">
              {/* Voice Recording Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className={`p-2 rounded-full flex-shrink-0 transition-colors ${
                  isRecording 
                    ? 'bg-red-100 hover:bg-red-200 text-red-600' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={handleVoiceInput}
                disabled={isTranscribing || isUploading}
                title={isRecording ? "Stop recording" : "Start voice recording"}
              >
                {isRecording ? (
                  <Square className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5 text-gray-500" />
                )}
              </Button>
              
              {/* Upload File Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 rounded-full hover:bg-gray-100 flex-shrink-0" 
                onClick={handleFileUpload}
                disabled={isRecording || isTranscribing || isUploading}
                title="Upload file"
              >
                <Upload className="w-5 h-5 text-gray-500" />
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
                  isTranscribing 
                    ? "Transcribing audio..." 
                    : isUploading 
                    ? "Processing file..." 
                    : "Describe your project or funding needs..."
                }
                className="flex-1 border-0 bg-transparent text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 px-0" 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isTranscribing || isUploading}
              />
              
              {/* Redirect Button - Only show when there's input */}
              {inputValue.trim() && (
                <Button 
                  variant="default" 
                  size="sm" 
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white" 
                  onClick={handleRedirect}
                  disabled={isRecording || isTranscribing || isUploading}
                >
                  <span>Find Grants</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            {/* Status Messages */}
            {isRecording && (
              <div className="mt-4 text-sm text-red-600 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                Recording... Click the microphone to stop
              </div>
            )}
            
            {isTranscribing && (
              <div className="mt-4 text-sm text-blue-600 flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Transcribing audio...
              </div>
            )}
            
            {isUploading && (
              <div className="mt-4 text-sm text-blue-600 flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Processing file...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
