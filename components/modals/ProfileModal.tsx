import React from 'react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal = ({ isOpen, onClose }: ProfileModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-black/20 hover:bg-black/40 text-white rounded-full p-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="overflow-y-auto flex-1 pb-8">
          {/* Header/Banner */}
          <div className="relative h-48 w-full bg-gradient-to-r from-[#137fec] to-blue-400">
            <div className="absolute -bottom-16 left-8">
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-32 border-4 border-white shadow-lg" 
                style={{backgroundImage: `url('https://api.dicebear.com/7.x/avataaars/svg?seed=Alex')`}}
              />
            </div>
            <div className="absolute top-4 right-14">
              <button className="bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-base">edit</span>
                Edit Profile
              </button>
            </div>
          </div>

          {/* Identity Section */}
          <div className="mt-20 px-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-black text-[#111418]">Alex Smith</h1>
              <p className="text-lg text-[#137fec] font-semibold">Senior Product Designer</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <span className="material-symbols-outlined text-gray-600">share</span>
              </button>
              <button className="bg-[#137fec] text-white px-6 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-[#137fec]/90 transition-all">
                Connect
              </button>
            </div>
          </div>

          {/* Details Grid */}
          <div className="px-8 mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h3 className="text-lg font-bold text-[#111418] mb-3 border-b border-gray-100 pb-2">Professional Summary</h3>
                <p className="text-[#617589] leading-relaxed">
                  A results-driven Senior Product Designer with over 8 years of experience in creating user-centered digital products. Proven track record of leading design systems and cross-functional teams.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-[#111418] mb-4 border-b border-gray-100 pb-2">Experience</h3>
                <div className="space-y-6">
                  <ExperienceItem title="Principal Designer" company="Creative Studio" date="2021 - Present" icon="corporate_fare" />
                  <ExperienceItem title="UI/UX Designer" company="Tech Innovations" date="2018 - 2021" icon="layers" />
                </div>
              </section>
            </div>

            <aside className="space-y-8">
              <div className="bg-[#f6f7f8] p-6 rounded-xl border border-gray-100">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Contact</h3>
                <div className="space-y-4">
                  <ContactItem icon="mail" text="alex.smith@example.com" />
                  <ContactItem icon="location_on" text="San Francisco, CA" />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExperienceItem = ({ title, company, date, icon }: any) => (
  <div className="flex gap-4">
    <div className="size-12 rounded bg-[#f6f7f8] flex-shrink-0 flex items-center justify-center">
      <span className="material-symbols-outlined text-[#137fec]">{icon}</span>
    </div>
    <div>
      <h4 className="font-bold text-[#111418]">{title}</h4>
      <p className="text-sm text-[#137fec] font-semibold">{company} · {date}</p>
    </div>
  </div>
);

const ContactItem = ({ icon, text }: any) => (
  <div className="flex items-center gap-3">
    <span className="material-symbols-outlined text-gray-400 text-lg">{icon}</span>
    <span className="text-sm text-[#111418] truncate">{text}</span>
  </div>
);