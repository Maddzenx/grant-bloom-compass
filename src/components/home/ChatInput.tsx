import React, { useRef, useState, useEffect } from "react";
import { Mic, Upload, Square, Sparkles, Plus, ArrowUp, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useHumorousExamples } from "@/hooks/useHumorousExamples";
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
  const {
    t
  } = useLanguage();
  const {
    example,
    isLoading: isLoadingExample
  } = useHumorousExamples();
  const [typedText, setTypedText] = useState('');
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  // Typewriter effect for the humorous example - letter by letter
  useEffect(() => {
    if (example && !isLoadingExample && !isTyping) {
      // Start typing immediately, no delay
      setIsTyping(true);
      setCurrentLetterIndex(0);
      setTypedText('');
      let letterIndex = 0;
      const typeLetters = () => {
        if (letterIndex < example.length) {
          const newText = example.substring(0, letterIndex + 1);
          setTypedText(newText);
          setCurrentLetterIndex(letterIndex + 1);
          letterIndex++;

          // Natural typing speed between 30-100ms per letter
          const delay = Math.random() * 70 + 30;
          setTimeout(typeLetters, delay);
        } else {
          setIsTyping(false);
        }
      };
      typeLetters();
    }
  }, [example, isLoadingExample, isTyping]);

  // Reset typing animation when example changes
  useEffect(() => {
    if (example && !isLoadingExample) {
      setTypedText('');
      setCurrentLetterIndex(0);
      setIsTyping(false);
    }
  }, [example]);
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

  // Clear typed text when user starts typing
  const handleFocus = () => {
    if (typedText && !inputValue) {
      setTypedText('');
      setIsTyping(false);
    }
  };

  // Show the typed text as placeholder, but only if user hasn't typed anything
  const placeholderText = !inputValue ? typedText : "";
  return <div className="mb-8">
      <div className="relative max-w-3xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          {/* Text Input Area */}
          <div className="px-4 py-4">
            <Textarea placeholder={placeholderText} className={`w-full min-h-[48px] max-h-[200px] border-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-0 font-[Basic] resize-none overflow-hidden placeholder:text-gray-400 ${isTyping ? 'placeholder:after:content-[_] placeholder:after:animate-pulse' : ''}`} value={inputValue} onChange={handleTextareaChange} onKeyPress={handleKeyPress} onFocus={handleFocus} disabled={isProcessing} rows={2} style={{
            height: 'auto',
            minHeight: '48px'
          }} />
          </div>

          {/* Bottom Button Bar */}
          <div className="flex items-center justify-between px-4 py-3">
            {/* Left Side - Upload and Voice Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full hover:bg-gray-100 flex-shrink-0 text-gray-600 border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm" onClick={handleFileUploadClick} disabled={isProcessing} title={t('chat.uploadFile')}>
                <Plus className="w-7 h-7" />
              </Button>

              {/* Voice Recording Button */}
              <Button variant="ghost" size="sm" className={`w-10 h-10 p-0 rounded-full flex-shrink-0 transition-all duration-200 border shadow-sm ${isRecording ? 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200 hover:border-red-300' : 'hover:bg-gray-100 text-gray-600 border-gray-200 hover:border-gray-300'}`} onClick={handleVoiceInput} disabled={isProcessing} title={isRecording ? t('chat.stopRecording') : t('chat.startRecording')}>
                {isRecording ? <Square className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
              </Button>
            </div>

            {/* Right Side - Submit Button */}
            <div className="flex items-center gap-2">
              {/* Submit Button */}
              <Button onClick={handleSubmit} disabled={isProcessing || !inputValue.trim()} size="sm" title="Hitta bidrag" className="w-10 h-10 p-0 rounded-full flex-shrink-0 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 bg-[#cec5f9]">
                {isProcessing ? <Loader2 className="w-7 h-7 animate-spin" /> : <ArrowUp className="w-7 h-7" />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Hidden File Input */}
        <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif" onChange={onFileSelect} className="hidden" />
        
        {/* Enhanced Search Info - Hidden loading indicator */}
        <div className="mt-3 text-center">
          {/* Loading indicator removed */}
        </div>
      </div>
    </div>;
};
export default ChatInput;