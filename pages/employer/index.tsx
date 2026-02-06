import React, { useState } from 'react';
import { EmployerLayout } from '@/components/layout/EmployerLayout';
import { PostJobModal } from '@/components/modals/PostJobModal';

const ActiveJobs = [
  { id: 1, title: 'Senior Frontend Developer', dept: 'Engineering', type: 'Full-time', stage: 'Interviewing', progress: 65, applicants: 24, news: 4, color: 'bg-[#137fec]' },
  { id: 2, title: 'Product Designer (UI/UX)', dept: 'Design', type: 'Remote', stage: 'Screening', progress: 30, applicants: 12, news: 2, color: 'bg-orange-400' },
  { id: 3, title: 'DevOps Engineer', dept: 'Engineering', type: 'Hybrid', stage: 'Offering', progress: 90, applicants: 8, news: 0, color: 'bg-green-500' },
];

export default function EmployerDashboard() {
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);

  return (
    <EmployerLayout>
      {/* Page Heading */}
      <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-[#111418] tracking-tight">Hiring Overview</h2>
          <p className="text-[#617589] font-medium mt-1">Monitor your company's recruitment performance.</p>
        </div>
        <button 
          onClick={() => setIsPostJobOpen(true)}
          className="flex items-center gap-2 bg-[#137fec] hover:bg-[#137fec]/90 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg shadow-[#137fec]/20"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          <span>Post a New Job</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Open Positions" value="12" trend="+2%" icon="work" color="text-blue-600" bgColor="bg-blue-50" />
        <StatCard title="New Applications" value="48" trend="+15%" icon="person_add" color="text-purple-600" bgColor="bg-purple-50" />
        <StatCard title="Interviews Scheduled" value="06" trend="-5%" icon="event" color="text-orange-600" bgColor="bg-orange-50" isDown />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Job Postings Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xl font-bold text-[#111418]">Active Job Postings</h3>
            <button className="text-[#137fec] text-sm font-bold hover:underline">View All</button>
          </div>
          
          <div className="bg-white rounded-xl border border-[#dbe0e6] shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-[#617589] uppercase">Job Title & Dept</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#617589] uppercase">Hiring Stage</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#617589] uppercase text-center">Applicants</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ActiveJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5">
                      <p className="font-bold text-[#111418]">{job.title}</p>
                      <p className="text-xs text-[#617589]">{job.dept} • {job.type}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="w-full max-w-xs">
                        <div className="flex justify-between mb-1.5">
                          <span className="text-[10px] font-bold text-[#137fec] uppercase">{job.stage}</span>
                          <span className="text-[10px] font-bold text-[#617589]">{job.progress}% Complete</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className={`${job.color} h-full rounded-full`} style={{ width: `${job.progress}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-bold text-[#111418]">{job.applicants}</span>
                        {job.news > 0 && (
                          <span className="px-2 py-0.5 bg-[#137fec]/10 text-[#137fec] text-[10px] font-bold rounded-full">+{job.news} new</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="text-[#617589] hover:text-[#111418]">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar: Recent Applicants */}
        <div className="space-y-6">
           <h3 className="text-xl font-bold text-[#111418]">Recent Applicants</h3>
           <div className="bg-white rounded-xl border border-[#dbe0e6] shadow-sm p-4 space-y-4">
              <ApplicantItem name="David Miller" role="Frontend Developer" time="2m ago" img="5" />
              <ApplicantItem name="Emma Watson" role="UX Designer" time="45m ago" img="6" />
              <button className="w-full py-3 text-xs font-bold text-[#617589] bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                Load More Applicants
              </button>
           </div>
        </div>
      </div>

      {/* Post Job Modal Component */}
      <PostJobModal 
        isOpen={isPostJobOpen} 
        onClose={() => setIsPostJobOpen(false)} 
      />
    </EmployerLayout>
  );
}

// --- Helper Components ---

const StatCard = ({ title, value, trend, icon, color, bgColor, isDown = false }: any) => (
  <div className="bg-white p-6 rounded-xl border border-[#dbe0e6] shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 ${bgColor} ${color} rounded-lg`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <span className={`${isDown ? 'text-red-500 bg-red-50' : 'text-green-500 bg-green-50'} text-sm font-bold flex items-center px-2 py-1 rounded-full`}>
        <span className="material-symbols-outlined text-sm mr-1">{isDown ? 'trending_down' : 'trending_up'}</span>{trend}
      </span>
    </div>
    <p className="text-[#617589] text-sm font-semibold uppercase tracking-wider mb-1">{title}</p>
    <p className="text-3xl font-black text-[#111418]">{value}</p>
  </div>
);

const ApplicantItem = ({ name, role, time, img }: any) => (
  <div className="p-3 border border-slate-100 rounded-lg hover:border-[#137fec]/30 transition-all bg-white">
    <div className="flex items-center gap-3 mb-3">
      <div className="size-10 rounded-full bg-cover bg-center border border-slate-100" style={{ backgroundImage: `url('https://api.dicebear.com/7.x/avataaars/svg?seed=${img}')` }} />
      <div className="flex-1 overflow-hidden">
        <p className="font-bold text-sm text-[#111418] truncate">{name}</p>
        <p className="text-[11px] text-[#617589] truncate">{role} Applicant</p>
      </div>
      <div className="text-[10px] font-bold text-slate-400">{time}</div>
    </div>
    <div className="flex gap-2">
      <button className="flex-1 py-2 text-xs font-bold bg-[#137fec] text-white rounded-lg hover:bg-[#137fec]/90 transition-colors">Review</button>
      <button className="px-3 py-2 text-xs font-bold border border-slate-200 text-[#617589] rounded-lg hover:bg-slate-50 transition-colors">
        <span className="material-symbols-outlined text-sm">mail</span>
      </button>
    </div>
  </div>
);