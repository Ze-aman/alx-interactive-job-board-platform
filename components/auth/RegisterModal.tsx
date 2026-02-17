import React, { useState } from 'react';
import { apiClient } from '@/lib/apiClient';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) => {
  const [role, setRole] = useState<'candidate' | 'employer'>('candidate');
  const [name, setName] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [industry, setIndustry] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const isEmailValid = email.includes('@') && email.includes('.');
  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await apiClient('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          role,
          name,
          industry: role === 'employer' ? industry : undefined,
        }),
      });

      alert("Success! You can now sign in.");
      onSwitchToLogin();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0d141b]/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-[540px] bg-white rounded-3xl shadow-2xl overflow-y-auto max-h-[95vh] animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-[#4c739a] hover:text-[#137fec] z-10">
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>

        <div className="p-8 sm:p-12">
          <div className="text-center mb-8">
            <h1 className="text-[#0d141b] tracking-tight text-3xl font-black mb-2">Join JobBoard</h1>
            <p className="text-[#4c739a] text-base font-medium">Start your journey today</p>
          </div>

          <div className="flex mb-8 bg-[#f1f5f9] p-1.5 rounded-2xl">
            <button onClick={() => setRole('candidate')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${role === 'candidate' ? 'bg-white text-[#137fec] shadow-sm' : 'text-[#64748b]'}`}>Candidate</button>
            <button onClick={() => setRole('employer')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${role === 'employer' ? 'bg-white text-[#137fec] shadow-sm' : 'text-[#64748b]'}`}>Employer</button>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-bold border border-red-100">{error}</div>}

          <form className="space-y-5" onSubmit={handleRegister}>
            <div className="flex flex-col gap-2">
              <label className="text-[#0d141b] text-sm font-bold ml-1">{role === 'candidate' ? 'Full Name' : 'Company Name'}</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full h-14 px-4 rounded-xl border border-[#cfdbe7] outline-none" placeholder={role === 'candidate' ? "John Doe" : "Acme Corp"} />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[#0d141b] text-sm font-bold ml-1">Email Address</label>
              <input required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-14 px-4 rounded-xl border border-[#cfdbe7] outline-none" type="email" placeholder="you@example.com" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[#0d141b] text-sm font-bold ml-1">Password</label>
              <div className="relative">
                <input required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-14 px-4 rounded-xl border border-[#cfdbe7] outline-none" type={showPassword ? "text" : "password"} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#94a3b8]">{showPassword ? 'visibility_off' : 'visibility'}</button>
              </div>
            </div>

            {role === 'employer' && (
              <div className="flex flex-col gap-2">
                <label className="text-[#0d141b] text-sm font-bold ml-1">Industry</label>
                <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full h-14 px-4 rounded-xl border border-[#cfdbe7] bg-white">
                  <option value="">Select industry</option>
                  <option value="tech">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                </select>
              </div>
            )}

            <button disabled={isLoading} className="w-full h-14 bg-[#137fec] text-white font-black rounded-xl shadow-lg hover:bg-[#137fec]/90 disabled:opacity-50">
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#f1f5f9] text-center">
            <p className="text-sm text-[#64748b]">Already have an account? <button onClick={onSwitchToLogin} className="text-[#137fec] font-black hover:underline ml-1">Sign In</button></p>
          </div>
        </div>
      </div>
    </div>
  );
};
