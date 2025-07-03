
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          toast({
            title: "Inloggning misslyckades",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        const redirectUrl = `${window.location.origin}/`;
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl
          }
        });
        
        if (error) {
          toast({
            title: "Registrering misslyckades",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Registrering lyckades",
            description: "Kontrollera din e-post för att verifiera ditt konto.",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Ett fel uppstod",
        description: "Försök igen senare.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas-cloud flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-newsreader font-normal mb-2">
              <span style={{ color: '#000000' }}>gr</span>
              <span style={{ color: '#8162F4' }}>ai</span>
              <span style={{ color: '#000000' }}>gent</span>
            </h1>
            <p className="text-gray-600">
              {isLogin ? 'Logga in på ditt konto' : 'Skapa ett nytt konto'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <Label htmlFor="email">E-post</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
                placeholder="din@email.com"
              />
            </div>

            <div>
              <Label htmlFor="password">Lösenord</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
                placeholder="Ditt lösenord"
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Laddar...' : (isLogin ? 'Logga in' : 'Registrera')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              {isLogin 
                ? 'Har du inget konto? Registrera dig här' 
                : 'Har du redan ett konto? Logga in här'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
