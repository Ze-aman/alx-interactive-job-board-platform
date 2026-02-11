import React, { useEffect, useMemo, useState } from 'react';
import { EmployerLayout } from '@/components/layout/EmployerLayout';
import { useRequireAuth } from '@/lib/requireAuth';
import { apiClient } from '@/lib/apiClient';
import { useRouter } from 'next/router';
import { ApplicantReviewModal } from '@/components/modals/ApplicantReviewModal';

type Applicant = {
  id: number;
  name: string;
  email: string;
  stage: 'Screening' | 'Interview' | 'Offer' | 'Hired';
  status: string;
  candidate_id?: number;
};

function Column({ title, grouped, onReview, onUpdateStage }: {
  title: 'Screening' | 'Interview' | 'Offer' | 'Hired';
  grouped: Record<string, Applicant[]>;
  onReview: (candidateId?: number) => void;
  onUpdateStage: (appId: number, stage: 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected') => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#dbe0e6] p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[#111418]">{title}</h3>
        <span className="text-xs font-bold text-[#617589]">{(grouped[title] || []).length} candidates</span>
      </div>
      <div className="space-y-3">
        {(grouped[title] || []).map(a => (
          <div key={a.id} className="p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-cover bg-center border border-slate-100" style={{ backgroundImage: `url('https://api.dicebear.com/7.x/avataaars/svg?seed=${a.candidate_id || a.id}')` }} />
              <div className="flex-1 overflow-hidden">
                <p className="font-bold text-sm text-[#111418] truncate">{a.name}</p>
                <p className="text-[11px] text-[#617589] truncate">{a.email}</p>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <button onClick={() => onReview(a.candidate_id)} className="px-3 py-1.5 text-xs font-bold bg-white border border-[#dbe0e6] rounded-lg text-[#111418] hover:bg-slate-50">Review</button>
              {title !== 'Screening' && <button onClick={() => onUpdateStage(a.id, 'Screening')} className="px-3 py-1.5 text-xs font-bold bg-white border border-[#dbe0e6] rounded-lg hover:bg-slate-50">Back to Screening</button>}
              {title !== 'Interview' && <button onClick={() => onUpdateStage(a.id, 'Interview')} className="px-3 py-1.5 text-xs font-bold bg-white border border-[#dbe0e6] rounded-lg hover:bg-slate-50">Move to Interview</button>}
              {title !== 'Offer' && <button onClick={() => onUpdateStage(a.id, 'Offer')} className="px-3 py-1.5 text-xs font-bold bg-white border border-[#dbe0e6] rounded-lg hover:bg-slate-50">Move to Offer</button>}
              {title !== 'Hired' && <button onClick={() => onUpdateStage(a.id, 'Hired')} className="px-3 py-1.5 text-xs font-bold bg-green-600 text-white rounded-lg hover:bg-green-700">Hire</button>}
              <button onClick={() => onUpdateStage(a.id, 'Rejected')} className="px-3 py-1.5 text-xs font-bold bg-red-50 text-red-600 rounded-lg hover:bg-red-100">Reject</button>
            </div>
          </div>
        ))}
        {(grouped[title] || []).length === 0 && (
          <p className="text-sm text-[#617589]">No candidates</p>
        )}
      </div>
    </div>
  );
}

export default function PipelineOverview() {
  useRequireAuth('employer');
  const router = useRouter();
  const { jobId } = router.query as { jobId?: string };
  interface JobInfo { id: number; title: string }
  const [job, setJob] = useState<JobInfo | null>(null);
  const [apps, setApps] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(false);
  const [reviewCandidateId, setReviewCandidateId] = useState<number | undefined>();

  useEffect(() => {
    if (!jobId) return;
    const loadJob = async () => {
      try { setJob(await apiClient(`/api/jobs/${jobId}`)); } catch {}
    };
    loadJob();
  }, [jobId]);

  useEffect(() => {
    if (!jobId) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await apiClient(`/api/employer/applicants?job_id=${jobId}`);
        setApps(res.data || []);
      } catch {}
      setLoading(false);
    };
    load();
  }, [jobId]);

  const grouped = useMemo(() => {
    const g: Record<string, Applicant[]> = { Screening: [], Interview: [], Offer: [], Hired: [] };
    apps.forEach(a => { if (g[a.stage]) g[a.stage].push(a); else g.Screening.push(a); });
    return g;
  }, [apps]);

  const updateStage = async (appId: number, stage: 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected') => {
    const status = stage === 'Screening' ? 'screening' : stage === 'Interview' ? 'interview' : stage === 'Offer' ? 'offer' : stage === 'Hired' ? 'hired' : 'rejected';
    try {
      await apiClient(`/api/applications/${appId}`, { method: 'PATCH', body: JSON.stringify({ status }) });
      await loadApps();
    } catch {}
  };


  return (
    <EmployerLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-[#617589] mb-1">
            <button className="hover:underline" onClick={() => router.push('/employer')}>Jobs</button>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-[#111418] font-medium">{job?.title || '—'}</span>
          </div>
          <h1 className="text-2xl font-black text-[#111418] tracking-tight">Pipeline Overview</h1>
        </div>
      </div>
      {loading ? (
        <p className="text-sm text-[#617589]">Loading candidates...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Column title="Screening" grouped={grouped} onReview={(id) => setReviewCandidateId(id)} onUpdateStage={updateStage} />
          <Column title="Interview" grouped={grouped} onReview={(id) => setReviewCandidateId(id)} onUpdateStage={updateStage} />
          <Column title="Offer" grouped={grouped} onReview={(id) => setReviewCandidateId(id)} onUpdateStage={updateStage} />
          <Column title="Hired" grouped={grouped} onReview={(id) => setReviewCandidateId(id)} onUpdateStage={updateStage} />
        </div>
      )}
      <ApplicantReviewModal isOpen={!!reviewCandidateId} onClose={() => setReviewCandidateId(undefined)} candidateId={reviewCandidateId} />
    </EmployerLayout>
  );
}