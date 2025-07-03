import React, { useRef, useState } from "react";
import { Mic, Upload, Square, Sparkles, Plus, ArrowUp, Loader2 } from "lucide-react";
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

  // Auto-resize textarea function
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    
    // Auto-resize the textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  return (
    <div className="mb-8">
      <div className="relative max-w-3xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          {/* Text Input Area */}
          <div className="px-4 py-4">
            <Textarea
              placeholder="Beskriv ditt projekt eller verksamhet för att hitta passande bidrag..."
              className="w-full min-h-[24px] max-h-[200px] border-0 bg-transparent text-lg placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-0 font-poppins resize-none overflow-hidden"
              value={inputValue}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              disabled={isProcessing}
              rows={1}
              style={{ height: 'auto' }}
            />
          </div>

          {/* Bottom Button Bar */}
          <div className="flex items-center justify-between px-4 py-3">
            {/* Left Side - Upload and Voice Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 p-0 rounded-full hover:bg-gray-100 flex-shrink-0 text-gray-600 border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm"
                onClick={handleFileUploadClick}
                disabled={isProcessing}
                title={t('chat.uploadFile')}
              >
                <Plus className="w-7 h-7" />
              </Button>

              {/* Voice Recording Button */}
              <Button
                variant="ghost"
                size="sm"
                className={`w-10 h-10 p-0 rounded-full flex-shrink-0 transition-all duration-200 border shadow-sm ${
                  isRecording 
                    ? 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200 hover:border-red-300' 
                    : 'hover:bg-gray-100 text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
                onClick={handleVoiceInput}
                disabled={isProcessing}
                title={isRecording ? t('chat.stopRecording') : t('chat.startRecording')}
              >
                {isRecording ? <Square className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
              </Button>
            </div>

            {/* Right Side - Submit Button */}
            <div className="flex items-center gap-2">
              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={isProcessing || !inputValue.trim()}
                size="sm"
                className="w-10 h-10 p-0 rounded-full flex-shrink-0 bg-purple-600 hover:bg-purple-700 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                title="Hitta bidrag"
              >
                {isProcessing ? (
                  <Loader2 className="w-7 h-7 animate-spin" />
                ) : (
                  <ArrowUp className="w-7 h-7" />
                )}
              </Button>
            </div>
          </div>
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
