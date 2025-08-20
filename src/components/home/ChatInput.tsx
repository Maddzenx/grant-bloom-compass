import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { Mic, Upload, Square, Sparkles, Plus, ArrowUp, Loader2, Paperclip, MicOff, X, FileText, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

// Dynamic humorous example generator
const generateHumorousExample = () => {
  const examples = ["Vi utvecklar en AI som hjälper föräldrar att förstå tonåringars memes och på så sätt rädda familjefester från pinsam tystnad", "Vi bygger en app som identifierar fåglar baserat på hur dömande de ser ut och hjälper ornitologer att förstå fågelpsykologi", "Vi forskar på varför USB-kablar alltid sitter åt fel håll första gången och skapar en revolutionerande lösning för USB-frustration", "Vi skapar en plattform som hjälper människor att hitta försvunna sockor i tvättmaskiner genom avancerad AI-analys", "Vi utvecklar en lösning som förklarar varför toast alltid landar med smöret nedåt och på så sätt räddar frukostar över hela landet", "Vi bygger en AI som analyserar hur länge folk stirrar på Netflix utan att välja något och hjälper dem att fatta beslut", "Vi forskar på varför katter alltid sitter på tangentbord när man jobbar och skapar kattvänliga arbetsplatser", "Vi utvecklar en app som hjälper personer att komma ihåg var de la sina bilnycklar genom avancerad minnesträning", "Vi skapar en lösning som förutsäger vilken kö i mataffären som kommer gå snabbast och minskar stress i vardagen", "Vi bygger en AI som översätter kattens mjau till mänskligt språk och förbättrar kommunikationen mellan husdjur och ägare", "Vi forskar på varför WI-FI aldrig fungerar när man verkligen behöver det och skapar stabilare internetlösningar", "Vi utvecklar en plattform som hjälper folk att förstå IKEA-instruktioner utan att gråta av frustration", "Vi skapar en app som analyserar varför män aldrig hittar saker som ligger framför dem och förbättrar synskärpan", "Vi bygger en AI som hjälper människor att välja rätt emoji för pinsamma situationer och förbättrar digital kommunikation", "Vi forskar på varför printers bara fungerar när IT-supporten kommer och skapar självfixande skrivare", "Vi utvecklar en lösning som förklarar varför klockan alltid känns långsammare när man väntar på något viktigt", "Vi skapar en app som hjälper folk att komma ihåg varför de gick in i ett rum och minskar förvirring i hemmet", "Vi bygger en AI som analyserar varför människor alltid kollar klockan flera gånger trots att den inte ändrats", "Vi forskar på varför kaffe aldrig smakar lika bra som på kaféet och skapar hembryggningslösningar", "Vi utvecklar en plattform som hjälper personer att komma ihåg varför de öppnade kylskåpet och minskar energiförbrukning"];
  return examples[Math.floor(Math.random() * examples.length)];
};
const PLACEHOLDER_TYPING_SPEED = 28; // ms per char when typing
const PLACEHOLDER_DELETE_SPEED = 15; // ms per char when deleting (faster)
const PLACEHOLDER_PAUSE_AFTER_TYPING = 2000; // pause after finishing typing
const PLACEHOLDER_PAUSE_AFTER_DELETING = 300; // short pause after deleting

function useAnimatedPlaceholder(isInputActive: boolean) {
  const [placeholder, setPlaceholder] = useState("");
  const [currentExample, setCurrentExample] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const charIndex = useRef(0);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const pauseTimeout = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (isInputActive) {
      setPlaceholder("");
      setIsDeleting(false);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      if (pauseTimeout.current) clearTimeout(pauseTimeout.current);
      return;
    }

    // Generate a new example if we don't have one or we're starting fresh
    if (!currentExample) {
      const newExample = generateHumorousExample();
      setCurrentExample(newExample);
      charIndex.current = 0;
      setIsDeleting(false);
      setPlaceholder("");
    }
    function animate() {
      const current = currentExample;
      if (!isDeleting) {
        // Typing phase
        setPlaceholder(current.slice(0, charIndex.current + 1));
        if (charIndex.current < current.length - 1) {
          charIndex.current++;
          typingTimeout.current = setTimeout(animate, PLACEHOLDER_TYPING_SPEED);
        } else {
          // Finished typing, pause then start deleting
          pauseTimeout.current = setTimeout(() => {
            setIsDeleting(true);
            typingTimeout.current = setTimeout(animate, PLACEHOLDER_DELETE_SPEED);
          }, PLACEHOLDER_PAUSE_AFTER_TYPING);
        }
      } else {
        // Deleting phase
        setPlaceholder(current.slice(0, charIndex.current));
        if (charIndex.current > 0) {
          charIndex.current--;
          typingTimeout.current = setTimeout(animate, PLACEHOLDER_DELETE_SPEED);
        } else {
          // Finished deleting, pause then generate new example
          pauseTimeout.current = setTimeout(() => {
            const newExample = generateHumorousExample();
            setCurrentExample(newExample);
            setIsDeleting(false);
            charIndex.current = 0;
            typingTimeout.current = setTimeout(animate, PLACEHOLDER_TYPING_SPEED);
          }, PLACEHOLDER_PAUSE_AFTER_DELETING);
        }
      }
    }
    typingTimeout.current = setTimeout(animate, 600); // initial delay

    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      if (pauseTimeout.current) clearTimeout(pauseTimeout.current);
    };
  }, [currentExample, isDeleting, isInputActive]);
  return placeholder;
}
interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  file: File;
}
interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  isRecording: boolean;
  isTranscribing: boolean;
  isProcessing: boolean;
  isSearching: boolean;
  handleVoiceInput: () => void;
  handleFileUpload: () => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}
