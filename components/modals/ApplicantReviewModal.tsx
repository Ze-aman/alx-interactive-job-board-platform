import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';

interface Experience { title: string; company: string; start_date: string; end_date?: string | null; description?: string }
interface CandidateProfile { full_name?: string; title?: string; location?: string; bio?: string; phone?: string; email?: string; experiences?: Experience[]; profile_picture_url?: string }
export const ApplicantReviewModal = ({ isOpen, onClose, candidateId }: { isOpen: boolean; onClose: () => void; candidateId?: number }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!isOpen || !candidateId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await apiClient(`/api/employer/candidates/${candidateId}`);
        setProfile(data);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Failed to load candidate profile';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isOpen, candidateId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
        <button onClick={onClose} className="absolute top-4 right-4 z-50 bg-black/10 hover:bg-black/20 text-white rounded-full p-1.5">
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
        <div className="overflow-y-auto flex-1">
          <div className="p-8">
            <h2 className="text-2xl font-black text-[#111418] mb-6">Candidate Profile</h2>
            {loading && <p className="text-sm text-[#617589]">Loading...</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}
            {profile && (
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="size-16 rounded-full bg-slate-200 border border-slate-100 bg-cover bg-center" style={{ backgroundImage: `url('${profile.profile_picture_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + candidateId}')` }} />
                  <div className="flex-1">
                    <p className="text-xl font-bold text-[#111418]">{profile.full_name || 'Candidate'}</p>
                    <p className="text-sm font-semibold text-[#617589]">{profile.title || '—'}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-[#617589]">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">mail</span>{profile.email || '—'}</span>
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">call</span>{profile.phone || '—'}</span>
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">location_on</span>{profile.location || '—'}</span>
                    </div>
                  </div>
                </div>
                <section>
                  <h3 className="text-sm font-black text-[#111418] uppercase tracking-widest mb-2">About</h3>
                  <p className="text-[#617589] leading-relaxed">{profile.bio || '—'}</p>
                </section>
                <section>
                  <h3 className="text-sm font-black text-[#111418] uppercase tracking-widest mb-2">Experience</h3>
                  <div className="space-y-3">
                    {(profile.experiences || []).map((exp: Experience, i: number) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="font-bold text-[#111418]">{exp.title} — {exp.company}</p>
                        <p className="text-xs text-[#617589]">{exp.start_date} – {exp.end_date || 'Present'}</p>
                        <p className="text-sm text-[#475569] mt-2">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
                <div className="flex justify-end gap-2">
                  <button className="px-4 py-2 bg-white border border-[#dbe0e6] rounded-lg text-sm font-bold text-[#111418] hover:bg-slate-50">Email</button>
                  <button onClick={onClose} className="px-4 py-2 bg-[#137fec] text-white rounded-lg text-sm font-bold hover:bg-[#137fec]/90">Close</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};