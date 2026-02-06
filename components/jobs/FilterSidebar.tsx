import React from 'react';

export const FilterSidebar = () => {
  return (
    <aside className="w-full md:w-72 flex-shrink-0">
      <div className="bg-white rounded-2xl border border-[#f0f2f4] p-7 sticky top-24 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold flex items-center gap-2 text-[#111418]">
            <span className="material-symbols-outlined text-[#137fec]">tune</span> Filters
          </h3>
          <button className="text-xs font-bold text-[#137fec] hover:underline">Clear All</button>
        </div>

        <div className="space-y-10">
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.1em] text-[#94a3b8] mb-5">Category</h4>
            <div className="space-y-4">
              {['Development (42)', 'Design (18)', 'Marketing (12)', 'Sales (8)'].map((cat) => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="rounded-md border-[#cbd5e1] text-[#137fec] focus:ring-[#137fec] h-5 w-5" />
                  <span className="text-sm font-semibold text-[#475569] group-hover:text-[#137fec]">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.1em] text-[#94a3b8] mb-5">Job Type</h4>
            <div className="flex flex-wrap gap-2">
              {['Full-time', 'Contract', 'Remote'].map(type => (
                <button key={type} className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${type === 'Full-time' ? 'bg-[#eff6ff] border-[#137fec] text-[#137fec]' : 'border-[#f0f2f4] text-[#617589]'}`}>
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.1em] text-[#94a3b8] mb-5">Salary Range</h4>
            <input type="range" className="w-full h-1.5 bg-[#f1f5f9] rounded-lg appearance-none cursor-pointer accent-[#137fec]" />
            <div className="flex justify-between mt-3 text-[11px] font-bold text-[#94a3b8]">
              <span>$50k</span><span>$200k+</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};