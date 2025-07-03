import React, { useRef, useState } from "react";
import { Mic, Upload, Square, Sparkles, ArrowUp, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
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
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          {/* Text Input Area */}
          <div className="px-4 py-4">
            <Textarea
              placeholder="Beskriv ditt projekt eller verksamhet för att hitta passande bidrag..."
              className="w-full min-h-[80px] border-0 bg-transparent text-lg placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-0 font-poppins resize-none"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isProcessing}
              rows={3}
            />
          </div>

          {/* Bottom Button Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            {/* Left Side - Upload Button */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 rounded-full hover:bg-gray-100 flex-shrink-0 text-gray-500"
                onClick={handleFileUploadClick}
                disabled={isProcessing}
                title={t('chat.uploadFile')}
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            {/* Right Side - Voice and Submit Buttons */}
            <div className="flex items-center gap-2">
              {/* Voice Recording Button */}
              <Button
                variant="ghost"
                size="sm"
                className={`p-2 rounded-full flex-shrink-0 transition-colors ${
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

              {/* Submit Button */}
              {inputValue.trim() && (
                <Button
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="bg-black hover:bg-gray-800 text-white p-2 rounded-full flex-shrink-0"
                  title="Skicka"
                >
                  <ArrowUp className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="flex items-center justify-center gap-2 text-blue-600 px-4 py-2 border-t border-gray-100">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="text-sm font-medium font-poppins">
                Bearbetar...
              </span>
            </div>
          )}
        </div>
        
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif"
          onChange={onFileSelect}
          className="hidden"
        />
        
        {/* Enhanced Search Info */}
        <div className="mt-3 text-center">
          
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
