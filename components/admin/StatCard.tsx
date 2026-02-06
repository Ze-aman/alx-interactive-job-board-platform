import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  trend: string;
  icon: string;
  isPriority?: boolean;
}

const StatCard = ({ label, value, trend, icon, isPriority }: StatCardProps) => {
  return (
    <div className={`p-6 rounded-xl border shadow-sm ${
      isPriority ? 'bg-[#137fec]/5 border-[#137fec]/30' : 'bg-white border-[#dbe0e6]'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${isPriority ? 'bg-[#137fec]/20 text-[#137fec]' : 'bg-blue-50 text-[#137fec]'}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <span className={`text-sm font-bold flex items-center ${isPriority ? 'text-[#137fec]' : 'text-[#078838]'}`}>
          {!isPriority && <span className="material-symbols-outlined text-sm">arrow_upward</span>} {trend}
        </span>
      </div>
      <p className="text-[#617589] text-sm font-medium">{label}</p>
      <p className="text-3xl font-bold mt-1 text-[#111418]">{value}</p>
      <p className="text-xs text-[#617589] mt-2">{isPriority ? 'Awaiting your review' : 'v.s. last month'}</p>
    </div>
  );
};

export default StatCard;