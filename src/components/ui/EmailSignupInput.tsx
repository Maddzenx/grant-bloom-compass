import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface EmailSignupInputProps {
  onSubmit: (email: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  buttonText?: string;
  privacyText?: string;
  className?: string;
}

const EmailSignupInput: React.FC<EmailSignupInputProps> = ({
  onSubmit,
  isLoading = false,
  placeholder = "Din e-postadress",
  buttonText = "Bli informerad",
  privacyText = "Din e-post används endast för denna notifiering",
  className = ""
}) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (emailError) {
      setEmailError('');
    }
  };

  const handleSubmit = () => {
    if (!email.trim()) {
      setEmailError('Vänligen ange din e-postadress');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Vänligen ange en giltig e-postadress');
      return;
    }

    onSubmit(email);
  };

  return (
    <div className={className}>
      <div className="flex rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <Input
          type="email"
          placeholder={placeholder}
          value={email}
          onChange={handleEmailChange}
          className={`flex-1 h-12 text-sm px-4 border-0 rounded-none transition-all duration-200 placeholder:text-gray-400 bg-white !focus:outline-none !focus:ring-0 !focus:border-0 !focus:border-transparent ${
            emailError 
              ? '!border-red-300' 
              : ''
          }`}
        />
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !email.trim() || !!emailError}
          className="h-12 px-6 text-black text-sm font-medium rounded-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#c5b8f8] whitespace-nowrap border-0"
          style={{ backgroundColor: '#d7cffc' }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Skickar...</span>
            </div>
          ) : (
            <span>{buttonText}</span>
          )}
        </Button>
      </div>
      <p className="text-xs text-gray-400 text-center mt-1 mb-3">
        {privacyText}
      </p>
      {emailError && (
        <p className="text-red-500 text-sm">{emailError}</p>
      )}
    </div>
  );
};

export default EmailSignupInput; 