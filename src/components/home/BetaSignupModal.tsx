import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { CheckCircle, Loader2 } from 'lucide-react';

interface BetaSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BetaSignupModal: React.FC<BetaSignupModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Vänligen ange din e-postadress');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Vänligen ange en giltig e-postadress');
      return;
    }

    setIsLoading(true);

    try {
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
      const { error } = await supabase
        .from('waitlist_subscribers')
        .insert([
          {
            email: email.trim(),
            comment: comment.trim() || null,
            subscribed_at: new Date().toISOString()
          }
        ]);

      if (error) {
        console.error('Error inserting subscriber:', error);
        throw error;
      }

      setIsSubmitted(true);
      toast.success('Tack! Du har nu anmält dig till vår intresselista.');
      
    } catch (error) {
      console.error('Failed to submit:', error);
      toast.error('Ett fel uppstod. Vänligen försök igen.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setComment('');
    setIsSubmitted(false);
    setIsLoading(false);
    onClose();
  };

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center text-center py-6">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Tack för din anmälan!</h3>
            <p className="text-muted-foreground mb-6">
              Vi kommer att kontakta dig så snart den färdiga versionen är redo.
            </p>
            <Button onClick={handleClose}>Stäng</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Anmäl dig till intresselistan</DialogTitle>
          <DialogDescription>
            Få besked när den färdiga versionen av allautlysningar släpps.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              E-postadress *
            </label>
            <Input
              id="email"
              type="email"
              placeholder="din@email.se"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium">
              Kommentar (valfritt)
            </label>
            <Textarea
              id="comment"
              placeholder="Lämna gärna en kommentar..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Avbryt
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Anmäler...
                </>
              ) : (
                'Anmäl dig'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BetaSignupModal;