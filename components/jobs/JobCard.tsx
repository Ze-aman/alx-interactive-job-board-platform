import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/auth/AuthModal';

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  postedAt: string;
  isRemote?: boolean;
  logoColor?: string;
}

export const JobCard = ({
  id,
  title,
  company,
  location,
  salary,
  type,
  postedAt,
  isRemote,
  logoColor = "bg-[#137fec]/10",
}: JobCardProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleApply = () => {
    if (user) {
      router.push(`/jobs/${id}`);
    } else {
      setIsAuthOpen(true);
    }
  };

  const goDetails = () => router.push(`/jobs/${id}`);

  return (
    <div className="bg-white border border-[#f0f2f4] p-6 rounded-2xl hover:shadow-md transition-all group flex flex-col h-full">
      {/* Top Section: Logo & Title */}
      <div className="flex justify-between items-start mb-5">
        <div className="flex gap-4">
          {/* Logo Placeholder */}
          <div className="size-14 rounded-xl flex items-center justify-center p-2.5 bg-[#f8fafc]">
            <div className={`w-full h-full rounded-lg ${logoColor}`} />
          </div>
          <div>
            <h3 onClick={goDetails} className="cursor-pointer text-lg font-extrabold text-[#111418] group-hover:text-[#137fec] transition-colors line-clamp-1">
              {title}
            </h3>
            <p className="text-[#617589] text-sm font-semibold">
              {company} • {location}
            </p>
          </div>
        </div>
        <button className="text-[#cbd5e1] hover:text-[#137fec] transition-colors">
          <span className="material-symbols-outlined font-light">bookmark</span>
        </button>
      </div>

      {/* Middle Section: Badges */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="bg-[#f1f5f9] text-[#475569] px-3 py-1.5 rounded-lg text-xs font-bold">
          {salary}
        </span>
        <span className="bg-[#f1f5f9] text-[#475569] px-3 py-1.5 rounded-lg text-xs font-bold">
          {type}
        </span>
        {isRemote && (
          <span className="bg-[#eff6ff] text-[#137fec] px-3 py-1.5 rounded-lg text-xs font-bold">
            Remote Friendly
          </span>
        )}
      </div>

      {/* Bottom Section: Meta & CTA */}
      <div className="flex items-center justify-between mt-auto">
        <span className="text-xs font-medium text-[#94a3b8]">{postedAt}</span>
        {user?.role === 'candidate' && (
          <button
            onClick={handleApply}
            disabled={false}
            className="bg-[#137fec] text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Apply Now
          </button>
        )}
      </div>
    {isAuthOpen && (
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSwitchToRegister={() => {}}
        onForgotPassword={() => {}}
        onSuccess={() => router.push(`/jobs/${id}`)}
      />
    )}
    </div>
  );
};