import React, { useState } from 'react';
import { useJobs } from '@/hooks/useJobs';

export const FilterSidebar = () => {
  const { filters, setFilters } = useJobs();
  const [locationInput, setLocationInput] = useState(filters.location || '');

  const setCategory = (cat?: string) => {
    setFilters({ ...filters, category: cat, page: 1 });
  };

  const setExperience = (exp?: 'entry' | 'mid' | 'senior') => {
    setFilters({ ...filters, experience: exp, page: 1 });
  };

  const applyLocation = (loc?: string) => {
    setFilters({ ...filters, location: loc || undefined, page: 1 });
  };

  const clearAll = () => {
    setFilters({});
    setLocationInput('');
  };

  const categories = ['Engineering', 'Design', 'Marketing', 'Sales'];

  return (
    <aside className="w-full md:w-72 flex-shrink-0">
      <div className="bg-white rounded-2xl border border-[#f0f2f4] p-7 sticky top-24 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold flex items-center gap-2 text-[#111418]">
            <span className="material-symbols-outlined text-[#137fec]">tune</span> Filters
          </h3>
          <button onClick={clearAll} className="text-xs font-bold text-[#137fec] hover:underline">Clear All</button>
        </div>

        <div className="space-y-10">
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.1em] text-[#94a3b8] mb-5">Category</h4>
            <div className="space-y-3">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === cat}
                    onChange={() => setCategory(filters.category === cat ? undefined : cat)}
                    className="rounded-md border-[#cbd5e1] text-[#137fec] focus:ring-[#137fec] h-5 w-5"
                  />
                  <span className="text-sm font-semibold text-[#475569] group-hover:text-[#137fec]">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.1em] text-[#94a3b8] mb-5">Location</h4>
            <div className="flex gap-2">
              <input
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onBlur={() => applyLocation(locationInput.trim() || undefined)}
                placeholder="City, Country or Remote"
                className="flex-1 h-10 px-3 rounded-lg border border-[#cfdbe7] text-sm outline-none"
              />
              <button
                onClick={() => applyLocation(locationInput.trim() || undefined)}
                className="px-4 py-2 rounded-lg bg-[#137fec] text-white text-xs font-bold"
              >Apply</button>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.1em] text-[#94a3b8] mb-5">Experience Level</h4>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Entry-Level', value: 'entry' },
                { label: 'Mid-Level', value: 'mid' },
                { label: 'Senior', value: 'senior' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setExperience(filters.experience === (opt.value as any) ? undefined : (opt.value as any))}
                  className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                    filters.experience === opt.value ? 'bg-[#eff6ff] border-[#137fec] text-[#137fec]' : 'border-[#f0f2f4] text-[#617589]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};