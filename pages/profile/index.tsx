import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProfileModal } from '@/components/modals/ProfileModal';

export default function MyProfile() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h2 className="text-[#111418] text-3xl font-black tracking-tight">My Profile</h2>
          <p className="text-[#617589]">View and manage how companies see your professional profile.</p>
        </div>

        {/* Profile Preview Card */}
        <div className="bg-white rounded-2xl border border-[#dbe0e6] shadow-sm overflow-hidden">
          <div className="p-8 flex items-center gap-6">
            <div 
              className="size-24 rounded-full bg-cover bg-center border-4 border-[#137fec]/10" 
              style={{backgroundImage: `url('https://api.dicebear.com/7.x/avataaars/svg?seed=Alex')`}}
            />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-[#111418]">Alex Smith</h3>
              <p className="text-[#137fec] font-medium">Senior Product Designer</p>
              <div className="flex gap-4 mt-3">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#137fec] text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-[#137fec]/90 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  Preview Public Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The extracted Modal */}
      <ProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </DashboardLayout>
  );
}