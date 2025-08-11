import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, CheckCircle, Star, ArrowRight, Sparkles, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import EmailSignupInput from '@/components/ui/EmailSignupInput';
import { supabase } from '@/lib/supabase';

interface InterestPageProps {
  onClose: () => void;
}

const InterestPage: React.FC<InterestPageProps> = ({ onClose }) => {
  const [paymentInterest, setPaymentInterest] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchUserCount();
    return () => setMounted(false);
  }, []);

  const fetchUserCount = async () => {
    try {
      // Get count of waitlist subscribers
      const { count, error } = await supabase
        .from('waitlist_subscribers')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Failed to fetch user count:', error);
        setUserCount(1247); // Fallback
      } else {
        setUserCount(count || 0);
      }
    } catch (error) {
      console.error('Failed to fetch user count:', error);
      setUserCount(1247); // Fallback
    }
  };



  const handleEmailSubmit = async (email: string) => {
    setIsLoading(true);
    
    try {
      // Validate email before making database calls
      if (!email || !email.trim()) {
        toast.error('Vänligen ange en e-postadress');
        setIsLoading(false);
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error('Vänligen ange en giltig e-postadress');
        setIsLoading(false);
        return;
      }

      // Check if email already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('waitlist_subscribers')
        .select('email')
        .eq('email', email.trim())
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing user:', checkError);
        throw new Error('Database error');
      }

      if (existingUser) {
        toast.error('Denna e-postadress är redan registrerad');
        setIsLoading(false);
        return;
      }

      // Insert new subscriber
      const { data, error } = await supabase
        .from('waitlist_subscribers')
        .insert([
          {
            email: email.trim(),
            payment_interest: paymentInterest || 0,
            payment_amount: paymentAmount || '',
            comment: comment || '',
            subscribed_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) {
        console.error('Error inserting subscriber:', error);
        throw new Error('Failed to save subscriber');
      }

      console.log('Email submission saved to database:', {
        email,
        paymentInterest,
        paymentAmount,
        comment
      });

    } catch (error) {
      console.error('Error saving to database:', error);
      toast.error('Kunde inte spara till databasen. Försök igen senare.');
      setIsLoading(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  const handleFeedbackSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Check if there's any feedback to submit
      if (!paymentAmount.trim() && !comment.trim()) {
        toast.error('Vänligen fyll i åtminstone ett fält för feedback');
        setIsLoading(false);
        return;
      }

      // Insert feedback with a unique email placeholder
      const timestamp = new Date().getTime();
      const uniqueEmail = `feedback-${timestamp}@placeholder.com`;
      
      const { data, error } = await supabase
        .from('waitlist_subscribers')
        .insert([
          {
            email: uniqueEmail, // Use unique placeholder email
            payment_interest: paymentInterest || 0,
            payment_amount: paymentAmount || '',
            comment: comment || '',
            subscribed_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) {
        console.error('Error inserting feedback:', error);
        throw new Error('Failed to save feedback');
      }

      console.log('Feedback saved to database:', {
        paymentInterest,
        paymentAmount,
        comment
      });

      // Clear the form
      setPaymentAmount('');
      setComment('');
      setPaymentInterest(0);

      toast.success('Tack för din feedback!');

    } catch (error) {
      console.error('Error saving feedback:', error);
      toast.error('Kunde inte spara feedback. Försök igen senare.');
      setIsLoading(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const getInterestLabel = (value: number) => {
    if (value <= -3) return 'Inte alls intresserad';
    if (value <= -1) return 'Lite intresserad';
    if (value === 0) return 'Neutral';
    if (value <= 2) return 'Ganska intresserad';
    if (value <= 4) return 'Mycket intresserad';
    return 'Jag skulle absolut betala';
  };

  const getInterestColor = (value: number) => {
    if (value <= -3) return 'text-red-600 bg-red-50';
    if (value <= -1) return 'text-amber-600 bg-amber-50';
    if (value === 0) return 'text-gray-600 bg-gray-50';
    if (value <= 2) return 'text-zinc-700 bg-zinc-100';
    if (value <= 4) return 'text-[#7D54F4] bg-[#f3efff]';
    return 'text-green-600 bg-green-50';
  };

  if (isSubmitted) {
    return createPortal(
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300 z-50">
        <Card className="w-full max-w-md p-8 text-center bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Tack för ditt intresse!
            </h2>
            <p className="text-gray-600 mb-4">
              Vi hör av oss när ansökningsfunktionen är redo.
            </p>
            
          </div>
          <Button 
            onClick={onClose}
            className="w-full text-white py-3 font-semibold rounded-xl bg-gray-600 hover:bg-gray-700"
          >
            Stäng
          </Button>
        </Card>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300 z-50"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
                {/* Header */}
        <div className="p-6 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-full p-2 border border-gray-200 bg-white shadow-sm"
          >
            <X className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Ansökningsfunktionen kommer snart!
          </h1>
          <p className="text-gray-500 text-base">
            Var en av de första att testa den nya funktionen
          </p>
        </div>



        {/* Main Content */}
        <div className="px-6 space-y-6">
          
          {/* Email Section */}
          <div className="space-y-4">
            <EmailSignupInput
              onSubmit={handleEmailSubmit}
              isLoading={isLoading}
              placeholder="Din e-postadress"
              buttonText="Bli informerad"
              privacyText="Din e-post används endast för denna notifiering"
            />
          </div>

          {/* Features Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 text-center">
              Vad kommer du att kunna göra?
            </h3>
            <div className="space-y-3">
               <div className="flex items-center gap-3">
                 <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                 <span className="text-gray-700 text-sm">Tolka kriterier och mallar tydligt</span>
               </div>
               <div className="flex items-center gap-3">
                 <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                 <span className="text-gray-700 text-sm">Få konkret feedback på språk och innehåll</span>
               </div>
               <div className="flex items-center gap-3">
                 <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                 <span className="text-gray-700 text-sm">Se vad som kan förbättras i dina ansökningar</span>
               </div>
               <div className="flex items-center gap-3">
                 <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                 <span className="text-gray-700 text-sm">Generera en ansökan baserat på dina dokument</span>
               </div>
             </div>
          </div>

          {/* Feedback Section */}
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Hjälp oss hjälpa dig!
              </h2>
              <p className="text-gray-500 text-sm">Din feedback hjälper oss att skapa bästa möjliga upplevelse</p>
            </div>
            
            <div className="space-y-4">
              {/* Payment Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vad skulle du betala för denna funktion? (kr/mån)
                </label>
                                                    <Input
                    type="text"
                    placeholder="T.ex. 299 kr/mån"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="h-11 text-sm px-3 rounded-lg border border-gray-200 !focus:outline-none !focus:ring-0 !focus:border-gray-200 placeholder:text-gray-400 bg-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                  </p>
              </div>

              {/* Comments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Har du några tankar eller förslag?
                </label>
                <textarea
                  placeholder="Dela dina tankar om funktionen..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full h-20 text-sm px-3 py-2 rounded-lg border border-gray-200 !focus:outline-none !focus:ring-0 !focus:border-gray-200 resize-none placeholder:text-gray-400 bg-white"
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <Button
            onClick={handleFeedbackSubmit}
            disabled={isLoading}
            className="w-full h-8 text-black text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E5DEFD]"
            style={{ backgroundColor: '#CEC5F9' }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Skickar in svar...</span>
              </div>
            ) : (
              <span>Skicka in svar</span>
            )}
          </Button>
        </div>
      </Card>
    </div>,
    document.body
  );
};

export default InterestPage; 