import React from 'react';
import { useRouter } from 'next/router';
import { SectionContainer } from '../../components/layout/SectionContainer';

export default function JobDetail() {
  const router = useRouter();
  const { id } = router.query;

  // In a real app, you would fetch job data based on the 'id'
  const job = {
    title: "Senior Frontend Developer",
    company: "TechNova Solutions",
    location: "San Francisco, CA (Remote)",
    postedAt: "Posted 2 days ago",
  };

  return (
    <div className="bg-[#f6f7f8] min-h-screen">
      <SectionContainer className="py-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-8 text-sm font-medium">
          <button onClick={() => router.push('/')} className="text-[#617589] hover:text-[#137fec]">Home</button>
          <span className="text-[#94a3b8]">/</span>
          <span className="text-[#617589]">Engineering</span>
          <span className="text-[#94a3b8]">/</span>
          <span className="text-[#111418]">{job.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Job Details */}
          <div className="w-full lg:w-[70%] space-y-8">
            
            {/* Main Header Card */}
            <div className="bg-white border border-[#f0f2f4] rounded-2xl p-8 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-black text-[#111418] mb-4 tracking-tight">{job.title}</h1>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[#617589] font-semibold">
                    <span className="flex items-center gap-2"><span className="material-symbols-outlined text-xl">business</span> {job.company}</span>
                    <span className="flex items-center gap-2"><span className="material-symbols-outlined text-xl">location_on</span> {job.location}</span>
                    <span className="flex items-center gap-2"><span className="material-symbols-outlined text-xl">schedule</span> {job.postedAt}</span>
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
                  <p className="text-[#475569] leading-relaxed text-lg">
                    We are looking for a highly skilled Senior Frontend Developer to join our core product team. At TechNova Solutions, we are building the next generation of collaborative tools for distributed engineering teams.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-[#111418] mb-5">What You'll Do</h3>
                  <ul className="space-y-4">
                    {[
                      "Lead the frontend architecture of our flagship dashboard using React and TypeScript.",
                      "Optimize complex data-heavy visualizations for 60fps performance.",
                      "Collaborate with product designers to implement pixel-perfect user interfaces."
                    ].map((item, i) => (
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
                    {[
                      { icon: "volunteer_activism", label: "Full Medical & Dental" },
                      { icon: "flight_takeoff", label: "Unlimited PTO" },
                      { icon: "laptop_mac", label: "Home Office Stipend" },
                      { icon: "savings", label: "401(k) Matching" }
                    ].map((benefit, i) => (
                      <div key={i} className="bg-[#f8fafc] p-4 rounded-xl flex items-center gap-4 border border-[#f1f5f9]">
                        <span className="material-symbols-outlined text-[#137fec]">{benefit.icon}</span>
                        <span className="text-sm font-bold text-[#475569]">{benefit.label}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* Right Column: Application Sidebar */}
          <aside className="w-full lg:w-[30%]">
            <div className="sticky top-24 bg-white border border-[#f0f2f4] rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-black text-[#111418] mb-6">Apply for this position</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#94a3b8] mb-2">Full Name</label>
                  <input className="w-full rounded-xl border-[#f0f2f4] bg-[#f8fafc] focus:ring-[#137fec] focus:border-[#137fec] text-sm p-3" placeholder="Jane Doe" type="text" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#94a3b8] mb-2">Email Address</label>
                  <input className="w-full rounded-xl border-[#f0f2f4] bg-[#f8fafc] focus:ring-[#137fec] focus:border-[#137fec] text-sm p-3" placeholder="jane@example.com" type="email" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#94a3b8] mb-2">Resume / CV</label>
                  <div className="border-2 border-dashed border-[#cbd5e1] rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-[#137fec] transition-colors cursor-pointer group">
                    <span className="material-symbols-outlined text-3xl text-[#94a3b8] group-hover:text-[#137fec] mb-2">cloud_upload</span>
                    <p className="text-xs font-bold text-[#111418]">Upload your CV</p>
                  </div>
                </div>
                <button className="w-full bg-[#137fec] hover:bg-[#137fec]/90 text-white font-black py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-4" type="submit">
                  Submit Application <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              </form>
            </div>
          </aside>
        </div>
      </SectionContainer>
    </div>
  );
}