import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { X } from 'lucide-react';

interface BetaSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BetaSignupModal = ({ isOpen, onClose }: BetaSignupModalProps) => {
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [commentError, setCommentError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    // Clear email error when user starts typing
    if (emailError) {
      setEmailError('');
    }
    
    // Clear general error message when user starts typing
    if (submitStatus === 'error') {
      setSubmitStatus('idle');
      setErrorMessage('');
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setComment(value);
    
    // Clear comment error when user starts typing
    if (commentError) {
      setCommentError('');
    }
    
    // Validate comment length in real-time
    if (value.length > 500) {
      setCommentError('Kommentaren får inte vara längre än 500 tecken');
    } else {
      setCommentError('');
    }
  };

  const resetForm = () => {
    setEmail('');
    setComment('');
    setEmailError('');
    setCommentError('');
    setErrorMessage('');
    setSubmitStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrorMessage('');
    setEmailError('');
    setCommentError('');
    setSubmitStatus('idle');

    let hasErrors = false;

    // Validate email
    if (!email.trim()) {
      setEmailError('E-postadress är obligatorisk');
      hasErrors = true;
    } else if (!validateEmail(email.trim())) {
      setEmailError('Vänligen ange en giltig e-postadress (t.ex. namn@exempel.se)');
      hasErrors = true;
    }

    // Validate comment length if provided
    if (comment && comment.length > 500) {
      setCommentError('Kommentaren får inte vara längre än 500 tecken');
      hasErrors = true;
    }

    if (hasErrors) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if email already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('waitlist_subscribers')
        .select('email')
        .eq('email', email.trim().toLowerCase())
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Database check error:', checkError);
        throw new Error('Kunde inte kontrollera om e-postadressen redan finns. Försök igen senare.');
      }

      if (existingUser) {
        setErrorMessage('Denna e-postadress är redan registrerad på vår intresselista');
        setSubmitStatus('error');
        return;
      }

      // Insert new subscriber
      const { error: insertError } = await supabase
        .from('waitlist_subscribers')
        .insert([
          {
            email: email.trim().toLowerCase(),
            comment: comment.trim() || '',
            subscribed_at: new Date().toISOString()
          }
        ]);

      if (insertError) {
        console.error('Database insert error:', insertError);
        
        // Handle specific database errors
        if (insertError.code === '23505') { // Unique constraint violation
          setErrorMessage('Denna e-postadress är redan registrerad');
        } else if (insertError.code === '23502') { // Not null violation
          setErrorMessage('E-postadress är obligatorisk');
        } else if (insertError.message.includes('network') || insertError.message.includes('connection')) {
          setErrorMessage('Nätverksfel. Kontrollera din internetanslutning och försök igen.');
        } else {
          setErrorMessage('Kunde inte spara din registrering. Försök igen senare.');
        }
        
        setSubmitStatus('error');
        return;
      }

      setSubmitStatus('success');
      setEmail('');
      setComment('');
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setSubmitStatus('idle');
      }, 2000);

    } catch (error) {
      console.error('Error submitting waitlist subscription:', error);
      
      // Handle different types of errors
      if (error instanceof Error) {
        if (error.message.includes('fetch') || error.message.includes('network')) {
          setErrorMessage('Nätverksfel. Kontrollera din internetanslutning och försök igen.');
        } else if (error.message.includes('timeout')) {
          setErrorMessage('Förfrågan tog för lång tid. Försök igen senare.');
        } else {
          setErrorMessage(error.message);
        }
      } else {
        setErrorMessage('Ett oväntat fel uppstod. Försök igen senare.');
      }
      
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={() => {
            resetForm();
            onClose();
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isSubmitting}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Registrera ditt intresse
          </h2>
          <p className="text-gray-600 text-sm">
            Få reda på när vi släpper den färdiga versionen
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-postadress *
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                emailError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="din@email.se"
              required
              disabled={isSubmitting}
            />
            {emailError && (
              <p className="text-red-600 text-sm mt-1">{emailError}</p>
            )}
          </div>

          {/* Comment field */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
              Kommentar (valfritt)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={handleCommentChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                commentError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Har du några tankar eller önskemål?"
              rows={3}
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center mt-1">
              {commentError && (
                <p className="text-red-600 text-sm">{commentError}</p>
              )}
              <p className={`text-xs ml-auto ${comment.length > 450 ? 'text-orange-600' : 'text-gray-500'}`}>
                {comment.length}/500
              </p>
            </div>
          </div>

          {/* Error message */}
          {submitStatus === 'error' && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {errorMessage}
            </div>
          )}

          {/* Success message */}
          {submitStatus === 'success' && (
            <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md">
              Tack för din registrering! Vi hör av oss när den färdiga versionen är klar.
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Registrerar...' : 'Registrera intresse'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BetaSignupModal; 