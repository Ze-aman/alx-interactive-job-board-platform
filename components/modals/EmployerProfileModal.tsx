import React from 'react';

export const EmployerProfileModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      {/* Modal Container - Forced light theme background */}
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-50 bg-black/10 hover:bg-black/20 text-white rounded-full p-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="overflow-y-auto flex-1 pb-8">
          {/* Company Banner */}
          <div className="relative h-48 w-full bg-gradient-to-r from-slate-800 to-slate-600">
            <div className="absolute -bottom-16 left-8">
              <div className="bg-[#137fec] rounded-2xl size-32 border-4 border-white shadow-lg flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-6xl">corporate_fare</span>
              </div>
            </div>
          </div>

          {/* Header Content */}
          <div className="mt-20 px-8 flex flex-wrap justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-black text-[#111418] tracking-tight">CorpTech Inc.</h1>
              <p className="text-lg text-[#137fec] font-bold">Technology & Software Services</p>
              <div className="flex gap-4 mt-2">
                <span className="flex items-center gap-1 text-sm font-medium text-[#617589]">
                  <span className="material-symbols-outlined text-sm">location_on</span> Austin, TX
                </span>
                <span className="flex items-center gap-1 text-sm font-medium text-[#617589]">
                  <span className="material-symbols-outlined text-sm">group</span> 500-1000 Employees
                </span>
              </div>
            </div>
            <button className="bg-[#137fec] text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-[#137fec]/20 hover:bg-[#137fec]/90 active:scale-95 transition-all">
              Edit Business Info
            </button>
          </div>

          {/* Body Content */}
          <div className="px-8 mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h3 className="text-sm font-black text-[#111418] uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">
                  About the Company
                </h3>
                <p className="text-[#617589] leading-relaxed font-medium">
                  CorpTech Inc. is a leading provider of innovative enterprise solutions. We specialize in scaling engineering teams and delivering high-performance SaaS platforms to global clients. Our mission is to bridge the gap between complex technology and business efficiency.
                </p>
              </section>

              <section>
                <h3 className="text-sm font-black text-[#111418] uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">
                  Hiring Team
                </h3>
                <div className="flex -space-x-3 overflow-hidden">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className="inline-block size-10 rounded-full border-2 border-white bg-slate-200 bg-cover shadow-sm" 
                      style={{backgroundImage: `url('https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}')`}} 
                    />
                  ))}
                  <div className="flex items-center justify-center size-10 rounded-full border-2 border-white bg-slate-100 text-xs font-bold text-[#617589] shadow-sm">
                    +2
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="text-[11px] font-black text-[#617589] uppercase tracking-widest mb-4">Quick Insights</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#617589]">Active Jobs</span>
                    <span className="text-sm font-bold text-[#111418] bg-white px-2 py-0.5 rounded border border-slate-100 shadow-sm">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#617589]">Total Hires</span>
                    <span className="text-sm font-bold text-[#111418] bg-white px-2 py-0.5 rounded border border-slate-100 shadow-sm">148</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#617589]">Avg. Time to Hire</span>
                    <span className="text-sm font-bold text-[#111418] bg-white px-2 py-0.5 rounded border border-slate-100 shadow-sm">18 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};