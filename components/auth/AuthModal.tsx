import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
  onSuccess?: (user: any) => void;
}

export const AuthModal = ({ isOpen, onClose, onSwitchToRegister, onForgotPassword, onSuccess }: AuthModalProps) => {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      login(data.user);
      if (onSuccess) {
        onSuccess(data.user);
      } else if (data.user.role === 'employer') {
        router.push('/employer');
      } else {
        router.push('/dashboard');
      }
      onClose();
    } catch (err: any) {
      setErrors({ general: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0d141b]/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-[500px] bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-[#4c739a] hover:text-[#137fec] transition-colors">
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>

        <div className="p-8 sm:p-12">
          <div className="mb-8">
            <h2 className="text-[#0d141b] text-4xl font-black mb-2 tracking-tight">Welcome Back</h2>
            <p className="text-[#4c739a] text-base font-medium">Please sign in to your account.</p>
          </div>

          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
              <span className="material-symbols-outlined text-xl">error</span>
              <p className="text-sm font-bold">{errors.general}</p>
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <p className="text-[#0d141b] text-sm font-bold ml-1">Email Address</p>
              <input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-xl border h-14 px-4 text-[#0d141b] outline-none transition-all ${
                  errors.email ? 'border-red-500 bg-red-50/30' : 'border-[#cfdbe7] bg-white focus:ring-2 focus:ring-[#137fec]'
                }`}
                placeholder="Enter your email" 
                type="email" 
              />
              {errors.email && <span className="text-red-500 text-xs font-bold ml-1">{errors.email}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center ml-1">
                <p className="text-[#0d141b] text-sm font-bold">Password</p>
                <button type="button" onClick={onForgotPassword} className="text-[#137fec] text-xs font-black hover:underline">
                  Forgot Password?
                </button>
              </div>
              <input 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-xl border h-14 px-4 text-[#0d141b] outline-none transition-all ${
                  errors.password ? 'border-red-500 bg-red-50/30' : 'border-[#cfdbe7] bg-white focus:ring-2 focus:ring-[#137fec]'
                }`}
                placeholder="Enter your password" 
                type="password" 
              />
              {errors.password && <span className="text-red-500 text-xs font-bold ml-1">{errors.password}</span>}
            </div>

            <button 
              disabled={isLoading}
              className="w-full bg-[#137fec] text-white h-14 rounded-xl font-black text-lg shadow-lg hover:bg-[#137fec]/90 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center mt-8 text-[#4c739a] font-medium">
            Don't have an account?{" "}
            <button onClick={onSwitchToRegister} className="text-[#137fec] font-black hover:underline">
              Sign Up free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};