const ChatInput = ({
  inputValue,
  setInputValue,
  isRecording,
  isTranscribing,
  isProcessing,
  isSearching,
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

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const animationRef = useRef<number>();

  // Inject keyframes for the loading bar only once
  useEffect(() => {
    const styleId = 'fill-bar-keyframes';
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.innerHTML = `@keyframes fill-bar { from { width: 0%; } to { width: 100%; } }`;
      document.head.appendChild(styleEl);
    }
  }, []);

  // Smooth container height transition: measure expanded height, then animate to 40px when searching
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isCompact, setIsCompact] = useState<boolean>(false);
  const loadingBarRef = useRef<HTMLDivElement>(null);
  const progressRafRef = useRef<number | null>(null);
  const waapiAnimRef = useRef<Animation | null>(null);

  // No measurement needed; we'll animate max-height for reliability

  // When loading starts: animate height using Web Animations API for reliability, and drive the bar via rAF
  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    if (isSearching) {
      // Cancel any running WAAPI animation
      try { waapiAnimRef.current?.cancel(); } catch {}
      const startH = el.getBoundingClientRect().height;
      setIsCompact(true);
      // Ensure a starting inline height so the card doesn't jump pre-animation
      el.style.height = `${startH}px`;
      // Animate with WAAPI
      const anim = el.animate([
        { height: `${startH}px` },
        { height: '40px' }
      ], {
        duration:1200,
        easing: 'ease',
        fill: 'forwards'
      });
      waapiAnimRef.current = anim;
      anim.onfinish = () => {
        el.style.height = '40px';
      };

      // Start JS-driven progress (fallback, very reliable)
      if (progressRafRef.current) cancelAnimationFrame(progressRafRef.current);
      const start = performance.now();
      const step = (now: number) => {
        const elapsed = now - start;
        const pct = Math.min(100, (elapsed / 10000) * 100);
        if (loadingBarRef.current) {
          loadingBarRef.current.style.width = pct + '%';
        }
        if (pct < 100) {
          progressRafRef.current = requestAnimationFrame(step);
        }
      };
      if (loadingBarRef.current) loadingBarRef.current.style.width = '0%';
      progressRafRef.current = requestAnimationFrame(step);
    } else {
      // Expand back to content height using WAAPI, then clear inline styles
      try { waapiAnimRef.current?.cancel(); } catch {}
      const currentH = el.getBoundingClientRect().height;
      const targetH = contentRef.current ? contentRef.current.offsetHeight : currentH;
      el.style.height = `${currentH}px`;
      const anim = el.animate([
        { height: `${currentH}px` },
        { height: `${targetH}px` }
      ], {
        duration: 300,
        easing: 'ease',
        fill: 'forwards'
      });
      waapiAnimRef.current = anim;
      anim.onfinish = () => {
        setIsCompact(false);
        el.style.height = '';
      };
      if (progressRafRef.current) cancelAnimationFrame(progressRafRef.current);
      progressRafRef.current = null;
      if (loadingBarRef.current) loadingBarRef.current.style.width = '0%';
    }
    return () => {
      if (progressRafRef.current) cancelAnimationFrame(progressRafRef.current);
    };
  }, [isSearching]);

  // Animated placeholder logic
  const animatedPlaceholder = useAnimatedPlaceholder(!!inputValue || isFocused);

  // Waveform animation effect
  useEffect(() => {
    if (isRecording) {
      const animate = () => {
        // Simulate realistic audio level fluctuations
        const baseLevel = 0.3;
        const variation = Math.sin(Date.now() * 0.01) * 0.3 + Math.random() * 0.4;
        setAudioLevel(Math.max(0, Math.min(1, baseLevel + variation)));
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      setAudioLevel(0);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRecording]);

  // Auto-resize textarea function
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Limit character count to 300 characters
    const maxChars = 300;
    if (e.target.value.length <= maxChars) {
      setInputValue(e.target.value);

      // Auto-resize the textarea with better dynamic sizing
      const textarea = e.target;
      textarea.style.height = 'auto';

      // Calculate the new height based on content
      const newHeight = Math.max(48, Math.min(textarea.scrollHeight, 400)); // Min 48px, Max 400px
      textarea.style.height = newHeight + 'px';
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && inputValue.trim()) {
      e.preventDefault();
      onSubmit();
    } else if (e.key === 'Tab' && !inputValue && animatedPlaceholder) {
      e.preventDefault();
      setInputValue(animatedPlaceholder);
    }
  };
  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSubmit();
    }
  };
  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles: UploadedFile[] = Array.from(files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        file: file
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
    // Reset the input value so the same file can be selected again
    event.target.value = '';
    if (onFileSelect) {
      onFileSelect(event);
    }
  };
  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('doc') || fileType.includes('docx')) return '📝';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('txt')) return '📄';
    return '📎';
  };

  // Format timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Remove the text clearing on focus - let user click without clearing the example text
  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleBlur = () => {
    setIsFocused(false);
  };

  // Auto-resize textarea when inputValue changes
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      const newHeight = Math.max(48, Math.min(textarea.scrollHeight, 400));
      textarea.style.height = newHeight + 'px';
    }
  }, [inputValue]);

  // Show the typed text as placeholder only when not searching and user hasn't typed anything
  const placeholderText = !inputValue && !isFocused && animatedPlaceholder ? animatedPlaceholder : "";
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  return <div className="mb-8">
      <div className="relative max-w-3xl mx-auto">
        <div
          ref={cardRef}
          className="relative bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
        >
          {/* Normal content layer (fades out when searching) */}
          <div
            ref={contentRef}
            className={`transition-opacity duration-300 ${isSearching ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            {/* File Attachments Section */}
            {uploadedFiles.length > 0 && (
              <div className="px-4 pt-4 pb-2 flex flex-wrap gap-2">
                {uploadedFiles.map(file => (
                  <div key={file.id} className="flex items-center gap-2 bg-gray-100 rounded px-2 py-1 text-xs">
                    <span>{getFileIcon(file.type)}</span>
                    <span>{file.name}</span>
                    <span className="text-gray-400">({formatFileSize(file.size)})</span>
                    <button onClick={() => removeFile(file.id)} className="ml-1 text-gray-400 hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Text Input Area */}
            <div className="px-4 py-4" style={{ overflow: 'hidden' }}>
              <div className="block w-full">
                {/* Normal textarea */}
                <div className="w-full relative">
                  <Textarea
                    placeholder=""
                    className="w-full min-h-[48px] border-0 bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-0 font-[Basic] resize-none overflow-y-auto placeholder:text-gray-400 text-left align-top"
                    value={inputValue}
                    onChange={handleTextareaChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyDown={handleKeyPress}
                    ref={textareaRef}
                    rows={1}
                    maxLength={300}
                    disabled={isProcessing}
                    style={{ textAlign: 'left', verticalAlign: 'top' }}
                  />
                  {/* Animated placeholder overlay */}
                  {(!inputValue && !isFocused && animatedPlaceholder) && (
                    <div className="absolute left-0 top-0 pointer-events-none text-gray-400 select-none text-base px-0 py-0">
                      {animatedPlaceholder}
                    </div>
                  )}
                </div>

                {/* Submit Button and Bottom Left Buttons */}
                <div className="flex items-end justify-between mt-2">
                  <div className="flex items-center gap-2">
                    {/* File Upload Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0 rounded-full hover:bg-canvas-bg flex-shrink-0 text-gray-600 border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm"
                      onClick={handleFileUploadClick}
                      disabled={isProcessing}
                      title={t('chat.uploadFile')}
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>

                    {/* Voice Recording Button */}
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`w-8 h-8 p-0 rounded-full flex-shrink-0 border transition-all duration-300 ${
                          isRecording 
                            ? 'bg-red-500 text-white border-red-500 shadow-lg scale-110' 
                            : 'hover:bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={handleVoiceInput}
                        disabled={isProcessing}
                        title={isRecording ? 'Stoppa inspelning' : isTranscribing ? 'Transkriberar...' : 'Starta röstinspelning'}
                      >
                        {isRecording ? (
                          <div className="w-3 h-3 bg-white rounded-full" />
                        ) : (
                          <Mic className="w-4 h-4" />
                        )}
                      </Button>
                      
                      {/* Recording indicator */}
                      {isRecording && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      )}
                    </div>
                  </div>
                  {/* Submit Button */}
                  <Button
                    onClick={handleSubmit}
                    disabled={isProcessing || !inputValue.trim()}
                    size="sm"
                    title="Hitta bidrag"
                    className="w-10 h-10 p-0 rounded-full flex-shrink-0 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 bg-[#cec5f9] hover:bg-[#8162F4]"
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
            <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif" onChange={handleFileSelect} className="hidden" />
          </div>

          {/* Loading bar layer (fades in when searching) */}
          <div
          className={`absolute inset-0 transition-opacity duration-300 ${isSearching ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <div className="relative w-full h-full">
              <div
                ref={loadingBarRef}
                className="absolute left-0 top-0 h-full bg-[#cec5f9]"
                style={{ width: '0%' }}
              />
            </div>
          </div>
        </div>
        {/* test/debug controls removed */}
      </div>
    </div>;
};
export default ChatInput;