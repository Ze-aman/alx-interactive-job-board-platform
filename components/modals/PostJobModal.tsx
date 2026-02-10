import React, { useRef, useState, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';
import { TiptapEditor } from '../TiptapEditor';

interface Job {
  id: number;
  title: string;
  dept: string;
  type: string;
  stage: string;
  progress: number;
  applicants: number;
  news: number;
  color: string;
  description_html?: string;
  requirements?: string[];
  benefits?: string[];
}

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
  jobToEdit?: Job;
}

export const PostJobModal = ({ isOpen, onClose, onCreated, jobToEdit }: PostJobModalProps & { onCreated?: () => void; jobToEdit?: Job }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState('job-info');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Design');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [benefits, setBenefits] = useState<string[]>(['']);
  const [errorMsg, setErrorMsg] = useState('');

  // Populate form fields when editing
  useEffect(() => {
    if (jobToEdit && isOpen) {
      setTitle(jobToEdit.title);
      setDepartment(jobToEdit.dept);
      setLocation(''); // Location is not available in the dashboard data, will need to be fetched
      setEmploymentType(jobToEdit.type);
      setDescription(jobToEdit.description_html || '');
      setRequirements(jobToEdit.requirements?.length ? jobToEdit.requirements : ['']);
      setBenefits(jobToEdit.benefits?.length ? jobToEdit.benefits : ['']);
    } else if (!jobToEdit && isOpen) {
      // Reset form when creating new job
      setTitle('');
      setDepartment('Design');
      setLocation('');
      setEmploymentType('Full-time');
      setDescription('');
      setRequirements(['']);
      setBenefits(['']);
    }
  }, [jobToEdit, isOpen]);

  // 1. Precise Scrolling Logic
  const scrollToSection = (id: string) => {
    const container = scrollContainerRef.current;
    const element = document.getElementById(id);
    
    if (container && element) {
      // Calculate position relative to the scrollable container
      const topPos = element.offsetTop - container.offsetTop;
      container.scrollTo({
        top: topPos - 20, // 20px buffer for aesthetics
        behavior: 'smooth',
      });
    }
  };

  // 2. Active State Logic (Intersection Observer)
  useEffect(() => {
    if (!isOpen) return;

    const observerOptions = {
      root: scrollContainerRef.current,
      rootMargin: '0px',
      threshold: 0.6, // Trigger when 60% of the section is visible
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = ['job-info', 'job-details', 'job-requirements', 'job-benefits', 'job-review'];
    
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0 bg-white">
          <div>
            <h2 className="text-xl font-bold text-[#111418] tracking-tight">{jobToEdit ? 'Edit Job' : 'Post a New Job'}</h2>
            <p className="text-xs text-[#617589] mt-0.5 font-medium">{jobToEdit ? 'Update your job listing' : 'Create a new listing to attract top talent'}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-[#111418] transition-colors">
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden bg-white">
          {/* Internal Sidebar */}
          <aside className="w-64 border-r border-slate-100 p-6 flex flex-col gap-1 flex-shrink-0 bg-slate-50/50">
            <nav className="space-y-1 sticky top-0">
              <SidebarItem 
                icon="info" 
                label="Job Info" 
                active={activeSection === 'job-info'} 
                onClick={() => scrollToSection('job-info')} 
              />
              <SidebarItem 
                icon="description" 
                label="Job Details" 
                active={activeSection === 'job-details'} 
                onClick={() => scrollToSection('job-details')} 
              />
              <SidebarItem 
                icon="list_alt" 
                label="Requirements" 
                active={activeSection === 'job-requirements'} 
                onClick={() => scrollToSection('job-requirements')} 
              />
              <SidebarItem 
                icon="card_membership" 
                label="Benefits" 
                active={activeSection === 'job-benefits'} 
                onClick={() => scrollToSection('job-benefits')} 
              />
              <SidebarItem 
                icon="verified" 
                label="Review" 
                active={activeSection === 'job-review'} 
                onClick={() => scrollToSection('job-review')} 
              />
            </nav>
          </aside>

          {/* Main Form Area */}
          <main 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto p-10 space-y-12 bg-white custom-scrollbar relative"
          >
            {/* Section 1: Job Info */}
            <section className="space-y-6 pt-2" id="job-info">
              <div className="flex items-center gap-2 mb-2">
                <span className="size-2 bg-[#137fec] rounded-full"></span>
                <h3 className="text-lg font-bold text-[#111418]">Basic Job Info</h3>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-[#111418] mb-2">Job Title</label>
                  <input className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-[#137fec]/20 outline-none" placeholder="e.g. Senior Product Designer" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111418] mb-2">Category</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none" value={department} onChange={(e) => setDepartment(e.target.value)}>
                    <option value="Design">Design</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111418] mb-2">Location</label>
                  <input className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none" placeholder="City, Country or Remote" type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#111418] mb-3">Work Type</label>
                <div className="grid grid-cols-3 gap-3">
                  <WorkTypeOption id="full-time" label="Full-time" name="type" defaultChecked onSelect={() => setEmploymentType('Full-time')} />
                  <WorkTypeOption id="contract" label="Contract" name="type" onSelect={() => setEmploymentType('Contract')} />
                  <WorkTypeOption id="freelance" label="Freelance" name="type" onSelect={() => setEmploymentType('Freelance')} />
                </div>
              </div>
            </section>

            <hr className="border-slate-100"/>

            {/* Section 2: Job Description */}
            <section className="space-y-6 pt-2" id="job-details">
              <div className="flex items-center gap-2 mb-2">
                <span className="size-2 bg-[#137fec] rounded-full"></span>
                <h3 className="text-lg font-bold text-[#111418]">Job Description</h3>
              </div>
              <TiptapEditor value={description} onChange={setDescription} />
            </section>

            <hr className="border-slate-100"/>

            {/* Section 3: Requirements */}
            <section className="space-y-6 pt-2" id="job-requirements">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 bg-[#137fec] rounded-full"></span>
                  <h3 className="text-lg font-bold text-[#111418]">Key Requirements</h3>
                </div>
                <button className="text-[#137fec] text-sm font-bold flex items-center gap-1 hover:underline" onClick={() => setRequirements((prev) => [...prev, ''])}>
                  <span className="material-symbols-outlined text-base">add_circle</span> Add More
                </button>
              </div>
              <div className="space-y-3">
                {requirements.map((req, idx) => (
                  <RequirementInput key={idx} value={req} placeholder="e.g. Strong communication skills" onChange={(v: string) => {
                    setRequirements((prev) => prev.map((p, i) => (i === idx ? v : p)));
                  }} onDelete={() => {
                    setRequirements((prev) => prev.filter((_, i) => i !== idx));
                  }} />
                ))}
              </div>
            </section>

            <hr className="border-slate-100"/>

            {/* Section 3b: Benefits */}
            <section className="space-y-6 pt-2" id="job-benefits">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 bg-[#137fec] rounded-full"></span>
                  <h3 className="text-lg font-bold text-[#111418]">Benefits</h3>
                </div>
                <button className="text-[#137fec] text-sm font-bold flex items-center gap-1 hover:underline" onClick={() => setBenefits((prev) => [...prev, ''])}>
                  <span className="material-symbols-outlined text-base">add_circle</span> Add More
                </button>
              </div>
              <div className="space-y-3">
                {benefits.map((ben, idx) => (
                  <RequirementInput key={idx} value={ben} placeholder="e.g. Unlimited PTO" onChange={(v: string) => {
                    setBenefits((prev) => prev.map((p, i) => (i === idx ? v : p)));
                  }} onDelete={() => {
                    setBenefits((prev) => prev.filter((_, i) => i !== idx));
                  }} />
                ))}
              </div>
            </section>

            {/* Section 4: Review Summary */}
            <section className="space-y-6 pb-8 pt-2" id="job-review">
              <div className="flex items-center gap-2 mb-2">
                <span className="size-2 bg-[#137fec] rounded-full"></span>
                <h3 className="text-lg font-bold text-[#111418]">Review Summary</h3>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                  <SummaryItem label="Title" value={title || ''} />
                  <SummaryItem label="Location" value={location || ''} />
                  <SummaryItem label="Category" value={department || ''} />
                  <SummaryItem label="Type" value={employmentType || ''} />
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#137fec]/5 rounded-xl border border-[#137fec]/10">
                <span className="material-symbols-outlined text-[#137fec]">visibility</span>
                <p className="text-xs text-[#137fec] font-medium">Visible to candidates upon publishing.</p>
              </div>
            </section>
          </main>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white flex items-center justify-between flex-shrink-0">
          <button onClick={onClose} className="px-6 py-3 text-sm font-bold text-[#617589] hover:text-[#111418]">
            Discard
          </button>
          <div className="flex gap-3">
            <button disabled={submitting} onClick={async () => {
              if (!title || !department || !employmentType) return;
              setSubmitting(true);
              setErrorMsg('');
              try {
                const endpoint = jobToEdit ? `/api/employer/jobs/${jobToEdit.id}` : '/api/employer/jobs';
                const method = jobToEdit ? 'PUT' : 'POST';
                await apiClient(endpoint, { method, body: JSON.stringify({ title, department, location, employment_type: employmentType, status: 'draft', description_html: description, requirements: requirements.filter(r => r.trim()), benefits: benefits.filter(b => b.trim()) }) });
                onClose();
                onCreated && onCreated();
              } catch (e: any) {
                setErrorMsg(e?.message || 'Failed to save draft');
              } finally {
                setSubmitting(false);
              }
            }} className="px-6 py-3 text-sm font-bold text-[#111418] border border-slate-200 rounded-xl hover:bg-slate-50">
              Draft
            </button>
            <button disabled={submitting} onClick={async () => {
              if (!title || !department || !employmentType) return;
              setSubmitting(true);
              setErrorMsg('');
              try {
                const endpoint = jobToEdit ? `/api/employer/jobs/${jobToEdit.id}` : '/api/employer/jobs';
                const method = jobToEdit ? 'PUT' : 'POST';
                await apiClient(endpoint, { method, body: JSON.stringify({ title, department, location, employment_type: employmentType, status: 'published', description_html: description, requirements: requirements.filter(r => r.trim()), benefits: benefits.filter(b => b.trim()) }) });
                onClose();
                onCreated && onCreated();
              } catch (e: any) {
                setErrorMsg(e?.message || 'Failed to publish job');
              } finally {
                setSubmitting(false);
              }
            }} className="bg-[#137fec] text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-[#137fec]/20">
              Publish
            </button>
            {errorMsg && (
              <span className="ml-3 text-xs font-bold text-red-600">{errorMsg}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const SidebarItem = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg transition-all text-left ${
      active 
        ? 'text-[#137fec] border-l-4 border-[#137fec] bg-[#137fec]/5' 
        : 'text-[#617589] hover:text-[#111418] hover:bg-slate-100 border-l-4 border-transparent'
    }`}
  >
    <span className="material-symbols-outlined text-lg">{icon}</span>
    {label}
  </button>
);

const WorkTypeOption = ({ id, label, name, defaultChecked, onSelect }: any) => (
  <div className="relative">
    <input defaultChecked={defaultChecked} className="peer hidden" id={id} name={name} type="radio" onChange={onSelect} />
    <label className="flex items-center justify-center py-3 px-4 border border-slate-200 rounded-xl text-sm font-semibold text-[#617589] cursor-pointer peer-checked:border-[#137fec] peer-checked:bg-[#137fec]/5 peer-checked:text-[#137fec] transition-all text-center" htmlFor={id}>
      {label}
    </label>
  </div>
);

const RequirementInput = ({ value, placeholder, onChange, onDelete }: any) => (
  <div className="flex gap-2">
    <input className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none text-[#111418]" type="text" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    <button className="p-3 text-slate-400 hover:text-red-500 transition-colors" onClick={onDelete}>
      <span className="material-symbols-outlined">delete</span>
    </button>
  </div>
);

const SummaryItem = ({ label, value }: any) => (
  <div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-sm font-semibold text-[#111418]">{value}</p>
  </div>
);