import React, { useEffect, useState } from 'react';
import { EmployerLayout } from '@/components/layout/EmployerLayout';
import { PostJobModal } from '@/components/modals/PostJobModal';
import { apiClient } from '@/lib/apiClient';
import { useRequireAuth } from '@/lib/requireAuth';
import { ApplicantReviewModal } from '@/components/modals/ApplicantReviewModal';

type Job = {
  id: number;
  title: string;
  dept: string;
  type: string;
  // These are placeholders for now, we will add them to the API later
  stage: string;
  progress: number;
  applicants: number;
  news: number;
  color: string;
  description_html?: string;
  requirements?: string[];
  benefits?: string[];
};

export default function EmployerDashboard() {
  useRequireAuth('employer');
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<Job | undefined>(undefined);
  const [jobToDelete, setJobToDelete] = useState<number | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [openPositions, setOpenPositions] = useState(0);
  const [newAppsCount, setNewAppsCount] = useState(0);
  const [newAppsTrend, setNewAppsTrend] = useState<string>('');
  const [interviewsCount, setInterviewsCount] = useState(0);
  const [interviewsTrend, setInterviewsTrend] = useState<string>('');
  const [recentApplicants, setRecentApplicants] = useState<{ name: string; role: string; time: string; img: string }[]>([]);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewCandidateId, setReviewCandidateId] = useState<number | undefined>(undefined);

  const refreshJobs = async () => {
    setLoading(true);
    try {
      const res = await apiClient('/api/employer/jobs');
      setJobs(res.data || []);
    } catch (error) {
      console.error('Failed to fetch jobs', error);
    }
    setLoading(false);
  };

  const handleEdit = async (job: Job) => {
    try {
      // Fetch full job details including description, requirements, and benefits
      const fullJobDetails = await apiClient(`/api/jobs/${job.id}`);
      setJobToEdit({
        ...job,
        description_html: fullJobDetails.description_html,
        requirements: fullJobDetails.requirements,
        benefits: fullJobDetails.benefits
      });
      setIsPostJobOpen(true);
    } catch (error) {
      console.error('Failed to fetch job details for editing:', error);
      alert('Failed to load job details for editing. Please try again.');
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      setJobToDelete(id);
    }
  };

  useEffect(() => {
    const deleteJob = async () => {
      if (!jobToDelete) return;
      try {
        await apiClient(`/api/employer/jobs/${jobToDelete}`, { method: 'DELETE' });
        await refreshJobs();
      } catch (error) {
        console.error('Failed to delete job', error);
        alert('Failed to delete job. Please try again.');
      } finally {
        setJobToDelete(null);
      }
    };
    deleteJob();
  }, [jobToDelete]);

  useEffect(() => {
    refreshJobs();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const s = await apiClient('/api/employer/stats');
        setOpenPositions(s.openPositions || 0);
        const ap = s.newApplications || {};
        const it = s.interviewsScheduled || {};
        setNewAppsCount(ap.count || 0);
        setInterviewsCount(it.count || 0);
        setNewAppsTrend(typeof ap.trendPct === 'number' ? `${ap.trendPct > 0 ? '+' : ''}${ap.trendPct}%` : '');
        setInterviewsTrend(typeof it.trendPct === 'number' ? `${it.trendPct > 0 ? '+' : ''}${it.trendPct}%` : '');
      } catch {}
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const loadRecent = async () => {
      try {
        const res = await apiClient('/api/employer/recent-applicants');
        type RecentApplicant = { applied_at: string; name: string; role: string; img: string };
        const items = (res.data || []).map((r: RecentApplicant) => {
          const dt = new Date(r.applied_at);
          const diffMin = Math.max(0, Math.round((Date.now() - dt.getTime()) / 60000));
          const time = diffMin < 60 ? `${diffMin}m ago` : `${Math.round(diffMin / 60)}h ago`;
          return { name: r.name, role: r.role, time, img: r.img };
        });
        setRecentApplicants(items);
      } catch {}
    };
    loadRecent();
  }, []);

  return (
    <EmployerLayout>
      {/* Page Heading */}
      <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-[#111418] tracking-tight">Hiring Overview</h2>
          <p className="text-[#617589] font-medium mt-1">Monitor your company&apos;s recruitment performance.</p>
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
        <StatCard title="Open Positions" value={String(openPositions)} trend={newAppsTrend ? '' : ''} icon="work" color="text-blue-600" bgColor="bg-blue-50" />
        <StatCard title="New Applications" value={String(newAppsCount)} trend={newAppsTrend} icon="person_add" color="text-purple-600" bgColor="bg-purple-50" isDown={newAppsTrend.startsWith('-')} />
        <StatCard title="Interviews Scheduled" value={String(interviewsCount)} trend={interviewsTrend} icon="event" color="text-orange-600" bgColor="bg-orange-50" isDown={interviewsTrend.startsWith('-')} />
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
                  <th className="px-6 py-4 text-xs font-bold text-[#617589] uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center p-8 text-gray-500">Loading jobs...</td>
                  </tr>
                ) : jobs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center p-8 text-gray-500">No active jobs found.</td>
                  </tr>
                ) : (
                  jobs.map((job) => (
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
                        <div className="flex items-center justify-end">
                          <Link
                            href={`/employer/pipeline/${job.id}`}
                            className="mr-2 flex items-center gap-2 px-4 py-2 bg-[#137fec] text-white rounded-lg text-sm font-bold hover:bg-[#137fec]/90 transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">account_tree</span>
                            Pipeline Overview
                          </Link>
          <button
            onClick={() => handleEdit(job)}
            className="p-2 text-[#617589] hover:text-[#137fec] hover:bg-slate-100 rounded-md"
          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
          <button
            onClick={() => handleDelete(job.id)}
            className="p-2 text-[#617589] hover:text-red-500 hover:bg-red-50 rounded-md"
          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar: Recent Applicants */}
        <div className="space-y-6">
           <h3 className="text-xl font-bold text-[#111418]">Recent Applicants</h3>
           <div className="bg-white rounded-xl border border-[#dbe0e6] shadow-sm p-4 space-y-4">
              {recentApplicants.map((a) => (
                <ApplicantItem key={`${a.img}-${a.time}`} name={a.name} role={a.role} time={a.time} img={a.img} onReview={() => { setReviewCandidateId(Number(a.img)); setIsReviewOpen(true); }} />
              ))}
              <button className="w-full py-3 text-xs font-bold text-[#617589] bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                Load More Applicants
              </button>
           </div>
        </div>
      </div>

      {/* Modals */}
      <PostJobModal
        isOpen={isPostJobOpen}
        onClose={() => {
          setIsPostJobOpen(false);
          setJobToEdit(undefined);
        }}
        onCreated={refreshJobs}
        jobToEdit={jobToEdit}
      />
      <ApplicantReviewModal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} candidateId={reviewCandidateId} />
    </EmployerLayout>
  );
}

// --- Helper Components ---

interface StatCardProps { title: string; value: string; trend: string; icon: string; color: string; bgColor: string; isDown?: boolean }
const StatCard = ({ title, value, trend, icon, color, bgColor, isDown = false }: StatCardProps) => (
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

const ApplicantItem = ({ name, role, time, img, onReview }: { name: string; role: string; time: string; img: string; onReview?: () => void }) => (
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
      <button onClick={onReview} className="flex-1 py-2 text-xs font-bold bg-[#137fec] text-white rounded-lg hover:bg-[#137fec]/90 transition-colors">Review</button>
      <button className="px-3 py-2 text-xs font-bold border border-slate-200 text-[#617589] rounded-lg hover:bg-slate-50 transition-colors">
        <span className="material-symbols-outlined text-sm">mail</span>
      </button>
    </div>
  </div>
);
import Link from 'next/link';