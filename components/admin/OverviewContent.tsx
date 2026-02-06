import React from 'react';
import StatCard from './StatCard'; // Ensure this matches your file path

const OverviewContent = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-black tracking-tight text-[#111418]">Overview</h2>
        <p className="text-[#617589] mt-1">Welcome back. Here's a snapshot of the platform's performance today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total Users" value="12,450" trend="12%" icon="person" />
        <StatCard label="Active Jobs" value="842" trend="5%" icon="work" />
        <StatCard 
          label="Pending Approvals" 
          value="34" 
          trend="Priority" 
          icon="pending_actions" 
          isPriority 
        />
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
              {/* Sample Row */}
              <tr className="hover:bg-[#f0f2f4]/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">JD</div>
                    <span className="text-sm font-semibold text-[#111418]">Jane Doe</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[#617589]">Senior Software Engineer</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                    Pending
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                   <button className="text-[#137fec] font-bold text-sm">View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OverviewContent;