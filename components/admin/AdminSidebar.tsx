import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/apiClient';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const { logout } = useAuth();
  return (
    <aside className="w-64 bg-white border-r border-[#dbe0e6] flex flex-col fixed h-full z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-[#137fec] size-10 rounded-lg flex items-center justify-center text-white shadow-lg shadow-[#137fec]/20">
          <span className="material-symbols-outlined">work</span>
        </div>
        <h1 className="text-[#111418] text-lg font-bold tracking-tight">JobBoard Admin</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 mt-4">
        <SidebarNavItem 
          icon="dashboard" 
          label="Overview" 
          active={activeTab === 'overview'} 
          onClick={() => setActiveTab('overview')} 
        />
        <SidebarNavItem 
          icon="group" 
          label="User Management" 
          active={activeTab === 'users'} 
          onClick={() => setActiveTab('users')} 
        />
        <SidebarNavItem 
          icon="corporate_fare" 
          label="Companies" 
          active={activeTab === 'companies'} 
          onClick={() => setActiveTab('companies')} 
        />
        <SidebarNavItem 
          icon="settings" 
          label="Site Settings" 
          active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')} 
        />
      </nav>

      <div className="p-4 border-t border-[#dbe0e6]">
        <button onClick={async () => { try { await apiClient('/api/auth/logout', { method: 'POST' }); } catch {} logout(); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors font-medium">
          <span className="material-symbols-outlined">logout</span>
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

interface NavItemProps {
  icon: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}

const SidebarNavItem = ({ icon, label, active, onClick }: NavItemProps) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
      active 
        ? 'bg-[#137fec]/10 text-[#137fec] font-bold shadow-sm' 
        : 'text-[#617589] hover:bg-[#f0f2f4] hover:text-[#111418]'
    }`}
  >
    <span className="material-symbols-outlined text-[22px]">{icon}</span>
    <span className="text-sm">{label}</span>
  </button>
);

export default AdminSidebar;