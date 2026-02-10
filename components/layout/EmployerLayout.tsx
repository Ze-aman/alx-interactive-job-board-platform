import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { EmployerProfileModal } from '../modals/EmployerProfileModal';

interface EmployerLayoutProps {
  children: React.ReactNode;
}

export const EmployerLayout = ({ children }: EmployerLayoutProps) => {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [company, setCompany] = useState<any>(null);

  React.useEffect(() => {
    if (router.query.profile === '1') {
      setIsProfileOpen(true);
    }
  }, [router.query.profile]);

  React.useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/profile/me');
        const data = await res.json();
        if (data?.role === 'employer') setCompany(data.profile);
      } catch {}
    };
    load();
  }, []);

  const navItems = [
    { icon: 'grid_view', label: 'Dashboard', href: '/employer' },
    { icon: 'groups', label: 'Applicants', href: '/employer/applicants' },
    { icon: 'settings', label: 'Company Settings', href: '/employer/settings' },
  ];

  // Helper to get the dynamic header title
  const getHeaderTitle = () => {
    const activeItem = navItems.find(item => item.href === router.pathname);
    return activeItem ? activeItem.label : 'Employer Portal';
  };

  return (
    <div className="light min-h-screen bg-[#f6f7f8] text-[#111418] flex font-sans">
      
      {/* Sidebar - Fixed Position */}
      <aside className="w-64 bg-white border-r border-[#dbe0e6] flex flex-col fixed h-full z-20">
        <div className="p-6 flex items-center gap-3">
          {company?.logo_url ? (
            <img src={company.logo_url} alt="Logo" className="size-10 rounded-lg object-cover border border-[#dbe0e6]" />
          ) : (
            <div className="bg-[#137fec] size-10 rounded-lg flex items-center justify-center text-white shadow-lg shadow-[#137fec]/20">
              <span className="material-symbols-outlined">corporate_fare</span>
            </div>
          )}
          <div className="flex flex-col">
            <h1 className="text-[#111418] text-base font-bold leading-tight">{company?.name || 'CorpTech Inc.'}</h1>
            <p className="text-[10px] text-[#617589] font-bold uppercase tracking-widest">Employer Hub</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <Link key={item.label} href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#137fec]/10 text-[#137fec] shadow-sm' 
                    : 'text-[#617589] hover:bg-slate-50 hover:text-[#111418]'
                }`}
              >
                <span className={`material-symbols-outlined ${isActive ? 'fill-1' : ''}`}>
                  {item.icon}
                </span>
                <span className="font-bold text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Support Card */}
        <div className="mx-4 mb-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
           <p className="text-[11px] font-bold text-[#617589] uppercase mb-2">Need help?</p>
           <button className="text-[11px] font-bold text-[#137fec] flex items-center gap-1 hover:underline">
             Contact Account Manager <span className="material-symbols-outlined text-xs">arrow_forward</span>
           </button>
        </div>

        <div className="p-4 border-t border-[#dbe0e6]">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-500 hover:bg-red-50 transition-colors group">
            <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">logout</span>
            <span className="font-bold text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-[#dbe0e6] flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Portal</span>
            <span className="text-slate-300">/</span>
            <h2 className="text-[#111418] text-sm font-bold">{getHeaderTitle()}</h2>
          </div>

          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <button className="relative p-2 text-slate-400 hover:text-[#137fec] transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* Profile Section */}
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setIsProfileOpen(true)}
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-[#111418] group-hover:text-[#137fec] transition-colors">Sarah Jenkins</p>
                <p className="text-[10px] text-[#617589] font-medium">HR Director</p>
              </div>
              <div 
                className="size-10 rounded-full bg-cover bg-center border-2 border-transparent group-hover:border-[#137fec]/20 transition-all shadow-sm" 
                style={{backgroundImage: company?.logo_url ? `url('${company.logo_url}')` : `url('https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah')`}}
              ></div>
            </div>
          </div>
        </header>

        {/* Page Content Wrapper */}
        <div className="p-8 max-w-[1400px] mx-auto w-full bg-[#f6f7f8]">
          {children}
        </div>

        {/* Footer Placeholder */}
        <footer className="mt-auto p-8 border-t border-[#dbe0e6] flex justify-between items-center">
          <p className="text-[11px] font-bold text-[#617589] uppercase tracking-wider">
            © 2026 JobBoard Employer Portal
          </p>
          <div className="flex gap-4">
            <button className="text-[11px] font-bold text-[#617589] hover:text-[#111418]">Privacy</button>
            <button className="text-[11px] font-bold text-[#617589] hover:text-[#111418]">Terms</button>
          </div>
        </footer>
      </main>

      {/* Profile Modal */}
      <EmployerProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </div>
  );
};