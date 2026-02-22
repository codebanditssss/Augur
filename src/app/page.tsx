"use client";

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { LandingPage } from '@/components/landing/LandingPage'
import { AuthModal } from '@/components/auth/AuthModal'
import ResizableNavbar from '@/components/ui/resizable-navbar'
import { ClientRedirectManager } from '@/lib/redirect-manager'

export default function Home() {
  const router = useRouter();
  const { user, loading, needsOnboarding } = useAuth();
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; tab: 'signin' | 'signup' }>({
    isOpen: false,
    tab: 'signin'
  });

  const openAuthModal = (tab: 'signin' | 'signup') => {
    setAuthModal({ isOpen: true, tab });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, tab: 'signin' });
  };

  // Handle redirects with loop protection
  useEffect(() => {
    // Reset redirect manager on component mount
    ClientRedirectManager.reset();

    if (loading) return; // Wait for auth state to load

    if (user && needsOnboarding) {
      ClientRedirectManager.redirect(
        router,
        '/onboarding',
        'User authenticated but needs onboarding'
      );
    } else if (user && !needsOnboarding) {
      ClientRedirectManager.redirect(
        router,
        '/dashboard',
        'User authenticated and onboarding complete'
      );
    }
    // If no user, stay on landing page (no redirect needed)
  }, [user, needsOnboarding, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-gray-100 border-t-black animate-spin"></div>
          <div className="absolute w-2 h-2 bg-black rounded-full animate-pulse"></div>
        </div>
        <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.3em] text-gray-400 animate-pulse">
          Authenticating
        </p>
      </main>
    );
  }

  // Show Landing Page for guests
  return (
    <main className="min-h-screen bg-white relative">
      {/* Navbar */}
      <ResizableNavbar onOpenAuth={openAuthModal} />

      {/* Landing Page Content */}
      <LandingPage onOpenAuth={openAuthModal} />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        defaultTab={authModal.tab}
      />
    </main>
  )
} 