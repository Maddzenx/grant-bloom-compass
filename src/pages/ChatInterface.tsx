import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, FileText, Download, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Grant } from '@/types/grant';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { useChatAgent } from '@/hooks/useChatAgent';
import { ApplicationPreview } from '@/components/chat/ApplicationPreview';

const ChatInterface = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const grant = location.state?.grant as Grant;
  const [inputValue, setInputValue] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isTyping,
    applicationDraft,
    isDraftReady,
    sendMessage,
    exportDraft
  } = useChatAgent(grant);

  useEffect(() => {
    if (!grant) {
      navigate('/discover');
      return;
    }
  }, [grant, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handlePreviewClick = () => {
    if (isDraftReady && applicationDraft) {
      navigate('/business-plan-editor', {
        state: {
          draft: applicationDraft,
          grant: grant
        }
      });
    } else {
      setShowPreview(!showPreview);
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!grant) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Chat Area */}
      <div className={`flex flex-col ${showPreview ? 'w-1/2' : 'w-full'} bg-white`}>
        {/* Header */}
        <div className="border-b border-gray-200 p-4 bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/discover')}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Ansökan för {grant.title}
                </h1>
                <p className="text-sm text-gray-600">{grant.organization}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isDraftReady && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviewClick}
                    className="flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    {showPreview ? 'Dölj förhandsvisning' : 'Visa förhandsvisning'}
                  </Button>
                  <Button
                    size="sm"
                    onClick={exportDraft}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="w-4 h-4" />
                    Exportera utkast
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-center gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Skriv ditt svar här..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              size="sm"
              className="px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      {showPreview && isDraftReady && (
        <div className="w-1/2 border-l border-gray-200 bg-gray-50">
          <ApplicationPreview draft={applicationDraft} grant={grant} />
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
