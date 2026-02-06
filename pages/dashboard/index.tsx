import React from 'react';
import Head from 'next/head';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function DashboardPage() {
  const stats = [
    { label: 'Total Applied', value: '42', trend: '+5 this month', icon: 'description', color: 'text-[#137fec]', bg: 'bg-[#137fec]/10' },
    { label: 'Interviews', value: '12', trend: '2 scheduled', icon: 'event', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Offers', value: '3', trend: '1 new offer', icon: 'emoji_events', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  const applications = [
    { company: 'TechCorp', initial: 'T', role: 'Senior Product Designer', type: 'Remote · Full-time', date: 'Oct 24, 2023', status: 'Interviewing', statusColor: 'bg-blue-100 text-blue-700' },
    { company: 'Innovate UI', initial: 'I', role: 'Lead UX Researcher', type: 'San Francisco, CA', date: 'Oct 20, 2023', status: 'Offer Received', statusColor: 'bg-emerald-100 text-emerald-700' },
    { company: 'Global Link', initial: 'G', role: 'Visual Designer', type: 'Contract · Hybrid', date: 'Oct 18, 2023', status: 'Pending', statusColor: 'bg-gray-100 text-gray-600' },
    { company: 'Studio Noir', initial: 'S', role: 'Interaction Designer', type: 'Berlin, DE', date: 'Oct 12, 2023', status: 'Rejected', statusColor: 'bg-red-100 text-red-700' },
  ];

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
          <div className="px-6 py-5 border-b border-[#dbe0e6] flex justify-between items-center bg-white">
            <h3 className="text-[#111418] text-xl font-bold">Application History</h3>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-slate-50 rounded-lg text-[#617589] border border-[#dbe0e6] transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">filter_list</span>
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-[#dbe0e6]">
                  <th className="px-6 py-4 text-[#617589] text-xs font-black uppercase tracking-wider">Company & Role</th>
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
             <p className="text-xs text-[#617589] font-bold">Showing 4 of 42 applications</p>
             <div className="flex gap-2">
                <button className="px-3 py-1 text-sm font-bold border border-[#dbe0e6] rounded-lg hover:bg-white transition-colors disabled:opacity-50">Prev</button>
                <button className="px-3 py-1 text-sm font-bold border border-[#dbe0e6] rounded-lg hover:bg-white transition-colors">Next</button>
             </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}