import React, { useState } from 'react';

const CompaniesContent = () => {
  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      {/* Page Heading */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-[#111418] text-3xl font-black tracking-tight">Company Partners</h1>
          <p className="text-[#617589] mt-1">Manage corporate profiles and their job posting permissions.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center rounded-lg h-11 px-6 bg-[#137fec] text-white text-sm font-bold hover:bg-[#137fec]/90 transition-all shadow-md active:scale-95"
        >
          <span className="material-symbols-outlined mr-2 text-xl">domain_add</span>
          Add Company
        </button>
      </div>

      {/* Stats Mini-Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatMiniCard icon="corporate_fare" label="Total Partners" value="128" color="blue" />
        <StatMiniCard icon="verified" label="Verified" value="112" color="green" />
        <StatMiniCard icon="pending" label="Pending Review" value="16" color="yellow" />
      </div>

      {/* Search and Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#f0f2f4] overflow-hidden">
        <div className="p-4 border-b border-[#f0f2f4]">
          <div className="relative max-w-sm">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#617589]">search</span>
            <input 
              className="w-full bg-[#f0f2f4] border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#137fec]/20 outline-none" 
              placeholder="Search companies..." 
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f6f7f8] text-[#617589] text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Industry</th>
                <th className="px-6 py-4">Active Jobs</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f2f4]">
              <CompanyRow name="TechCorp" industry="Software" jobs={12} status="Verified" logo="TC" />
              <CompanyRow name="GreenEnergy" industry="Renewables" jobs={4} status="Pending" logo="GE" />
              <CompanyRow name="ModernDesign" industry="Agency" jobs={8} status="Verified" logo="MD" />
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD COMPANY MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal Card */}
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-blue-50 text-[#137fec] rounded-lg flex items-center justify-center">
                   <span className="material-symbols-outlined">business</span>
                </div>
                <h3 className="text-xl font-bold text-[#111418]">Register New Company</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="size-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form className="p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#111418]">Company Name</label>
                  <input type="text" placeholder="e.g. Acme Inc" className="modal-input" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#111418]">Industry</label>
                  <select className="modal-input">
                    <option>Software & Tech</option>
                    <option>Healthcare</option>
                    <option>Finance</option>
                    <option>Education</option>
                    <option>Manufacturing</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#111418]">Company Website</label>
                <input type="url" placeholder="https://acme.com" className="modal-input" />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#111418]">Contact Email</label>
                <input type="email" placeholder="hr@acme.com" className="modal-input" />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-lg text-sm hover:bg-slate-50 transition-colors"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#137fec] text-white font-bold rounded-lg text-sm hover:bg-[#137fec]/90 shadow-md shadow-[#137fec]/20 transition-all"
                >
                  Verify & Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Sub-components ---

const CompanyRow = ({ name, industry, jobs, status, logo }: any) => (
  <tr className="hover:bg-[#f6f7f8]/50 transition-colors">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-500 border border-slate-200 uppercase">
          {logo}
        </div>
        <span className="text-sm font-bold text-[#111418]">{name}</span>
      </div>
    </td>
    <td className="px-6 py-4 text-sm text-[#617589]">{industry}</td>
    <td className="px-6 py-4 text-sm font-semibold text-[#111418]">{jobs}</td>
    <td className="px-6 py-4">
      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
        status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
      }`}>
        {status}
      </span>
    </td>
    <td className="px-6 py-4 text-right">
      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#137fec]">
        <span className="material-symbols-outlined">edit</span>
      </button>
    </td>
  </tr>
);

const StatMiniCard = ({ icon, label, value, color }: any) => {
  const colors: any = {
    blue: "bg-blue-50 text-[#137fec]",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600"
  };
  return (
    <div className="bg-white p-4 rounded-xl border border-[#dbe0e6] flex items-center gap-4">
      <div className={`size-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="text-xs text-[#617589] font-medium uppercase">{label}</p>
        <p className="text-xl font-bold text-[#111418]">{value}</p>
      </div>
    </div>
  );
};

export default CompaniesContent;