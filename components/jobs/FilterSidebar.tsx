import React, { useEffect, useMemo, useState } from 'react';
import { useJobs } from '@/hooks/useJobs';

export const FilterSidebar = () => {
  const { filters, setFilters } = useJobs();
  const [locationInput, setLocationInput] = useState(filters.location || '');

  const selectedCategories = useMemo(() => Array.isArray(filters.category) ? filters.category : (filters.category ? [filters.category] : []), [filters.category]);
  const toggleCategory = (cat: string) => {
    const next = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];
    setFilters({ ...filters, category: next.length ? next : undefined, page: 1 });
  };

  const selectedExperiences = useMemo(() => Array.isArray(filters.experience) ? filters.experience : (filters.experience ? [filters.experience] : []), [filters.experience]);
  const toggleExperience = (exp: 'entry' | 'mid' | 'senior') => {
    const next = selectedExperiences.includes(exp)
      ? selectedExperiences.filter((e) => e !== exp)
      : [...selectedExperiences, exp];
    setFilters({ ...filters, experience: next.length ? next : undefined, page: 1 });
  };

  useEffect(() => {
    const t = setTimeout(() => {
      const loc = locationInput.trim() || undefined;
      if ((filters.location || undefined) !== loc) {
        setFilters({ ...filters, location: loc, page: 1 });
      }
    }, 300);
    return () => clearTimeout(t);
  }, [locationInput]);

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
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="rounded-md border-[#cbd5e1] text-[#137fec] focus:ring-[#137fec] h-5 w-5"
                  />
                  <span className="text-sm font-semibold text-[#475569] group-hover:text-[#137fec]">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.1em] text-[#94a3b8] mb-5">Location</h4>
            <div>
              <input
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="City, Country or Remote"
                className="w-full h-10 px-3 rounded-lg border border-[#cfdbe7] text-sm outline-none"
              />
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
                  onClick={() => toggleExperience(opt.value as 'entry' | 'mid' | 'senior')}
                  className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                    selectedExperiences.includes(opt.value as any) ? 'bg-[#eff6ff] border-[#137fec] text-[#137fec]' : 'border-[#f0f2f4] text-[#617589]'
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