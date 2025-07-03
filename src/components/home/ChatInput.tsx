
import React, { useRef, useState } from "react";
import { Mic, Upload, Square, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  isRecording: boolean;  
  isProcessing: boolean;
  handleVoiceInput: () => void;
  handleFileUpload: () => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: () => void; // Add optional submit handler
}

const ChatInput = ({
  inputValue,
  setInputValue,
  isRecording,
  isProcessing,
  handleVoiceInput,
  handleFileUpload,
  onFileSelect,
  onSubmit
}: ChatInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && inputValue.trim()) {
      e.preventDefault();
      onSubmit?.();
    }
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSubmit?.();
    }
  };

  return (
    <div className="mb-8">
      <div className="relative max-w-3xl mx-auto">
        <div className="flex items-start bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow px-4 py-12 gap-3">
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
            title={isRecording ? t('chat.stopRecording') : t('chat.startRecording')}
          >
            {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>
          
          {/* Upload File Button */}
          <Button
            variant="ghost"
            size="sm"
            className="p-3 rounded-full hover:bg-gray-100 flex-shrink-0 text-gray-500"
            onClick={handleFileUploadClick}
            disabled={isProcessing}
            title={t('chat.uploadFile')}
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
            placeholder="Beskriv ditt projekt eller verksamhet för att hitta passande bidrag..."
            className="flex-1 border-0 bg-transparent text-lg placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 font-poppins"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isProcessing}
          />

          {/* Search Button */}
          {inputValue.trim() && (
            <Button
              onClick={handleSubmit}
              disabled={isProcessing}
              className="bg-[#d7cffc] hover:bg-[#c5c3f0] text-black px-4 py-2 rounded-lg text-sm font-medium"
            >
              Sök
            </Button>
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="flex items-center gap-2 text-blue-600 flex-shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="text-sm font-medium font-poppins">
                Bearbetar...
              </span>
            </div>
          )}
        </div>
        
        {/* Enhanced Search Info */}
        <div className="mt-3 text-center">
          
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
