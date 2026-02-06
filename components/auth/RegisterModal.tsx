import React, { useState } from 'react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) => {
  const [role, setRole] = useState<'candidate' | 'employer'>('candidate');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  // Simple validation feedback logic
  const isEmailValid = email.includes('@') && email.includes('.');
  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0d141b]/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-[540px] bg-white rounded-3xl shadow-2xl overflow-y-auto max-h-[95vh] animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-[#4c739a] hover:text-[#137fec] z-10">
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>

        <div className="p-8 sm:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-[#0d141b] tracking-tight text-3xl font-black mb-2">Join JobBoard</h1>
            <p className="text-[#4c739a] text-base font-medium">Start your journey today</p>
          </div>

          {/* Role Toggle */}
          <div className="flex mb-8 bg-[#f1f5f9] p-1.5 rounded-2xl">
            <button
              onClick={() => setRole('candidate')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                role === 'candidate' ? 'bg-white text-[#137fec] shadow-sm' : 'text-[#64748b]'
              }`}
            >
              I am a Candidate
            </button>
            <button
              onClick={() => setRole('employer')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                role === 'employer' ? 'bg-white text-[#137fec] shadow-sm' : 'text-[#64748b]'
              }`}
            >
              I am an Employer
            </button>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Full Name / Company Name */}
            <div className="flex flex-col gap-2">
              <label className="text-[#0d141b] text-sm font-bold ml-1">
                {role === 'candidate' ? 'Full Name' : 'Company Name'}
              </label>
              <div className="relative">
                <input 
                  className="w-full h-14 px-4 rounded-xl border border-[#cfdbe7] focus:ring-2 focus:ring-[#137fec] outline-none transition-all" 
                  placeholder={role === 'candidate' ? "Enter your name" : "Enter company name"}
                  type="text" 
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8]">
                  {role === 'candidate' ? 'person' : 'domain'}
                </span>
              </div>
            </div>

            {/* Email Field with validation hint */}
            <div className="flex flex-col gap-2">
              <label className="text-[#0d141b] text-sm font-bold ml-1">Email Address</label>
              <div className="relative">
                <input 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full h-14 px-4 rounded-xl border transition-all outline-none ${
                    isEmailValid ? 'border-green-500 ring-1 ring-green-500' : 'border-[#cfdbe7] focus:ring-2 focus:ring-[#137fec]'
                  }`} 
                  placeholder="you@example.com" 
                  type="email" 
                />
                {isEmailValid && (
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-green-500">check_circle</span>
                )}
              </div>
              {isEmailValid && <p className="text-[11px] text-green-600 font-bold ml-1">Email looks great!</p>}
            </div>

            {/* Password with Strength Meter */}
            <div className="flex flex-col gap-2">
              <label className="text-[#0d141b] text-sm font-bold ml-1">Password</label>
              <div className="relative">
                <input 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 px-4 rounded-xl border border-[#cfdbe7] focus:ring-2 focus:ring-[#137fec] outline-none transition-all" 
                  placeholder="Create a strong password" 
                  type={showPassword ? "text" : "password"} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#137fec]"
                >
                  {showPassword ? 'visibility_off' : 'visibility'}
                </button>
              </div>
              {/* Strength Bars */}
              <div className="flex gap-1.5 mt-1 px-1">
                {[1, 2, 3, 4].map((step) => (
                  <div 
                    key={step} 
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      step <= passwordStrength ? 'bg-[#137fec]' : 'bg-[#e2e8f0]'
                    }`} 
                  />
                ))}
              </div>
              <p className="text-[10px] text-[#64748b] font-bold ml-1">
                Strength: {passwordStrength === 0 ? 'Too weak' : passwordStrength === 1 ? 'Weak' : passwordStrength === 2 ? 'Medium' : 'Strong'}
              </p>
            </div>

            {/* Conditional Field: Industry (Only for Employer) */}
            {role === 'employer' && (
              <div className="flex flex-col gap-2 animate-in slide-in-from-top-2 duration-300">
                <label className="text-[#0d141b] text-sm font-bold ml-1">Industry</label>
                <select className="w-full h-14 px-4 rounded-xl border border-[#cfdbe7] bg-white text-[#0d141b] focus:ring-2 focus:ring-[#137fec] outline-none appearance-none cursor-pointer">
                  <option value="">Select industry</option>
                  <option value="tech">Technology</option>
                  <option value="finance">Finance</option>
                </select>
              </div>
            )}

            {/* Terms */}
            <div className="flex items-start gap-3 py-2">
              <input type="checkbox" className="mt-1 h-5 w-5 rounded border-[#cfdbe7] text-[#137fec] focus:ring-[#137fec]" id="terms" />
              <label htmlFor="terms" className="text-xs text-[#64748b] leading-relaxed">
                I agree to the <button className="text-[#137fec] font-bold">Terms of Service</button> and <button className="text-[#137fec] font-bold">Privacy Policy</button>.
              </label>
            </div>

            <button className="w-full h-14 bg-[#137fec] text-white font-black rounded-xl shadow-lg hover:bg-[#137fec]/90 transition-all active:scale-[0.98]">
              Create Account
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#f1f5f9] text-center">
            <p className="text-sm text-[#64748b] font-medium">
              Already have an account? 
              <button onClick={onSwitchToLogin} className="text-[#137fec] font-black hover:underline ml-1">
                Sign In instead
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};