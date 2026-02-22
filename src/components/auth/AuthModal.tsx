"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'signin' | 'signup';
}

export function AuthModal({ isOpen, onClose, defaultTab = 'signin' }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage('Check your email for the confirmation link!');
      }
    } catch (err) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage('Successfully signed in!');
        onClose();
      }
    } catch (err) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setMessage('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) setMessage(error.message);
    } catch (err) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white border border-gray-200">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-light text-black">
              {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('signin')}
              className={`flex-1 pb-4 text-sm font-medium transition-colors ${activeTab === 'signin'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 pb-4 text-sm font-medium transition-colors ${activeTab === 'signup'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <form onSubmit={activeTab === 'signin' ? handleSignIn : handleSignUp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {message && (
                <div className={`text-sm p-3 rounded-sm ${message.includes('error') || message.includes('Invalid')
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-green-50 text-green-600 border border-green-200'
                  }`}>
                  {message}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white hover:bg-gray-800 py-3 rounded-sm font-normal"
              >
                {loading ? 'Processing...' : activeTab === 'signin' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-4 border border-gray-200 rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-gray-700">Continue with Google</span>
            </Button>
          </div>


          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              {activeTab === 'signin' ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setActiveTab(activeTab === 'signin' ? 'signup' : 'signin')}
                className="text-black hover:underline font-medium"
              >
                {activeTab === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
} 