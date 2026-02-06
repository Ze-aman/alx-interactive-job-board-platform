import React, { useState } from 'react';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
}

type ResetStep = 'FORGOT' | 'CREATE_NEW' | 'SUCCESS';

export const ResetPasswordModal = ({ isOpen, onClose, onBackToLogin }: ResetPasswordModalProps) => {
  const [step, setStep] = useState<ResetStep>('FORGOT');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendLink = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call to send email
    setTimeout(() => {
      setIsLoading(false);
      setStep('CREATE_NEW'); // In a real app, this would happen via an email link
    }, 1500);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('SUCCESS');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0d141b]/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-[500px] bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Progress Bar Header (Inspired by your sample) */}
        <div className="h-1.5 w-full bg-[#137fec]/10 flex">
          <div className={`h-full bg-[#137fec] transition-all duration-500 ${step === 'FORGOT' ? 'w-1/3' : step === 'CREATE_NEW' ? 'w-2/3' : 'w-full'}`} />
        </div>

        <button onClick={onClose} className="absolute top-6 right-6 text-[#4c739a] hover:text-[#137fec] transition-colors z-20">
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>

        <div className="p-8 sm:p-12">
          
          {/* STEP 1: FORGOT PASSWORD */}
          {step === 'FORGOT' && (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <div className="mb-6 flex items-center justify-center w-16 h-16 bg-[#137fec]/10 rounded-full mx-auto">
                <span className="material-symbols-outlined text-[#137fec] text-3xl">lock_reset</span>
              </div>
              <h1 className="text-[#0d141b] text-2xl font-black text-center mb-2">Forgot your password?</h1>
              <p className="text-[#4c739a] text-center mb-8 px-4">Enter your email address below and we will send you a secure link to reset your password.</p>
              
              <form onSubmit={handleSendLink} className="space-y-6">
                <div className="flex flex-col gap-2">
                  <p className="text-[#0d141b] text-sm font-bold ml-1">Email Address</p>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#4c739a]">mail</span>
                    <input 
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-14 pl-12 pr-4 rounded-xl border border-[#cfdbe7] focus:ring-2 focus:ring-[#137fec] outline-none transition-all"
                      placeholder="e.g. name@company.com"
                    />
                  </div>
                </div>
                <button 
                  disabled={isLoading}
                  className="w-full h-14 bg-[#137fec] text-white font-black rounded-xl shadow-lg hover:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                  {!isLoading && <span className="material-symbols-outlined">arrow_forward</span>}
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: CREATE NEW PASSWORD */}
          {step === 'CREATE_NEW' && (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <h1 className="text-[#0d141b] text-2xl font-black mb-2">Create New Password</h1>
              <p className="text-[#4c739a] text-sm mb-8">Please choose a strong password to protect your account.</p>
              
              <form onSubmit={handleUpdatePassword} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[#0d141b] text-sm font-bold ml-1">New Password</label>
                    <input className="w-full h-12 px-4 rounded-xl border border-[#cfdbe7] outline-none focus:ring-2 focus:ring-[#137fec]" type="password" placeholder="At least 8 characters" />
                  </div>
                  
                  {/* Strength Meter (Simplified from your sample) */}
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs font-bold text-[#4c739a]">Password Strength</p>
                      <p className="text-xs font-bold text-[#137fec]">Medium</p>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#137fec] w-[60%]" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[#0d141b] text-sm font-bold ml-1">Confirm Password</label>
                    <input className="w-full h-12 px-4 rounded-xl border border-[#cfdbe7] outline-none focus:ring-2 focus:ring-[#137fec]" type="password" placeholder="Repeat password" />
                  </div>
                </div>

                <button className="w-full h-14 bg-[#137fec] text-white font-black rounded-xl shadow-lg hover:bg-[#137fec]/90 transition-all">
                  Update Password
                </button>
              </form>
            </div>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 'SUCCESS' && (
            <div className="text-center animate-in zoom-in duration-300">
              <div className="mb-6 flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mx-auto">
                <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
              </div>
              <h1 className="text-[#0d141b] text-2xl font-black mb-2">Password Updated!</h1>
              <p className="text-[#4c739a] mb-8">Your security is our priority. You can now sign in with your new password.</p>
              <button onClick={onBackToLogin} className="w-full h-14 bg-[#137fec] text-white font-black rounded-xl">
                Go to Sign In
              </button>
            </div>
          )}

          {/* Back Footer */}
          {step !== 'SUCCESS' && (
            <div className="mt-8 text-center">
              <button 
                onClick={onBackToLogin}
                className="inline-flex items-center gap-2 text-[#137fec] font-black text-sm hover:underline"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Back to Sign In
              </button>
            </div>
          )}
        </div>

        {/* Security Badge Footer */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-lg text-slate-400">verified_user</span>
          <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Secure 256-bit encryption</span>
        </div>
      </div>
    </div>
  );
};