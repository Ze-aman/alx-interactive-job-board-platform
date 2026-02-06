import React, { useState } from 'react';

const UserManagement = () => {
  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative space-y-6">
      {/* Page Heading */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-[#111418] text-3xl font-black tracking-tight">User Management</h1>
          <p className="text-[#617589] text-sm">Manage, verify, and monitor platform users.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center rounded-lg h-11 px-6 bg-[#137fec] text-white text-sm font-bold hover:bg-[#137fec]/90 transition-all shadow-md active:scale-95"
        >
          <span className="material-symbols-outlined mr-2 text-xl">person_add</span>
          Add New User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-[#f0f2f4] p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#617589]">search</span>
            <input 
              className="w-full bg-[#f0f2f4] border-none rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-[#137fec]/20 outline-none" 
              placeholder="Search by name or email..." 
            />
          </div>
          <div className="flex gap-2">
            <FilterButton label="Role: All" />
            <FilterButton label="Status: All" />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-[#f0f2f4] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#f6f7f8] border-b border-[#f0f2f4]">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-[#617589] uppercase">User</th>
              <th className="px-6 py-4 text-xs font-bold text-[#617589] uppercase">Account Type</th>
              <th className="px-6 py-4 text-xs font-bold text-[#617589] uppercase">Registered</th>
              <th className="px-6 py-4 text-xs font-bold text-[#617589] uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-[#617589] uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f2f4]">
            <UserRow name="Sarah Chen" email="sarah.c@tech.com" role="Candidate" status="Active" />
            <UserRow name="Marcus Rodriguez" email="m.rod@solutions.io" role="Employer" status="Active" />
            <UserRow name="Elena Vance" email="elena.v@freemail.com" role="Candidate" status="Suspended" />
          </tbody>
        </table>
      </div>

      {/* --- ADD NEW USER MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop Blur/Overlay */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#111418]">Add New User</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="size-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form className="p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#111418]">Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. John Doe"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#137fec]/20 focus:border-[#137fec] outline-none" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#111418]">Email Address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#137fec]/20 focus:border-[#137fec] outline-none" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#111418]">Account Type</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#137fec]/20 focus:border-[#137fec] outline-none">
                  <option>Candidate</option>
                  <option>Employer</option>
                  <option>Admin</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-lg text-sm hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#137fec] text-white font-bold rounded-lg text-sm hover:bg-[#137fec]/90 shadow-md shadow-[#137fec]/20 transition-all"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Sub-components (UserRow & FilterButton) ---

const UserRow = ({ name, email, role, status }: any) => (
  <tr className="hover:bg-[#f6f7f8]/50 transition-colors">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-full bg-[#137fec]/10 flex items-center justify-center text-[#137fec] font-bold">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-bold text-[#111418]">{name}</p>
          <p className="text-xs text-[#617589]">{email}</p>
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${role === 'Employer' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
        {role}
      </span>
    </td>
    <td className="px-6 py-4 text-sm text-[#617589]">Oct 24, 2023</td>
    <td className="px-6 py-4">
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
        <span className={`size-1.5 rounded-full ${status === 'Active' ? 'bg-green-600' : 'bg-red-600'}`}></span>
        {status}
      </span>
    </td>
    <td className="px-6 py-4 text-right">
      <button className="text-[#137fec] font-bold text-sm hover:underline">Manage</button>
    </td>
  </tr>
);

const FilterButton = ({ label }: any) => (
  <button className="flex items-center gap-2 px-4 py-2 bg-[#f0f2f4] rounded-lg text-sm font-medium hover:bg-gray-200 transition-all">
    {label} <span className="material-symbols-outlined text-sm">expand_more</span>
  </button>
);

export default UserManagement;