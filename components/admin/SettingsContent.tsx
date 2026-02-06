import React from 'react';

const SettingsContent = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      <div>
        <h1 className="text-[#111418] text-3xl font-black tracking-tight">Site Settings</h1>
        <p className="text-[#617589] mt-1">Configure global platform behavior and appearance.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 max-w-4xl">
        
        {/* Section: General Configuration */}
        <section className="bg-white rounded-xl border border-[#dbe0e6] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#f0f2f4]">
            <h3 className="text-lg font-bold text-[#111418]">General Configuration</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#111418]">Platform Name</label>
                <input type="text" className="w-full bg-[#f0f2f4] border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#137fec] outline-none" defaultValue="JobBoard Pro" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#111418]">Support Email</label>
                <input type="email" className="w-full bg-[#f0f2f4] border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#137fec] outline-none" defaultValue="support@jobboard.com" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-yellow-600">construction</span>
                <div>
                  <p className="text-sm font-bold text-yellow-800">Maintenance Mode</p>
                  <p className="text-xs text-yellow-700">Disable the frontend for all users except admins.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Section: Branding */}
        <section className="bg-white rounded-xl border border-[#dbe0e6] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#f0f2f4]">
            <h3 className="text-lg font-bold text-[#111418]">Appearance & Branding</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-6">
              <div className="size-20 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                <span className="material-symbols-outlined">image</span>
                <span className="text-[10px] font-bold">LOGO</span>
              </div>
              <div className="space-y-2">
                <button className="px-4 py-2 bg-[#137fec] text-white text-xs font-bold rounded-lg hover:bg-[#137fec]/90 transition-colors">Upload New Logo</button>
                <p className="text-[10px] text-[#617589]">Recommended: SVG or PNG with transparent background. Max 2MB.</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#111418]">Primary Brand Color</label>
              <div className="flex gap-3 items-center">
                <div className="size-10 rounded-lg bg-[#137fec] border border-black/10"></div>
                <input type="text" className="bg-[#f0f2f4] border-none rounded-lg px-4 py-2 text-sm font-mono w-32" defaultValue="#137FEC" />
              </div>
            </div>
          </div>
        </section>

        {/* Save Button Container */}
        <div className="flex justify-end gap-4">
          <button className="px-6 py-2.5 rounded-lg text-sm font-bold text-[#617589] hover:bg-slate-100 transition-colors">Discard Changes</button>
          <button className="px-8 py-2.5 rounded-lg bg-[#137fec] text-white text-sm font-bold shadow-lg shadow-[#137fec]/20 hover:scale-[1.02] active:scale-[0.98] transition-all">Save All Changes</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsContent;