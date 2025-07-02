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
}
const ChatInput = ({
  inputValue,
  setInputValue,
  isRecording,
  isProcessing,
  handleVoiceInput,
  handleFileUpload,
  onFileSelect
}: ChatInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    t
  } = useLanguage();
  const [isAISearching, setIsAISearching] = useState(false);
  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && inputValue.trim()) {
      e.preventDefault();
      // This will be handled by the parent component
    }
  };
  return <div className="mb-8">
      <div className="relative max-w-3xl mx-auto">
        <div className="flex items-start bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow px-4 py-12 gap-3">
          {/* Voice Recording Button */}
          <Button variant="ghost" size="sm" className={`p-3 rounded-full flex-shrink-0 transition-colors ${isRecording ? 'bg-red-100 hover:bg-red-200 text-red-600' : 'hover:bg-gray-100 text-gray-500'}`} onClick={handleVoiceInput} disabled={isProcessing || isAISearching} title={isRecording ? t('chat.stopRecording') : t('chat.startRecording')}>
            {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>
          
          {/* Upload File Button */}
          <Button variant="ghost" size="sm" className="p-3 rounded-full hover:bg-gray-100 flex-shrink-0 text-gray-500" onClick={handleFileUploadClick} disabled={isProcessing || isAISearching} title={t('chat.uploadFile')}>
            <Upload className="w-5 h-5" />
          </Button>
          
          {/* Hidden File Input */}
          <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif" onChange={onFileSelect} className="hidden" />
          
          {/* Text Input Field */}
          <Input placeholder="Beskriv ditt projekt eller verksamhet för att hitta passande bidrag..." className="flex-1 border-0 bg-transparent text-lg placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 font-newsreader" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyPress={handleKeyPress} disabled={isProcessing || isAISearching} />

          {/* AI Search Indicator */}
          {(isProcessing || isAISearching) && <div className="flex items-center gap-2 text-blue-600 flex-shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="text-sm font-medium">
                {isAISearching ? 'AI analyserar...' : 'Bearbetar...'}
              </span>
            </div>}
        </div>
        
        {/* Enhanced Search Info */}
        <div className="mt-3 text-center">
          
        </div>
      </div>
    </div>;
};
export default ChatInput;