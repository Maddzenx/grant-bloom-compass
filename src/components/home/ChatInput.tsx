import React, { useRef, useState, useEffect, useCallback } from "react";
import { Mic, Upload, Square, Sparkles, Plus, ArrowUp, Loader2, Paperclip, MicOff, X, FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useHumorousExamples } from "@/hooks/useHumorousExamples";
import { useSearchStatusMessages } from "@/hooks/useSearchStatusMessages";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";

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
  const { isRecording: isVoiceRecording, isTranscribing, startRecording, stopRecording, cancelRecording } = useVoiceRecording();
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

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // Voice recording states
  const [transcribedText, setTranscribedText] = useState('');
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(20).fill(0));
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
                    // Natural typing speed with slight variation (25-45ms per letter)
                    const delay = Math.random() * 20 + 25;
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

          // Natural typing speed with slight variation (25-45ms per letter)
          const delay = Math.random() * 20 + 25;
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Real-time audio analysis for waveform
  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current || !dataArrayRef.current) return;

    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    
    // Convert frequency data to waveform levels
    const levels: number[] = [];
    const step = Math.floor(dataArrayRef.current.length / 20);
    
    for (let i = 0; i < 20; i++) {
      const start = i * step;
      const end = start + step;
      const sum = dataArrayRef.current.slice(start, end).reduce((a, b) => a + b, 0);
      const average = sum / step;
      // Normalize to 0-100 range and scale for visual display
      const normalizedLevel = Math.min(100, (average / 255) * 300);
      levels.push(normalizedLevel);
    }
    
    // Create a more realistic waveform that builds from right to left
    const newLevels = [...audioLevels];
    const currentTime = Date.now();
    const timeIndex = Math.floor((currentTime % 2000) / 100); // Update every 100ms
    
    // Shift existing levels to the left and add new level at the end
    newLevels.shift();
    newLevels.push(levels[Math.floor(levels.length / 2)]); // Use middle frequency for simplicity
    
    setAudioLevels(newLevels);
    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  }, [audioLevels]);

  // Timer effect for recording duration
  useEffect(() => {
    if (isVoiceRecording && recordingStartTime) {
      timerRef.current = setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - recordingStartTime) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRecordingDuration(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isVoiceRecording, recordingStartTime]);

  // ChatGPT-style voice recording handlers
  const handleVoiceRecording = async () => {
    if (isVoiceRecording) {
      // Stop recording and get transcribed text
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      const text = await stopRecording();
      if (text) {
        setTranscribedText(text);
        setInputValue(inputValue + (inputValue ? ' ' : '') + text);
      }
      setAudioLevels(new Array(20).fill(0));
      setRecordingStartTime(null);
      setRecordingDuration(0);
    } else {
      // Start recording with audio analysis
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            sampleRate: 44100,
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });

        // Set up audio analysis
        audioContextRef.current = new AudioContext();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        analyserRef.current.smoothingTimeConstant = 0.8;
        
        source.connect(analyserRef.current);
        dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
        
        // Start audio analysis and timer
        analyzeAudio();
        setRecordingStartTime(Date.now());
        
        // Start recording
        await startRecording();
      } catch (error) {
        console.error('Error setting up audio analysis:', error);
        // Fallback to regular recording without analysis
        await startRecording();
      }
    }
  };

  const handleCancelRecording = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    cancelRecording();
    setTranscribedText('');
    setAudioLevels(new Array(20).fill(0));
    setRecordingStartTime(null);
    setRecordingDuration(0);
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

    // Auto-resize the textarea with better dynamic sizing
    const textarea = e.target;
    textarea.style.height = 'auto';
    
    // Calculate the new height based on content
    const newHeight = Math.max(48, Math.min(textarea.scrollHeight, 400)); // Min 48px, Max 400px
    textarea.style.height = newHeight + 'px';
  };

  // Remove the text clearing on focus - let user click without clearing the example text
  const handleFocus = () => {
    // Text will only be cleared when user actually starts typing (handled by useEffect above)
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
  const placeholderText = showTerminal ? "" : (!inputValue ? typedText : "");

  return <div className="mb-8">
      <div className="relative max-w-3xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          {/* File Attachments Section */}
          {uploadedFiles.length > 0 && (
            <div className="px-4 pt-4 pb-2 border-b border-gray-100">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">{getFileIcon(file.type)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{file.name}</span>
                      <span className="text-xs text-gray-500">{file.type.toUpperCase()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Voice Recording Interface */}
          {isVoiceRecording ? (
            <div className="px-4 py-4">
              {/* Waveform inside text area */}
              <div className="relative min-h-[48px] flex items-center justify-center">
                {/* Dotted baseline */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-px bg-gray-300" style={{
                    backgroundImage: 'repeating-linear-gradient(to right, #d1d5db 0px, #d1d5db 4px, transparent 4px, transparent 8px)'
                  }}></div>
                </div>
                
                {/* Waveform bars */}
                <div className="flex items-center gap-1 h-8 relative z-10">
                  {audioLevels.map((level, i) => (
                    <div
                      key={i}
                      className="w-1 bg-black rounded-full transition-all duration-150 ease-out"
                      style={{
                        height: `${Math.max(2, level * 0.3)}px`,
                        opacity: level > 0 ? 1 : 0.2
                      }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Simple controls at bottom */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <Plus className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="text-sm text-gray-600">Tools</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelRecording}
                    className="w-8 h-8 p-0 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleVoiceRecording}
                    className="w-8 h-8 p-0 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600"
                  >
                    <Square className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* Text Input Area */
            <div className="px-4 py-4">
              {/* Transcription Status */}
              {isTranscribing && (
                <div className="mb-4 flex items-center justify-center">
                  <div className="inline-flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-full">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Transkriberar ljud...</span>
                  </div>
                </div>
              )}
              
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
                  className={`w-full min-h-[48px] border-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-0 font-[Basic] resize-none overflow-y-auto placeholder:text-gray-400 ${isTyping ? 'placeholder:after:content-[_] placeholder:after:animate-pulse' : ''}`} 
                  value={inputValue} 
                  onChange={handleTextareaChange} 
                  onKeyDown={handleKeyPress} 
                  onFocus={handleFocus} 
                  disabled={isProcessing} 
                  rows={1} 
                  style={{
                    height: 'auto',
                    minHeight: '48px',
                    maxHeight: '400px'
                  }} 
                  ref={textareaRef}
                />
              )}
            </div>
          )}

          {/* Bottom Button Bar */}
          <div className="flex items-center justify-between px-4 py-3">
            {/* Left Side - Upload and Voice Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full hover:bg-canvas-bg flex-shrink-0 text-gray-600 border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm" onClick={handleFileUploadClick} disabled={isProcessing} title={t('chat.uploadFile')}>
                <Paperclip className="w-5 h-5" />
              </Button>

              {/* Voice Recording Button - Only show when not recording */}
              {!isVoiceRecording && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-10 h-10 p-0 rounded-full flex-shrink-0 border hover:bg-canvas-bg text-gray-600 border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm" 
                  onClick={handleVoiceRecording} 
                  disabled={isProcessing || isTranscribing} 
                  title="Starta inspelning"
                >
                  <Mic className="w-5 h-5" />
                </Button>
              )}
            </div>

            {/* Right Side - Submit Button */}
            <div className="flex items-center gap-2">
              {/* Submit Button */}
              <Button onClick={handleSubmit} disabled={isProcessing || !inputValue.trim()} size="sm" title="Hitta bidrag" className="w-10 h-10 p-0 rounded-full flex-shrink-0 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 bg-[#cec5f9] hover:bg-[#8162F4]">
                {isProcessing ? <Loader2 className="w-7 h-7 animate-spin" /> : <ArrowUp className="w-7 h-7" />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Hidden File Input */}
        <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif" onChange={handleFileSelect} className="hidden" />
        
        {/* Enhanced Search Info - Hidden loading indicator */}
        <div className="mt-3 text-center">
          {/* Loading indicator removed */}
        </div>
      </div>
    </div>;
};

export default ChatInput;