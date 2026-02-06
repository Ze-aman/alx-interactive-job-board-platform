import React from 'react';
import { EmployerLayout } from '@/components/layout/EmployerLayout';

const EmployerSettings = () => {
  return (
    <EmployerLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-[#111418] tracking-tight">Company Settings</h2>
          <p className="text-[#617589] font-medium mt-1">Update your corporate identity and recruiting preferences.</p>
        </div>

        <div className="space-y-6">
          {/* Section: Public Profile */}
          <section className="bg-white rounded-2xl border border-[#dbe0e6] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#111418]">Public Profile</h3>
              <span className="text-[10px] font-bold py-1 px-2 bg-green-50 text-green-600 rounded uppercase">Verified Account</span>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Logo Upload */}
              <div className="flex items-center gap-6">
                <div className="size-20 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 group hover:border-[#137fec] hover:text-[#137fec] transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                </div>
                <div>
                  <button className="px-4 py-2 bg-[#137fec] text-white text-xs font-bold rounded-lg hover:bg-[#137fec]/90 transition-all">
                    Change Logo
                  </button>
                  <p className="text-[11px] text-[#617589] mt-2 font-medium">Recommended: Square SVG or PNG. Max 500KB.</p>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#111418] uppercase tracking-wider">Company Name</label>
                  <input type="text" defaultValue="CorpTech Inc." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#137fec]/20 outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#111418] uppercase tracking-wider">Industry</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#137fec]/20 outline-none transition-all">
                    <option>Software & Technology</option>
                    <option>Fintech</option>
                    <option>Healthcare</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-[#111418] uppercase tracking-wider">Company Bio</label>
                  <textarea rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#137fec]/20 outline-none transition-all" placeholder="Tell candidates about your company culture..." defaultValue="Leading the way in innovative software solutions for the global market." />
                </div>
              </div>
            </div>
          </section>

          {/* Section: Recruitment Preferences */}
          <section className="bg-white rounded-2xl border border-[#dbe0e6] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-[#111418]">Recruitment Preferences</h3>
            </div>
            <div className="p-6 space-y-4">
              <ToggleItem 
                title="Accepting Applications" 
                description="Toggle this off to hide all your active job postings temporarily." 
                defaultChecked={true} 
              />
              <ToggleItem 
                title="Email Notifications" 
                description="Receive instant alerts when a new candidate applies." 
                defaultChecked={true} 
              />
              <ToggleItem 
                title="Show Salary Ranges" 
                description="Display budget estimates on your public job listings." 
                defaultChecked={false} 
              />
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button className="px-6 py-2.5 text-sm font-bold text-[#617589] hover:bg-slate-100 rounded-xl transition-colors">
              Discard
            </button>
            <button className="px-8 py-2.5 bg-[#137fec] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#137fec]/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </EmployerLayout>
  );
};

// --- Sub-component for Settings Toggles ---

const ToggleItem = ({ title, description, defaultChecked }: any) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex-1 pr-4">
      <p className="text-sm font-bold text-[#111418]">{title}</p>
      <p className="text-xs text-[#617589] mt-0.5">{description}</p>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#137fec]"></div>
    </label>
  </div>
);

export default EmployerSettings;