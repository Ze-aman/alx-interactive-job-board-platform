import React, { useState } from 'react';
import { useJobs } from '@/hooks/useJobs';

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const { filters, setFilters } = useJobs();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const search = query.trim();
    const loc = location.trim();
    setFilters({
      ...filters,
      search: search || undefined,
      location: loc || undefined,
      page: 1,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl flex flex-col md:flex-row gap-2 bg-white p-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-[#f0f2f4]">
      <div className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-[#f0f2f4] py-3 md:py-0">
        <span className="material-symbols-outlined text-[#617589] mr-3">search</span>
        <input 
          className="w-full bg-transparent border-none focus:ring-0 text-[#111418] placeholder:text-[#94a3b8] text-base" 
          placeholder="Job title, skills, or company" 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      
      <div className="flex-1 flex items-center px-4 py-3 md:py-0">
        <span className="material-symbols-outlined text-[#617589] mr-3">location_on</span>
        <input 
          className="w-full bg-transparent border-none focus:ring-0 text-[#111418] placeholder:text-[#94a3b8] text-base" 
          placeholder="City, state, or remote" 
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      
      <button type="submit" className="bg-[#137fec] hover:bg-[#137fec]/90 text-white font-bold py-3.5 px-10 rounded-xl transition-all">
        Search
      </button>
    </form>
  );
};