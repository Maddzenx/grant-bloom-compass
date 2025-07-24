
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Added Link import
import { TopNavigation } from './TopNavigation'; // Added TopNavigation import

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isSignup = location.pathname === '/signup';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  // Add confirmPassword state for signup
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let error;
      if (isSignup) {
        if (password !== confirmPassword) {
          toast({
            title: 'Passwords do not match',
            description: 'Please make sure your passwords match.',
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        error = signUpError;
        if (!error) {
          toast({
            title: 'Account created!',
            description: 'Please log in.',
          });
          navigate('/login');
          return;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        error = signInError;
      }
      if (error) {
        toast({
          title: isSignup ? 'Registration failed' : 'Login failed',
          description: error.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'An error occurred',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        toast({
          title: 'Google login failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Google login successful',
          description: 'You are now logged in.',
        });
      }
    } catch (error) {
      toast({
        title: 'An error occurred',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-canvas-cloud">
      {/* <TopNavigation /> */}
      <div className="flex items-center justify-center px-4 pt-20">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-lg shadow-sm p-4">
            {isSignup ? (
              <>
                {/* Signup view (keep as is or style as needed) */}
                <div className="text-center mb-4">
                  <h1 className="text-2xl font-bold font-sans">Skapa konto</h1>
                </div>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-2 border-2 border-blue-500 rounded-lg py-2 mb-3 bg-white font-medium text-base hover:bg-blue-50 transition font-sans"
                >
                  <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><g><path fill="#4285F4" d="M43.611 20.083H42V20H24v8h11.303C33.962 32.833 29.418 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c2.803 0 5.377.99 7.409 2.626l6.162-6.162C33.527 6.053 28.979 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20c10.477 0 19.477-8.053 19.477-20 0-1.341-.138-2.651-.389-3.917z"/><path fill="#34A853" d="M6.306 14.691l6.571 4.819C14.655 16.108 19.001 13 24 13c2.803 0 5.377.99 7.409 2.626l6.162-6.162C33.527 6.053 28.979 4 24 4c-7.732 0-14.41 4.41-17.694 10.691z"/><path fill="#FBBC05" d="M24 44c5.356 0 10.236-1.824 14.045-4.949l-6.484-5.307C29.418 36 24 36 24 36c-5.418 0-9.962-3.167-11.303-7.917l-6.571 5.081C9.59 39.59 16.268 44 24 44z"/><path fill="#EA4335" d="M43.611 20.083H42V20H24v8h11.303c-1.13 3.417-4.303 6.083-11.303 6.083-5.418 0-9.962-3.167-11.303-7.917l-6.571 5.081C9.59 39.59 16.268 44 24 44c6.268 0 11.522-2.053 15.045-5.256l-6.484-5.307C29.418 36 24 36 24 36c-5.418 0-9.962-3.167-11.303-7.917l-6.571 5.081C9.59 39.59 16.268 44 24 44c10.477 0 19.477-8.053 19.477-20 0-1.341-.138-2.651-.389-3.917z"/></g></svg>
                  Fortsätt med Google
                </button>
                <div className="flex items-center my-4">
                  <div className="flex-grow border-t border-gray-200" />
                  <span className="mx-2 text-gray-400 font-semibold font-sans text-sm">ELLER</span>
                  <div className="flex-grow border-t border-gray-200" />
                </div>
                <form onSubmit={handleAuth} className="space-y-3">
                  <div>
                    <label htmlFor="email" className="block font-bold mb-1 font-sans text-sm">E-post</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="mt-1 w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-[#fcfbf7] focus:outline-none focus:ring-2 focus:ring-black font-sans"
                      placeholder="E-post"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block font-bold mb-1 font-sans text-sm">Lösenord</label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="mt-1 w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-[#fcfbf7] focus:outline-none focus:ring-2 focus:ring-black font-sans"
                      placeholder="Lösenord"
                      minLength={6}
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block font-bold mb-1 font-sans text-sm">Bekräfta lösenord</label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                      className="mt-1 w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-[#fcfbf7] focus:outline-none focus:ring-2 focus:ring-black font-sans"
                      placeholder="Bekräfta lösenord"
                      minLength={6}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-900 text-white text-base font-semibold rounded-lg py-2 mt-1 transition font-sans"
                    disabled={loading}
                  >
                    {loading ? 'Laddar...' : 'Skapa konto'}
                  </button>
                </form>
                <div className="mt-5 text-center text-gray-700 text-sm font-sans">
                  Har du redan ett konto?{' '}
                  <Link to="/login" className="font-semibold underline hover:text-indigo-600 font-sans">Logga in</Link>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold mb-4 font-sans">Logga in</h1>
                {/* Google social login button only */}
                <button type="button" className="w-full flex items-center justify-center gap-2 border-2 border-blue-500 rounded-lg py-2 mb-3 bg-white font-medium text-base hover:bg-blue-50 transition font-sans">
                  {/* New Google SVG icon */}
                  <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><g><path fill="#4285F4" d="M43.611 20.083H42V20H24v8h11.303C33.962 32.833 29.418 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c2.803 0 5.377.99 7.409 2.626l6.162-6.162C33.527 6.053 28.979 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20c10.477 0 19.477-8.053 19.477-20 0-1.341-.138-2.651-.389-3.917z"/><path fill="#34A853" d="M6.306 14.691l6.571 4.819C14.655 16.108 19.001 13 24 13c2.803 0 5.377.99 7.409 2.626l6.162-6.162C33.527 6.053 28.979 4 24 4c-7.732 0-14.41 4.41-17.694 10.691z"/><path fill="#FBBC05" d="M24 44c5.356 0 10.236-1.824 14.045-4.949l-6.484-5.307C29.418 36 24 36 24 36c-5.418 0-9.962-3.167-11.303-7.917l-6.571 5.081C9.59 39.59 16.268 44 24 44z"/><path fill="#EA4335" d="M43.611 20.083H42V20H24v8h11.303c-1.13 3.417-4.303 6.083-11.303 6.083-5.418 0-9.962-3.167-11.303-7.917l-6.571 5.081C9.59 39.59 16.268 44 24 44c6.268 0 11.522-2.053 15.045-5.256l-6.484-5.307C29.418 36 24 36 24 36c-5.418 0-9.962-3.167-11.303-7.917l-6.571 5.081C9.59 39.59 16.268 44 24 44c10.477 0 19.477-8.053 19.477-20 0-1.341-.138-2.651-.389-3.917z"/></g></svg>
                  Fortsätt med Google
                </button>
                <div className="flex items-center my-4">
                  <div className="flex-grow border-t border-gray-200" />
                  <span className="mx-2 text-gray-400 font-semibold font-sans text-sm">ELLER</span>
                  <div className="flex-grow border-t border-gray-200" />
                </div>
                <form onSubmit={handleAuth} className="space-y-3">
                  <div>
                    <label htmlFor="email" className="block font-bold mb-1 font-sans text-sm">E-post</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="mt-1 w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-[#fcfbf7] focus:outline-none focus:ring-2 focus:ring-black font-sans"
                      placeholder="E-post"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="password" className="font-bold font-sans text-sm">Lösenord</label>
                      <a href="#" className="text-xs text-gray-500 hover:underline font-sans">Glömt lösenord?</a>
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="mt-1 w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-[#fcfbf7] focus:outline-none focus:ring-2 focus:ring-black font-sans"
                      placeholder="Lösenord"
                      minLength={6}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-900 text-white text-base font-semibold rounded-lg py-2 mt-1 transition font-sans"
                    disabled={loading}
                  >
                    {loading ? 'Laddar...' : 'Logga in'}
                  </button>
                </form>
                <div className="mt-5 text-center text-gray-700 text-sm font-sans">
                  Har du inget konto?{' '}
                  <Link to="/signup" className="font-semibold underline hover:text-indigo-600 font-sans">Skapa konto</Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
