import React, { useEffect, useState } from 'react';
import StatCard from './StatCard';
import { apiClient } from '@/lib/apiClient';

const OverviewContent = () => {
  const [stats, setStats] = useState<{ totalUsers: number; activeJobs: number; pendingApprovals: number } | null>(null);
  const [apps, setApps] = useState<Array<{ id: number; applicant: string; jobTitle: string; status: string }>>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient('/api/admin/overview');
        setStats(res.stats);
        setApps(res.recentApplications || []);
      } catch {
        try {
          const emp = await apiClient('/api/employer/stats');
          const comps = await apiClient('/api/companies');
          setStats({
            totalUsers: NaN,
            activeJobs: emp.openPositions ?? NaN,
            pendingApprovals: Array.isArray(comps) ? comps.filter((c: any) => !c.verified).length : NaN,
          } as any);
          const recent = await apiClient('/api/employer/recent-applicants');
          setApps((recent.data || []).map((r: any) => ({ id: r.id, applicant: r.name, jobTitle: r.role, status: 'applied' })));
        } catch {}
      }
    };
    load();
  }, []);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-black tracking-tight text-[#111418]">Overview</h2>
        <p className="text-[#617589] mt-1">Welcome back. Here's a snapshot of the platform's performance today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total Users" value={String(stats?.totalUsers ?? '—')} trend="" icon="person" />
        <StatCard label="Active Jobs" value={String(stats?.activeJobs ?? '—')} trend="" icon="work" />
        <StatCard label="Pending Approvals" value={String(stats?.pendingApprovals ?? '—')} trend="Priority" icon="pending_actions" isPriority />
      </div>

      {/* Recent Applications Table */}
      <div className="bg-white rounded-xl border border-[#dbe0e6] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#dbe0e6] flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-[#111418]">Recent Applications</h3>
          <button className="flex items-center gap-2 px-3 py-2 bg-[#137fec] text-white rounded-lg text-sm font-bold hover:bg-[#137fec]/90 transition-colors">
            <span className="material-symbols-outlined text-lg">download</span>
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f6f7f8]">
                <th className="px-6 py-4 text-xs font-bold text-[#617589] uppercase">Applicant</th>
                <th className="px-6 py-4 text-xs font-bold text-[#617589] uppercase">Job Title</th>
                <th className="px-6 py-4 text-xs font-bold text-[#617589] uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-[#617589] uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dbe0e6]">
              {apps.map(a => (
                <tr key={a.id} className="hover:bg-[#f0f2f4]/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">
                        {a.applicant?.charAt(0) || '?'}
                      </div>
                      <span className="text-sm font-semibold text-[#111418]">{a.applicant}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#617589]">{a.jobTitle}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${a.status === 'applied' ? 'bg-blue-100 text-blue-700' : a.status === 'shortlisted' ? 'bg-amber-100 text-amber-700' : a.status === 'hired' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#137fec] font-bold text-sm">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OverviewContent;