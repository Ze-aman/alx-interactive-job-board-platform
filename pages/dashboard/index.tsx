import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useRequireAuth } from '@/lib/requireAuth';

export default function DashboardPage() {
  useRequireAuth('candidate');
  const router = useRouter();
  const [stats, setStats] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [page, setPage] = useState<number>(Number(router.query.page) || 1);
  const [limit] = useState<number>(Number(router.query.limit) || 10);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<string>((router.query.status as string) || '');
  const [sort, setSort] = useState<string>((router.query.sort as string) || 'date_desc');
  const [from, setFrom] = useState<string>((router.query.from as string) || '');
  const [to, setTo] = useState<string>((router.query.to as string) || '');
  const [company, setCompany] = useState<string>((router.query.company as string) || '');

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (status) params.set('status', status);
    if (sort) params.set('sort', sort);
    if (from && to) { params.set('from', from); params.set('to', to); }
    if (company) params.set('company', company);

    const load = async () => {
      const res = await fetch(`/api/applications?${params.toString()}`);
      if (!res.ok) return;
      const json = await res.json();
      const rows = json.data;
      const items = rows.map((r: any) => ({
        company: r.company_name,
        initial: r.company_name?.charAt(0) || '?',
        role: r.title,
        type: r.location,
        date: new Date(r.applied_at).toLocaleDateString(),
        status: r.status === 'applied' ? 'Applied' : r.status === 'shortlisted' ? 'Shortlisted' : r.status === 'hired' ? 'Hired' : 'Rejected',
        statusColor:
          r.status === 'applied' ? 'bg-blue-100 text-blue-700' :
          r.status === 'shortlisted' ? 'bg-amber-100 text-amber-700' :
          r.status === 'hired' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700',
      }));
      setApplications(items);
      setTotal(json.pagination.total);
      const s = json.stats;
      setStats([
        { label: 'Total Applied', value: String(s.applied), trend: s.trend.totalDeltaPct != null ? `${s.trend.totalDeltaPct}% last 30d` : '', icon: 'description', color: 'text-[#137fec]', bg: 'bg-[#137fec]/10' },
        { label: 'Shortlisted', value: String(s.shortlisted), trend: '', icon: 'event', color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: 'Hired', value: String(s.hired), trend: '', icon: 'emoji_events', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Rejected', value: String(s.rejected), trend: '', icon: 'block', color: 'text-red-500', bg: 'bg-red-500/10' },
      ]);
    };
    load();
  }, [page, limit, status, sort, from, to, company]);

  return (
    <>
      <Head>
        <title>Dashboard | JobPortal</title>
      </Head>
      
      <DashboardLayout>
        {/* Heading Section */}
        <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
          <div>
            <h2 className="text-[#111418] text-3xl font-black tracking-tight">Application Dashboard</h2>
            <p className="text-[#617589] font-medium">Track and manage your professional journey.</p>
          </div>
          <button className="bg-[#137fec] hover:bg-[#137fec]/90 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md flex items-center gap-2 active:scale-95">
            <span className="material-symbols-outlined text-lg">search</span>
            Find New Jobs
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-6 border border-[#dbe0e6] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <p className="text-[#617589] text-xs font-black uppercase tracking-widest">{stat.label}</p>
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  <span className="material-symbols-outlined">{stat.icon}</span>
                </div>
              </div>
              <p className="text-[#111418] text-3xl font-black">{stat.value}</p>
              <p className="text-[#617589] text-xs font-bold mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-emerald-500">trending_up</span> 
                {stat.trend}
              </p>
            </div>
          ))}
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-2xl border border-[#dbe0e6] shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-[#dbe0e6] flex flex-wrap gap-3 items-center bg-white justify-between">
            <h3 className="text-[#111418] text-xl font-bold">Application History</h3>
            <div className="flex flex-wrap gap-2 items-center">
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="h-9 px-3 border rounded-lg text-sm" />
              <span className="text-[#617589] text-xs">to</span>
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="h-9 px-3 border rounded-lg text-sm" />
              <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" className="h-9 px-3 border rounded-lg text-sm" />
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 px-3 border rounded-lg text-sm">
                <option value="">All Statuses</option>
                <option value="applied">Applied</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-9 px-3 border rounded-lg text-sm">
                <option value="date_desc">Most Recent</option>
                <option value="date_asc">Oldest</option>
                <option value="company_asc">Company A→Z</option>
                <option value="company_desc">Company Z→A</option>
                <option value="role_asc">Role A→Z</option>
                <option value="role_desc">Role Z→A</option>
              </select>
              <button
                onClick={() => {
                  setPage(1);
                  router.push({ pathname: router.pathname, query: { page: 1, limit, status: status || undefined, sort, from: from || undefined, to: to || undefined, company: company || undefined } }, undefined, { shallow: true });
                }}
                className="px-4 h-9 rounded-lg bg-[#137fec] text-white text-xs font-bold"
              >Apply</button>
              <button
                onClick={() => {
                  setStatus(''); setSort('date_desc'); setFrom(''); setTo(''); setCompany(''); setPage(1);
                  router.push({ pathname: router.pathname, query: { page: 1, limit } }, undefined, { shallow: true });
                }}
                className="px-4 h-9 rounded-lg border text-xs font-bold"
              >Reset</button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-[#dbe0e6]">
                  <th className="px-6 py-4 text-[#617589] text-xs font-black uppercase tracking-wider">Company & Role</th>
                  <th className="px-6 py-4 text-[#617589] text-xs font-black uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-[#617589] text-xs font-black uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[#617589] text-xs font-black uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="size-11 rounded-xl bg-slate-100 flex items-center justify-center font-black text-[#137fec] text-lg border border-slate-200">
                          {app.initial}
                        </div>
                        <div>
                          <div className="text-[#111418] font-bold group-hover:text-[#137fec] transition-colors">{app.company}</div>
                          <div className="text-[#617589] text-xs font-medium">{app.role} • <span className="opacity-70">{app.date}</span></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-[#617589] text-xs font-medium">{app.type}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-tight ${app.statusColor}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="text-[#137fec] hover:text-[#0d66c2] font-black text-sm transition-colors">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-[#dbe0e6] flex justify-between items-center">
             <p className="text-xs text-[#617589] font-bold">Page {page} of {Math.max(1, Math.ceil(total / limit))}</p>
             <div className="flex gap-2">
                <button
                  onClick={() => {
                    const newPage = Math.max(1, page - 1);
                    setPage(newPage);
                    router.push({ pathname: router.pathname, query: { page: newPage, limit, status: status || undefined, sort, from: from || undefined, to: to || undefined } }, undefined, { shallow: true });
                  }}
                  disabled={page <= 1}
                  className="px-3 py-1 text-sm font-bold border border-[#dbe0e6] rounded-lg hover:bg-white transition-colors disabled:opacity-50"
                >Prev</button>
                <button
                  onClick={() => {
                    const maxPage = Math.ceil(total / limit);
                    const newPage = page < maxPage ? page + 1 : page;
                    setPage(newPage);
                    router.push({ pathname: router.pathname, query: { page: newPage, limit, status: status || undefined, sort, from: from || undefined, to: to || undefined } }, undefined, { shallow: true });
                  }}
                  disabled={page >= Math.ceil(total / limit)}
                  className="px-3 py-1 text-sm font-bold border border-[#dbe0e6] rounded-lg hover:bg-white transition-colors disabled:opacity-50"
                >Next</button>
             </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}