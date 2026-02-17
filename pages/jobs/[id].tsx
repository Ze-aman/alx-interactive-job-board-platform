import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { SectionContainer } from '../../components/layout/SectionContainer';
import { apiClient } from '@/lib/apiClient';

interface JobDetailData {
  id: number;
  title: string;
  company_name: string;
  location: string | null;
  employment_type?: string | null;
  department?: string | null;
  created_at: string;
  description_html?: string | null;
  requirements?: string[];
  benefits?: string[];
}

export default function JobDetail() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const [job, setJob] = useState<JobDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isApplied, setIsApplied] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyMsg, setApplyMsg] = useState<string | null>(null);
  const [canApply, setCanApply] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      setError('');
      try {
        const data = await apiClient(`/api/jobs/${id}`);
        setJob(data);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Failed to load job';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    const checkApplied = async () => {
      if (!id) return;
      try {
        const session = await apiClient('/api/auth/me');
        if (!session?.isLoggedIn || session.role !== 'candidate') {
          setCanApply(false);
          return;
        }
        setCanApply(true);
        const apps = await apiClient(`/api/applications?job_id=${id}&limit=1`);
        setIsApplied(Array.isArray(apps?.data) && apps.data.length > 0);
      } catch {}
    };
    checkApplied();
  }, [id]);

  return (
    <div className="bg-[#f6f7f8] min-h-screen">
      <SectionContainer className="py-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-8 text-sm font-medium">
          <button onClick={() => router.push('/')} className="text-[#617589] hover:text-[#137fec]">Home</button>
          <span className="text-[#94a3b8]">/</span>
          <span className="text-[#617589]">{job?.department || 'Jobs'}</span>
          <span className="text-[#94a3b8]">/</span>
          <span className="text-[#111418]">{job?.title || ''}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Job Details */}
          <div className="w-full lg:w-[70%] space-y-8">
            
            {/* Main Header Card */}
            <div className="bg-white border border-[#f0f2f4] rounded-2xl p-8 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-black text-[#111418] mb-4 tracking-tight">{job?.title || ''}</h1>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[#617589] font-semibold">
                    <span className="flex items-center gap-2"><span className="material-symbols-outlined text-xl">business</span> {job?.company_name || ''}</span>
                    <span className="flex items-center gap-2"><span className="material-symbols-outlined text-xl">location_on</span> {job?.location || ''}</span>
                    <span className="flex items-center gap-2" suppressHydrationWarning><span className="material-symbols-outlined text-xl">schedule</span> {job ? new Date(job.created_at).toISOString().slice(0,10) : ''}</span>
                  </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#f1f5f9] text-[#111418] rounded-xl text-sm font-bold hover:bg-[#e2e8f0] transition-colors">
                    <span className="material-symbols-outlined">bookmark</span> Save
                  </button>
                  <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#f1f5f9] text-[#111418] rounded-xl text-sm font-bold hover:bg-[#e2e8f0] transition-colors">
                    <span className="material-symbols-outlined">share</span> Share
                  </button>
                </div>
              </div>

              {/* Content Sections */}
              <div className="mt-12 space-y-10">
                <section>
                  <h3 className="text-2xl font-bold text-[#111418] mb-4">About the Role</h3>
                  {job?.description_html ? (
                    <div className="prose max-w-none text-[#475569]" dangerouslySetInnerHTML={{ __html: job.description_html }} />
                  ) : (
                    <p className="text-[#475569] leading-relaxed text-lg">No description provided.</p>
                  )}
                </section>

                <section>
                  <h3 className="text-xl font-bold text-[#111418] mb-5">Key Requirements</h3>
                  <ul className="space-y-4">
                    {(job?.requirements && job.requirements.length ? job.requirements : ['—']).map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-[#475569] font-medium">
                        <span className="material-symbols-outlined text-[#137fec]">check_circle</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-[#111418] mb-6">Benefits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(job?.benefits && job.benefits.length ? job.benefits : ['—']).map((label, i) => (
                      <div key={i} className="bg-[#f8fafc] p-4 rounded-xl flex items-center gap-4 border border-[#f1f5f9]">
                        <span className="material-symbols-outlined text-[#137fec]">card_membership</span>
                        <span className="text-sm font-bold text-[#475569]">{label}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* Right Column: Application Sidebar */}
          {canApply && (
            <aside className="w-full lg:w-[30%]">
              <div className="sticky top-24 bg-white border border-[#f0f2f4] rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-black text-[#111418] mb-6">Apply for this position</h3>
                <div className="space-y-4">
                  <button
                    disabled={!canApply || isApplied || applyLoading}
                    onClick={async () => {
                      if (!id) return;
                      setApplyLoading(true);
                      setApplyMsg(null);
                      try {
                        await apiClient('/api/applications', { method: 'POST', body: JSON.stringify({ job_id: Number(id) }) });
                        setIsApplied(true);
                        setApplyMsg('Application submitted.');
                      } catch (e: unknown) {
                        const msg = e instanceof Error ? e.message : 'Failed to submit application';
                        setApplyMsg(msg);
                      } finally {
                        setApplyLoading(false);
                      }
                  }}
                    className={`w-full ${isApplied ? 'bg-green-600' : 'bg-[#137fec] hover:bg-[#137fec]/90'} text-white font-black py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60`}
                  >
                    {isApplied ? 'Applied' : applyLoading ? 'Submitting...' : 'Submit Application'}
                    <span className="material-symbols-outlined text-lg">{isApplied ? 'check' : 'arrow_forward'}</span>
                  </button>
                  {applyMsg && <p className={`text-xs ${isApplied ? 'text-green-700' : 'text-red-600'}`}>{applyMsg}</p>}
                </div>
                {loading && <p className="text-xs text-[#617589] mt-4">Loading job...</p>}
                {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
              </div>
            </aside>
          )}
        </div>
      </SectionContainer>
    </div>
  );
}
