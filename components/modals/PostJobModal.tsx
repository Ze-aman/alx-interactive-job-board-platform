import React, { useRef, useState, useEffect } from 'react';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostJobModal = ({ isOpen, onClose }: PostJobModalProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState('job-info');

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
    const sections = ['job-info', 'job-details', 'job-requirements', 'job-review'];
    
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
            <h2 className="text-xl font-bold text-[#111418] tracking-tight">Post a New Job</h2>
            <p className="text-xs text-[#617589] mt-0.5 font-medium">Create a new listing to attract top talent</p>
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
                  <input className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-[#137fec]/20 outline-none" placeholder="e.g. Senior Product Designer" type="text"/>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111418] mb-2">Category</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none">
                    <option>Design</option>
                    <option>Engineering</option>
                    <option>Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111418] mb-2">Location</label>
                  <input className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none" placeholder="City, Country or Remote" type="text"/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#111418] mb-3">Work Type</label>
                <div className="grid grid-cols-3 gap-3">
                  <WorkTypeOption id="full-time" label="Full-time" name="type" defaultChecked />
                  <WorkTypeOption id="contract" label="Contract" name="type" />
                  <WorkTypeOption id="freelance" label="Freelance" name="type" />
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
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center gap-4 text-slate-500">
                  <span className="material-symbols-outlined text-xl cursor-pointer hover:text-[#137fec]">format_bold</span>
                  <span className="material-symbols-outlined text-xl cursor-pointer hover:text-[#137fec]">format_italic</span>
                  <span className="material-symbols-outlined text-xl cursor-pointer hover:text-[#137fec]">format_list_bulleted</span>
                  <div className="h-4 w-px bg-slate-300"></div>
                  <span className="material-symbols-outlined text-xl cursor-pointer hover:text-[#137fec]">undo</span>
                </div>
                <textarea className="w-full p-4 bg-white border-none text-sm min-h-[200px] focus:ring-0 outline-none text-[#111418]" placeholder="Describe the role, responsibilities, and team..."></textarea>
              </div>
            </section>

            <hr className="border-slate-100"/>

            {/* Section 3: Requirements */}
            <section className="space-y-6 pt-2" id="job-requirements">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 bg-[#137fec] rounded-full"></span>
                  <h3 className="text-lg font-bold text-[#111418]">Key Requirements</h3>
                </div>
                <button className="text-[#137fec] text-sm font-bold flex items-center gap-1 hover:underline">
                  <span className="material-symbols-outlined text-base">add_circle</span> Add More
                </button>
              </div>
              <div className="space-y-3">
                <RequirementInput value="5+ years of experience in product design" />
                <RequirementInput value="Proficiency in Figma and interactive prototyping" />
                <RequirementInput placeholder="e.g. Strong communication skills" />
              </div>
            </section>

            <hr className="border-slate-100"/>

            {/* Section 4: Review Summary */}
            <section className="space-y-6 pb-8 pt-2" id="job-review">
              <div className="flex items-center gap-2 mb-2">
                <span className="size-2 bg-[#137fec] rounded-full"></span>
                <h3 className="text-lg font-bold text-[#111418]">Review Summary</h3>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                  <SummaryItem label="Title" value="Senior Product Designer" />
                  <SummaryItem label="Location" value="New York (Hybrid)" />
                  <SummaryItem label="Category" value="Design" />
                  <SummaryItem label="Type" value="Full-time" />
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
            <button className="px-6 py-3 text-sm font-bold text-[#111418] border border-slate-200 rounded-xl hover:bg-slate-50">
              Draft
            </button>
            <button className="bg-[#137fec] text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-[#137fec]/20">
              Publish
            </button>
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

const WorkTypeOption = ({ id, label, name, defaultChecked }: any) => (
  <div className="relative">
    <input defaultChecked={defaultChecked} className="peer hidden" id={id} name={name} type="radio" />
    <label className="flex items-center justify-center py-3 px-4 border border-slate-200 rounded-xl text-sm font-semibold text-[#617589] cursor-pointer peer-checked:border-[#137fec] peer-checked:bg-[#137fec]/5 peer-checked:text-[#137fec] transition-all text-center" htmlFor={id}>
      {label}
    </label>
  </div>
);

const RequirementInput = ({ value, placeholder }: any) => (
  <div className="flex gap-2">
    <input className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none text-[#111418]" type="text" defaultValue={value} placeholder={placeholder} />
    <button className="p-3 text-slate-400 hover:text-red-500 transition-colors">
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