import React, { useState } from 'react';
import Link from 'next/link';
import { AuthModal } from '../auth/AuthModal';
import { RegisterModal } from '../auth/RegisterModal';
import { ResetPasswordModal } from '../auth/ResetPasswordModal';
import { useAuth } from '@/hooks/useAuth';

export const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  // Helper functions to switch between modals
  const openLogin = () => {
    setIsRegisterOpen(false);
    setIsResetOpen(false);
    setIsLoginOpen(true);
  };

  const openRegister = () => {
    setIsLoginOpen(false);
    setIsResetOpen(false);
    setIsRegisterOpen(true);
  };

  const openReset = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
    setIsResetOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#f0f2f4] bg-white px-4 md:px-10 lg:px-20 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 hover:opacity-90 transition-opacity">
          <div className="text-[#137fec] w-8 h-8">
            <svg fill="currentColor" viewBox="0 0 48 48">
              <path d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" />
            </svg>
          </div>
          <h2 className="text-[#111418] text-xl font-black tracking-tight font-display">JobPortal</h2>
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen((v) => !v)}
                className="size-10 rounded-full bg-cover bg-center border-2 border-transparent hover:border-[#137fec]/20 transition-all shadow-sm"
                style={{backgroundImage: `url('https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email || String(user.id))}')`}}
              />
              {isMenuOpen && (
                <div className="absolute right-0 top-12 bg-white border border-[#dbe0e6] rounded-xl shadow-lg w-44">
                  <Link
                    href={user.role === 'employer' ? '/employer/profile' : '/profile/preview'}
                    className="block px-4 py-2 text-sm font-bold text-[#111418] hover:bg-slate-50"
                    onClick={() => setIsMenuOpen(false)}
                  >Profile</Link>
                  <Link
                    href={user.role === 'employer' ? '/employer' : '/dashboard'}
                    className="block px-4 py-2 text-sm font-bold text-[#111418] hover:bg-slate-50"
                    onClick={() => setIsMenuOpen(false)}
                  >Dashboard</Link>
                  <button
                    onClick={() => { setIsMenuOpen(false); logout(); }}
                    className="block w-full text-left px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
                  >Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button 
                onClick={openLogin}
                className="hidden sm:block text-[#111418] text-sm font-bold px-4 py-2 hover:text-[#137fec] transition-colors"
              >
                Sign In
              </button>
              
              <button 
                onClick={openRegister}
                className="flex min-w-[100px] items-center justify-center rounded-xl h-10 px-6 bg-[#137fec] text-white text-sm font-black shadow-md hover:bg-[#137fec]/90 transition-all active:scale-95"
              >
                Register
              </button>
            </>
          )}
        </div>
      </header>

      {/* Auth Modals */}
      <AuthModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={openRegister}
        onForgotPassword={openReset}
      />

      <RegisterModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
        onSwitchToLogin={openLogin}
      />

      <ResetPasswordModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onBackToLogin={openLogin}
      />
    </>
  );
};