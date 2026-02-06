import React, { useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import OverviewContent from '../../components/admin/OverviewContent';
import UserManagement from '../../components/admin/UserManagement';
import CompaniesContent from '../../components/admin/CompaniesContent';
import SettingsContent from '../../components/admin/SettingsContent';

const AdminPage = () => {
  // Tabs: 'overview' | 'users' | 'companies'
  const [activeTab, setActiveTab] = useState('overview');

  // Helper to render title based on tab
  const getTabTitle = () => {
    switch (activeTab) {
      case 'users': return 'User Management';
      case 'companies': return 'Companies';
      case 'settings': return 'Site Settings';
      default: return 'Overview';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f6f7f8]">
      {/* Sidebar - Handles navigation state */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-[#dbe0e6] flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-2">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Admin</span>
             <span className="text-slate-300">/</span>
             <span className="text-sm font-bold text-[#111418]">
               {getTabTitle()}
             </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-[#137fec] transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="size-10 rounded-full bg-slate-200 border border-[#137fec]/20 bg-cover bg-center" 
                 style={{ backgroundImage: `url('https://ui-avatars.com/api/?name=Alex+Rivera&background=137fec&color=fff')` }}>
            </div>
          </div>
        </header>

        {/* Dynamic Content Rendering */}
        <div className="p-8 flex-1">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && <OverviewContent />}
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'companies' && <CompaniesContent />}
            {activeTab === 'settings' && <SettingsContent />}
          </div>
        </div>

        {/* Footer */}
        <footer className="p-8 border-t border-[#dbe0e6] text-center md:text-left">
           <p className="text-xs text-slate-400">© 2026 JobBoard Admin Portal. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};

export default AdminPage;