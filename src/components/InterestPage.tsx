import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Heart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface InterestPageProps {
  onClose: () => void;
}

const InterestPage: React.FC<InterestPageProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [paymentInterest, setPaymentInterest] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [interestCount] = useState(47);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const handleSubmit = async () => {
    if (!email.trim()) {
      toast.error('Vänligen ange din e-postadress');
      return;
    }

    console.log('Interest submission:', {
      email,
      paymentInterest: paymentInterest,
      paymentAmount,
      comment
    });

    setIsSubmitted(true);
    toast.success('Tack för ditt intresse!');
  };

  const getInterestLabel = (value: number) => {
    if (value <= -3) return 'Inte alls intresserad';
    if (value <= -1) return 'Lite intresserad';
    if (value === 0) return 'Neutral';
    if (value <= 2) return 'Ganska intresserad';
    if (value <= 4) return 'Mycket intresserad';
    return 'Jag skulle absolut betala';
  };

  if (isSubmitted) {
    return createPortal(
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          zIndex: 999999,
          isolation: 'isolate'
        }}
      >
        <Card 
          className="w-full max-w-md lg:max-w-lg p-8 lg:p-12 text-center bg-white rounded-2xl shadow-2xl border-0" 
          style={{ 
            position: 'relative', 
            zIndex: 1000000,
            isolation: 'isolate'
          }}
        >
          <div className="mb-8">
            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 lg:w-12 lg:h-12 text-green-600" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-ink-obsidian mb-4">
              Tack!
            </h2>
            <p className="text-ink-secondary text-lg lg:text-xl leading-relaxed">
              Ditt intresse hjälper oss prioritera rätt funktioner.
            </p>
          </div>
          <Button 
            onClick={onClose}
            className="w-full text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            style={{ backgroundColor: '#8B5CF6' }}
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
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        zIndex: 999999,
        isolation: 'isolate'
      }}
    >
      <Card 
        className="w-full max-w-4xl lg:max-w-5xl p-6 lg:p-12 bg-white rounded-2xl shadow-2xl border-0 max-h-[90vh] overflow-y-auto" 
        style={{ 
          position: 'relative', 
          zIndex: 1000000,
          isolation: 'isolate'
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-8 lg:mb-12">
          <div className="flex-1 pr-4">
            <h1 className="text-3xl lg:text-4xl font-bold text-ink-obsidian mb-3 lg:mb-4 leading-tight">
              Funktionen är snart redo
            </h1>
            <p className="text-ink-secondary text-lg lg:text-xl leading-relaxed">
              Vi arbetar hårt för att få ansökningsfunktionen klar. Håll dig uppdaterad!
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-ink-secondary hover:text-ink-obsidian hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-3 mb-8 lg:mb-12 p-4 lg:p-6 bg-gray-50 rounded-2xl border border-gray-200">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 lg:w-6 lg:h-6 text-ink-obsidian" />
          </div>
          <span className="text-ink-obsidian font-semibold text-lg lg:text-xl">
            {interestCount} personer har redan visat intresse
          </span>
        </div>

        {/* Main Content - Responsive Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Email Section */}
          <div className="space-y-6">
            {/* Email Notification Section */}
            <div className="bg-gray-50 p-6 lg:p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gray-100 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 lg:w-7 lg:h-7 text-ink-obsidian" />
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-ink-obsidian">
                  Få meddelande när det är klart
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Din e-postadress"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 h-14 text-lg px-4 rounded-xl border-2 border-gray-200 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-all duration-200"
                  />
                  <Button 
                    onClick={handleSubmit}
                    className="text-white whitespace-nowrap h-14 px-8 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    style={{ backgroundColor: '#8B5CF6' }}
                  >
                    Meddela mig
                  </Button>
                </div>
                                  <p className="text-sm text-ink-secondary text-center">
                    Din e-post används endast för denna notifiering — inget spam.
                  </p>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Interest Section */}
          <div className="space-y-6">
            {/* Divider */}
            <div className="relative lg:hidden">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
                               <div className="relative flex justify-center text-sm">
                   <span className="px-4 bg-white text-ink-secondary font-medium">eller ännu bättre...</span>
                 </div>
            </div>

            {/* Payment Interest Section */}
            <div className="bg-gray-50 p-6 lg:p-8 rounded-2xl">
              <h2 className="text-xl lg:text-2xl font-bold text-ink-obsidian mb-6">
                Hur intresserad är du av att betala för denna tjänst?
              </h2>
              
              <div className="space-y-6">
                <div>
                  <div className="px-2 mb-6">
                    <Slider
                      value={[paymentInterest]}
                      onValueChange={(value) => setPaymentInterest(value[0])}
                      max={5}
                      min={-5}
                      step={1}
                      className="w-full"
                    />
                                         <div className="flex justify-between text-sm text-ink-secondary mt-3">
                       <span className="font-medium">-5</span>
                       <span className="font-medium">0</span>
                       <span className="font-medium">+5</span>
                     </div>
                     <div className="flex justify-between text-xs text-ink-secondary mt-1">
                       <span>Inte alls</span>
                       <span>Neutral</span>
                       <span>Absolut</span>
                     </div>
                  </div>
                                     <div className="text-center">
                     <p className="text-lg lg:text-xl font-semibold text-ink-obsidian bg-gray-100 px-4 py-2 rounded-lg inline-block">
                       {getInterestLabel(paymentInterest)}
                     </p>
                   </div>
                </div>

                <div>
                                     <label className="block text-lg lg:text-xl font-semibold text-ink-obsidian mb-3">
                     Vad skulle du kunna tänka dig att betala? (kr)
                   </label>
                                       <Input
                       type="number"
                       placeholder="T.ex. 299"
                       value={paymentAmount}
                       onChange={(e) => setPaymentAmount(e.target.value)}
                       className="w-full h-14 text-lg px-4 rounded-xl border-2 border-gray-200 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-all duration-200"
                     />
                                          <p className="text-sm text-ink-secondary mt-2">
                       Valfritt — hjälper oss förstå vad funktionen är värd
                     </p>
                   </div>

                   <div>
                     <label className="block text-lg lg:text-xl font-semibold text-ink-obsidian mb-3">
                       Har du några kommentarer eller förslag?
                     </label>
                     <textarea
                       placeholder="Dela dina tankar om funktionen, vad du skulle vilja se, eller andra förslag..."
                       value={comment}
                       onChange={(e) => setComment(e.target.value)}
                       className="w-full h-32 text-lg px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-all duration-200 resize-none"
                       rows={4}
                     />
                     <p className="text-sm text-ink-secondary mt-2">
                       Valfritt — hjälper oss förbättra funktionen
                     </p>
                   </div>
                 </div>
               </div>
             </div>
        </div>

        {/* Submit Button - Full Width */}
        <div className="mt-8 lg:mt-12">
          <Button 
            onClick={handleSubmit}
            className="w-full text-white py-4 text-lg lg:text-xl font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            style={{ backgroundColor: '#8B5CF6' }}
          >
            Skicka in mina svar
          </Button>
        </div>
      </Card>
    </div>,
    document.body
  );
};

export default InterestPage; 