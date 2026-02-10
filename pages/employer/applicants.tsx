import React, { useEffect, useState } from 'react';
import { EmployerLayout } from '@/components/layout/EmployerLayout';
import { apiClient } from '@/lib/apiClient';
import { useRequireAuth } from '@/lib/requireAuth';

const statusLabel = (status: string) => {
  if (status === 'shortlisted') return 'Upcoming';
  if (status === 'hired') return 'Sent';
  if (status === 'rejected') return 'In Progress';
  return 'Pending';
};

const timeAgo = (ts: string) => {
  try {
    const d = new Date(ts);
    const diff = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff/60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)} hours ago`;
    return `${Math.floor(diff/86400)} days ago`;
  } catch {
    return '';
  }
};

export default function ApplicantsPage() {
  useRequireAuth('employer');
  const [filterStage, setFilterStage] = useState('All Stages');
  const [search, setSearch] = useState('');
  const [jobFilter, setJobFilter] = useState<string>('');
  const [jobs, setJobs] = useState<any[]>([]);
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await apiClient('/api/employer/jobs');
        setJobs(res.data || []);
      } catch {}
    };
    loadJobs();
  }, []);

  useEffect(() => {
    const loadApplicants = async () => {
      setLoading(true);
      try {
        const params: string[] = [];
        if (search) params.push(`q=${encodeURIComponent(search)}`);
        if (jobFilter) params.push(`job_id=${jobFilter}`);
        const stageMap: Record<string,string> = { Screening: 'Screening', Interview: 'Interview', 'Technical Test': 'Technical Test', Offer: 'Offer' };
        if (filterStage !== 'All Stages') params.push(`stage=${encodeURIComponent(stageMap[filterStage] || filterStage)}`);
        const res = await apiClient(`/api/employer/applicants${params.length ? `?${params.join('&')}` : ''}`);
        setApps(res.data || []);
      } catch {}
      setLoading(false);
    };
    loadApplicants();
  }, [search, jobFilter, filterStage]);

  return (
    <EmployerLayout>
      <div className="animate-in fade-in duration-500">
        {/* Page Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-black text-[#111418] tracking-tight">Applicants</h2>
            <p className="text-[#617589] font-medium mt-1">Review and manage candidates across all active job postings.</p>
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#dbe0e6] rounded-lg text-sm font-bold text-[#111418] hover:bg-slate-50 transition-colors">
               <span className="material-symbols-outlined text-xl">download</span>
               Export List
             </button>
          </div>
        </div>

        {/* Filters & Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-[#dbe0e6] shadow-sm mb-8 flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[300px] relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#617589]">search</span>
            <input 
              type="text" 
              placeholder="Search by name, role, or email..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#dbe0e6] rounded-lg text-sm focus:ring-2 focus:ring-[#137fec]/20 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <select 
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-[#dbe0e6] rounded-lg text-sm font-bold text-[#111418] outline-none"
            >
              <option>All Stages</option>
              <option>Screening</option>
              <option>Interview</option>
              <option>Technical Test</option>
              <option>Offer</option>
            </select>
            
            <select className="px-4 py-2.5 bg-slate-50 border border-[#dbe0e6] rounded-lg text-sm font-bold text-[#111418] outline-none" value={jobFilter} onChange={(e) => setJobFilter(e.target.value)}>
              <option value="">All Jobs</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Applicants Table/List */}
        <div className="bg-white rounded-xl border border-[#dbe0e6] shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-[#617589] uppercase tracking-wider">Candidate</th>
                <th className="px-6 py-4 text-xs font-bold text-[#617589] uppercase tracking-wider">Applied Role</th>
                <th className="px-6 py-4 text-xs font-bold text-[#617589] uppercase tracking-wider">Stage</th>
                <th className="px-6 py-4 text-xs font-bold text-[#617589] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-[#617589] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(loading ? [] : apps).map((applicant) => (
                <tr key={applicant.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-11 rounded-full bg-cover bg-center border border-slate-200" style={{ backgroundImage: `url('https://api.dicebear.com/7.x/avataaars/svg?seed=${applicant.img}')` }} />
                      <div>
                        <p className="font-bold text-[#111418] leading-none mb-1">{applicant.name}</p>
                        <p className="text-xs text-[#617589]">{applicant.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-[#111418]">{applicant.role}</p>
                    <p className="text-[10px] text-[#617589] font-bold uppercase">{timeAgo(applicant.applied_at)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
                      {applicant.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`size-2 rounded-full ${
                        applicant.status === 'hired' ? 'bg-green-500' : 
                        applicant.status === 'shortlisted' ? 'bg-[#137fec]' : 'bg-orange-400'
                      }`} />
                      <span className="text-xs font-bold text-[#111418]">{statusLabel(applicant.status)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-[#137fec] hover:bg-[#137fec]/10 rounded-lg transition-colors" title="View Profile">
                        <span className="material-symbols-outlined">visibility</span>
                      </button>
                      <button className="p-2 text-[#617589] hover:bg-slate-200 rounded-lg transition-colors" title="Email Candidate">
                        <span className="material-symbols-outlined">mail</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </EmployerLayout>
  );
}