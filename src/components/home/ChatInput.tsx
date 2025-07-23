import React, { useRef, useState, useEffect } from "react";
import { Mic, Upload, Square, Sparkles, Plus, ArrowUp, Loader2, Paperclip, MicOff } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useHumorousExamples } from "@/hooks/useHumorousExamples";
import { useSearchStatusMessages } from "@/hooks/useSearchStatusMessages";

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  isRecording: boolean;
  isProcessing: boolean;
  isSearching?: boolean; // Add specific semantic search state
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
  isSearching = false,
  handleVoiceInput,
  handleFileUpload,
  onFileSelect,
  onSubmit
}: ChatInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    t
  } = useLanguage();
  const {
    example,
    isLoading: isLoadingExample
  } = useHumorousExamples();
  const { generateMessages } = useSearchStatusMessages();
  const [typedText, setTypedText] = useState('');
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  // Dynamic search status states
  const [terminalMessages, setTerminalMessages] = useState<string[]>([]);
  const [currentTerminalIndex, setCurrentTerminalIndex] = useState(0);
  const [terminalText, setTerminalText] = useState('');
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalTypedText, setTerminalTypedText] = useState('');
  const [isTerminalTyping, setIsTerminalTyping] = useState(false);

  // Terminal animation effect with typewriter and dynamic messages
  useEffect(() => {
    if (isSearching && !isLoadingExample && inputValue.trim()) {
      setShowTerminal(true);
      setCurrentTerminalIndex(0);
      setTerminalText('');
      setTerminalTypedText('');
      
      // Show initial "search initiated" message immediately
      const initialMessage = "Sökning påbörjas...";
      setTerminalText(initialMessage);
      setIsTerminalTyping(true);
      setTerminalTypedText('');
      
      // Type out the initial message
      let letterIndex = 0;
      const typeInitialMessage = () => {
        if (letterIndex < initialMessage.length && isSearching) {
          const newText = initialMessage.substring(0, letterIndex + 1);
          setTerminalTypedText(newText);
          letterIndex++;
          const delay = Math.random() * 35 + 18;
          setTimeout(typeInitialMessage, delay);
        } else {
          setIsTerminalTyping(false);
        }
      };
      
      // Start typing the initial message
      typeInitialMessage();
      
      // Generate AI messages in parallel
      const startMessageCycle = async () => {
        try {
          const dynamicMessages = await generateMessages(inputValue);
          setTerminalMessages(dynamicMessages);
          
          // Wait a moment to ensure initial message has finished, then start AI messages
          setTimeout(() => {
            if (!isSearching) return;
            
            // Start cycling through AI-generated messages
            let messageIndex = 0;
            const showNextMessage = () => {
              if (messageIndex < dynamicMessages.length && isSearching) {
                setCurrentTerminalIndex(messageIndex);
                const currentMessage = dynamicMessages[messageIndex];
                setTerminalText(currentMessage);
                
                // Start typewriter effect for this message
                setIsTerminalTyping(true);
                setTerminalTypedText('');
                let letterIndex = 0;
                
                const typeLetters = () => {
                  if (letterIndex < currentMessage.length && isSearching) {
                    const newText = currentMessage.substring(0, letterIndex + 1);
                    setTerminalTypedText(newText);
                    letterIndex++;
                    // Same typing speed as humorous examples
                    const delay = Math.random() * 35 + 18;
                    setTimeout(typeLetters, delay);
                  } else {
                    setIsTerminalTyping(false);
                    // Brief pause before next message (3000ms after typing completes)
                    setTimeout(() => {
                      if (isSearching) {
                        messageIndex++;
                        showNextMessage();
                      }
                    }, 3000); // 3000ms after typing completes
                  }
                };
                
                typeLetters();
              }
            };
            
            // Start the AI message cycle
            showNextMessage();
          }, 500); // Small delay to ensure smooth transition
          
        } catch (error) {
          console.error('Failed to generate messages:', error);
          setShowTerminal(false);
        }
      };
      
      startMessageCycle();
    } else {
      setShowTerminal(false);
      setTerminalText('');
      setTerminalTypedText('');
      setIsTerminalTyping(false);
    }
  }, [isSearching, isLoadingExample, inputValue, generateMessages]);

  // Typewriter effect for the humorous example - letter by letter
  useEffect(() => {
    if (example && !isLoadingExample && !isTyping && !showTerminal) {
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

          // Faster typing speed - 1.5x faster than before (20-67ms per letter instead of 30-100ms)
          const delay = Math.random() * 35 + 18;
          setTimeout(typeLetters, delay);
        } else {
          setIsTyping(false);
        }
      };
      typeLetters();
    }
  }, [example, isLoadingExample, isTyping, showTerminal]);

  // Reset typing animation when example changes
  useEffect(() => {
    if (example && !isLoadingExample && !showTerminal) {
      setTypedText('');
      setCurrentLetterIndex(0);
      setIsTyping(false);
    }
  }, [example, showTerminal]);

  // Clear typed text only when user actually starts typing
  useEffect(() => {
    if (inputValue && typedText && !showTerminal) {
      setTypedText('');
      setIsTyping(false);
    }
  }, [inputValue, typedText, showTerminal]);

  // Autofocus the textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && inputValue.trim()) {
      e.preventDefault();
      onSubmit?.();
    } else if (e.key === 'Tab' && !inputValue && typedText) {
      e.preventDefault();
      setInputValue(typedText);
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

  // Remove the text clearing on focus - let user click without clearing the example text
  const handleFocus = () => {
    // Text will only be cleared when user actually starts typing (handled by useEffect above)
  };

  // Show the typed text as placeholder only when not searching and user hasn't typed anything
  const placeholderText = showTerminal ? "" : (!inputValue ? typedText : "");

  return <div className="mb-8">
      <div className="relative max-w-3xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          {/* Text Input Area */}
          <div className="px-4 py-4">
            {showTerminal ? (
              // Typewriter text display during search (like humorous examples)
              <div className={`w-full min-h-[48px] max-h-[200px] border-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-0 font-[Basic] resize-none overflow-hidden text-gray-400 flex items-start justify-start pt-3 ${isTerminalTyping ? 'after:content-["_"] after:animate-pulse after:ml-1' : ''}`}>
                {terminalTypedText && (
                  <div className="leading-relaxed">
                    {terminalTypedText}
                    {isTerminalTyping && <span className="animate-pulse">_</span>}
                  </div>
                )}
              </div>
            ) : (
              // Normal textarea
              <Textarea 
                placeholder={placeholderText} 
                className={`w-full min-h-[48px] max-h-[200px] border-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-0 font-[Basic] resize-none overflow-hidden placeholder:text-gray-400 ${isTyping ? 'placeholder:after:content-[_] placeholder:after:animate-pulse' : ''}`} 
                value={inputValue} 
                onChange={handleTextareaChange} 
                onKeyDown={handleKeyPress} 
                onFocus={handleFocus} 
                disabled={isProcessing} 
                rows={2} 
                style={{
                  height: 'auto',
                  minHeight: '48px'
                }} 
                ref={textareaRef}
              />
            )}
          </div>

          {/* Bottom Button Bar */}
          <div className="flex items-center justify-between px-4 py-3">
            {/* Left Side - Upload and Voice Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full hover:bg-canvas-bg flex-shrink-0 text-gray-600 border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm" onClick={handleFileUploadClick} disabled={isProcessing} title={t('chat.uploadFile')}>
                <Paperclip className="w-5 h-5" />
              </Button>

              {/* Voice Recording Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className={`w-10 h-10 p-0 rounded-full flex-shrink-0 border transition-all duration-200 shadow-sm ${isRecording ? 'bg-red-100 text-red-600 border-red-200 hover:border-red-300' : 'hover:bg-canvas-bg text-gray-600 border-gray-200 hover:border-gray-300'}`} 
                onClick={handleVoiceInput} 
                disabled={isProcessing} 
                title={isRecording ? t('chat.stopRecording') : t('chat.startRecording')}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
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