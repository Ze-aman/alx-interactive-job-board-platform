import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ProfileModal } from '../modals/ProfileModal'; // Adjust this path to where your modal file is

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Standard navigation links (excluding Profile since it's now a modal)
  const navItems = [
    { icon: 'work', label: 'My Applications', href: '/dashboard' },
    { icon: 'bookmark', label: 'Saved Jobs', href: '/saved' },
    { icon: 'settings', label: 'Settings', href: '/settings' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f7f8]">
      {/* 1. Specialized Dashboard Top Navigation */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#dbe0e6] bg-white px-4 md:px-10 py-3 sticky top-0 z-[60]">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-4 text-[#137fec] hover:opacity-90 transition-opacity">
            <div className="size-6">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-tight">JobBoard</h2>
          </Link>
          
          {/* Search Bar */}
          <label className="hidden md:flex flex-col min-w-40 h-10 max-w-64">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full overflow-hidden border border-[#dbe0e6]">
              <div className="text-[#617589] flex bg-[#f0f2f4] items-center justify-center pl-4">
                <span className="material-symbols-outlined text-xl">search</span>
              </div>
              <input 
                className="flex w-full min-w-0 flex-1 border-none bg-[#f0f2f4] focus:ring-0 text-[#111418] h-full placeholder:text-[#617589] px-4 text-sm font-normal" 
                placeholder="Search applications..." 
              />
            </div>
          </label>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center justify-center rounded-lg size-10 bg-[#f0f2f4] text-[#111418] hover:bg-gray-200 transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div 
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-[#137fec]/20 cursor-pointer hover:opacity-80 transition-opacity" 
            style={{backgroundImage: `url('https://api.dicebear.com/7.x/avataaars/svg?seed=Alex')`}}
            onClick={() => setIsProfileOpen(true)}
          />
        </div>
      </header>

      <div className="flex flex-1">
        {/* 2. Side Navigation */}
        <aside className="w-64 border-r border-[#dbe0e6] bg-white hidden lg:block sticky top-[65px] h-[calc(100vh-65px)]">
          <div className="flex h-full flex-col justify-between p-4">
            <div className="flex flex-col gap-6">
              {/* User Mini Profile */}
              <div className="flex items-center gap-3 px-2 py-4">
                <div 
                  className="bg-slate-200 rounded-full size-12 flex-shrink-0 bg-cover bg-center border border-[#dbe0e6]" 
                  style={{backgroundImage: `url('https://api.dicebear.com/7.x/avataaars/svg?seed=Alex')`}}
                ></div>
                <div className="flex flex-col overflow-hidden">
                  <h1 className="text-[#111418] text-base font-bold truncate">Alex Smith</h1>
                  <p className="text-[#617589] text-xs font-medium truncate">Senior Product Designer</p>
                </div>
              </div>

              {/* Nav Links */}
              <nav className="flex flex-col gap-1">
                {/* My Profile Trigger - Opens Modal */}
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors w-full ${
                    isProfileOpen 
                    ? 'bg-[#137fec]/10 text-[#137fec]' 
                    : 'text-[#617589] hover:bg-slate-50'
                  }`}
                >
                  <span className={`material-symbols-outlined ${isProfileOpen ? 'fill-icon' : ''}`}>
                    person
                  </span>
                  <p className={`text-sm ${isProfileOpen ? 'font-bold' : 'font-semibold'}`}>My Profile</p>
                </button>

                {/* Other Page Links */}
                {navItems.map((item) => {
                  const isActive = router.pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                        isActive 
                        ? 'bg-[#137fec]/10 text-[#137fec]' 
                        : 'text-[#617589] hover:bg-slate-50'
                      }`}
                    >
                      <span className={`material-symbols-outlined ${isActive ? 'fill-icon' : ''}`}>
                        {item.icon}
                      </span>
                      <p className={`text-sm ${isActive ? 'font-bold' : 'font-semibold'}`}>{item.label}</p>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#dbe0e6]">
              <button className="flex items-center gap-3 px-3 py-3 w-full rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                <span className="material-symbols-outlined">logout</span>
                <p className="text-sm font-bold">Sign Out</p>
              </button>
            </div>
          </div>
        </aside>

        {/* 3. Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl w-full mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Profile Modal - Managed globally by the layout */}
      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </div>
  );
};