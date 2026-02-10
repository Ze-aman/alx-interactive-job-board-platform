import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { apiClient } from '@/lib/apiClient';
import { format } from 'date-fns';

type Exp = { id: number; title: string; company: string; start_date?: string; end_date?: string; description?: string };

export default function ManageExperiences() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<Exp[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<Exp>>({ title: '', company: '', start_date: '', end_date: '', description: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiClient('/api/profile/experiences');
      setList(res.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const formatDateToLong = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      return format(new Date(dateStr), 'MMMM d, yyyy');
    } catch {
      return '';
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      if (editingId) {
        await apiClient(`/api/profile/experiences/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        setMsg('Experience updated.');
      } else {
        await apiClient('/api/profile/experiences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        setMsg('Experience added.');
      }
      setForm({ title: '', company: '', start_date: '', end_date: '', description: '' });
      setEditingId(null);
      await load();
    } catch {
      setMsg('Failed to save experience.');
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (exp: Exp) => {
    const formatDateForInput = (dateStr?: string) => dateStr ? new Date(dateStr).toISOString().split('T')[0] : '';
    setEditingId(exp.id);
    setForm({ title: exp.title, company: exp.company, start_date: formatDateForInput(exp.start_date), end_date: formatDateForInput(exp.end_date), description: exp.description || '' });
  };

  const onDelete = async (id: number) => {
    setMsg(null);
    try {
      await apiClient(`/api/profile/experiences/${id}`, { method: 'DELETE' });
      setMsg('Experience deleted.');
      await load();
    } catch {
      setMsg('Failed to delete experience.');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-[#111418]">Manage Experiences</h2>
            <p className="text-[#617589]">Add, update, and remove your work history.</p>
          </div>
          <a href="/settings" className="text-sm font-bold text-[#137fec] hover:underline">Back to Profile Settings</a>
        </div>

        <section className="bg-white rounded-2xl border border-[#dbe0e6] shadow-sm p-6">
          <h3 className="text-lg font-bold text-[#111418] mb-4">{editingId ? 'Edit Experience' : 'Add Experience'}</h3>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#111418] uppercase">Title</label>
                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div>
                <label className="text-xs font-bold text-[#111418] uppercase">Company</label>
                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" value={form.company || ''} onChange={e => setForm({ ...form, company: e.target.value })} required />
              </div>
              <div>
                <label className="text-xs font-bold text-[#111418] uppercase">Start Date</label>
                <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" value={form.start_date || ''} onChange={e => setForm({ ...form, start_date: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-bold text-[#111418] uppercase">End Date</label>
                <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" value={form.end_date || ''} onChange={e => setForm({ ...form, end_date: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-[#111418] uppercase">Description</label>
              <textarea rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="flex gap-3">
              {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ title: '', company: '', start_date: '', end_date: '', description: '' }); }} className="px-6 py-2.5 text-sm font-bold text-[#617589] hover:bg-slate-100 rounded-xl">Cancel</button>}
              <button disabled={saving} className="px-8 py-2.5 bg-[#137fec] text-white text-sm font-bold rounded-xl">{saving ? 'Saving...' : (editingId ? 'Save Changes' : 'Add Experience')}</button>
            </div>
            {msg && <p className="text-sm font-bold mt-2">{msg}</p>}
          </form>
        </section>

        <section className="bg-white rounded-2xl border border-[#dbe0e6] shadow-sm p-6">
          <h3 className="text-lg font-bold text-[#111418] mb-4">Your Experiences</h3>
          {loading ? (
            <p className="text-[#617589]">Loading...</p>
          ) : (
            <div className="space-y-4">
              {list.length === 0 ? (
                <p className="text-[#617589]">No experiences added yet.</p>
              ) : (
                list.map(exp => (
                  <div key={exp.id} className="p-4 border border-slate-200 rounded-xl flex items-start justify-between">
                    <div>
                      <p className="font-bold text-[#111418]">{exp.title} · {exp.company}</p>
                      <p className="text-sm text-[#617589]">{formatDateToLong(exp.start_date)}{exp.end_date ? ` - ${formatDateToLong(exp.end_date)}` : ' - Present'}</p>
                      {exp.description && <p className="text-sm text-[#111418] mt-2">{exp.description}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => onEdit(exp)} className="px-3 py-1.5 text-xs font-bold text-[#137fec] hover:bg-[#137fec]/10 rounded-lg">Edit</button>
                      <button onClick={() => onDelete(exp.id)} className="px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg">Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
