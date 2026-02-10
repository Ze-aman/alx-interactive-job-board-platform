import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { apiClient } from '@/lib/apiClient';

export default function CandidateSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [full_name, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiClient('/api/profile/me');
        if (data.role === 'candidate') {
          const p = data.profile || {};
          setFullName(p.full_name || '');
          setTitle(p.title || '');
          setLocation(p.location || '');
          setPhone(p.phone || '');
          setBio(p.bio || '');
        }
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await apiClient('/api/profile/update', {
        method: 'POST',
        body: JSON.stringify({ full_name, title, location, phone, bio }),
        headers: { 'Content-Type': 'application/json' },
      });
      setMsg('Profile updated successfully.');
    } catch {
      setMsg('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-6">
        <div>
          <h2 className="text-3xl font-black text-[#111418]">Edit Profile</h2>
          <p className="text-[#617589]">Update your public profile information.</p>
        </div>

        <form onSubmit={onSave} className="bg-white rounded-2xl border border-[#dbe0e6] shadow-sm p-6 space-y-6">
          {loading ? (
            <p className="text-[#617589]">Loading...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#111418] uppercase">Full Name</label>
                  <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" value={full_name} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#111418] uppercase">Title</label>
                  <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#111418] uppercase">Location</label>
                  <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#111418] uppercase">Phone</label>
                  <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#111418] uppercase">Professional Summary</label>
                <textarea rows={5} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <a href="/dashboard/experiences" className="px-4 py-2.5 text-sm font-bold text-[#137fec] hover:underline">Manage Experiences</a>
                <div className="flex gap-3">
                  <button type="button" className="px-6 py-2.5 text-sm font-bold text-[#617589] hover:bg-slate-100 rounded-xl">Cancel</button>
                  <button disabled={saving} className="px-8 py-2.5 bg-[#137fec] text-white text-sm font-bold rounded-xl">{saving ? 'Saving...' : 'Save Changes'}</button>
                </div>
              </div>
              {msg && <p className="text-sm font-bold">{msg}</p>}
            </>
          )}
        </form>
      </div>
    </DashboardLayout>
  );
}