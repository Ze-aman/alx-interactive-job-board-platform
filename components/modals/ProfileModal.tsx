import React from 'react';
import { useRouter } from 'next/router';
import { format } from 'date-fns';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: { full_name?: string; email?: string; location?: string; title?: string; bio?: string; phone?: string; profile_picture_url?: string; experiences?: { title?: string; company?: string; start_date?: string; end_date?: string; description?: string }[] };
}

export const ProfileModal = ({ isOpen, onClose, profile }: ProfileModalProps) => {
  const router = useRouter();
  const [uploading, setUploading] = React.useState(false);
  const [picUrl, setPicUrl] = React.useState<string | undefined>(profile?.profile_picture_url);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const fallback = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile?.full_name || 'Alex')}`;
  const currentPic = picUrl || fallback;
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
                style={{backgroundImage: `url('${currentPic}')`}}
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="mt-2 bg-white/90 hover:bg-white text-gray-800 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm"
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Change Photo'}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploading(true);
                  try {
                    const reader = new FileReader();
                    const base64 = await new Promise<string>((resolve, reject) => {
                      reader.onload = () => resolve(String(reader.result));
                      reader.onerror = reject as any;
                      reader.readAsDataURL(file);
                    });
                    const { apiClient } = await import('@/lib/apiClient');
                    const res = await apiClient('/api/profile/picture', { method: 'POST', body: JSON.stringify({ image_base64: base64 }) });
                    setPicUrl(res.profile_picture_url);
                  } catch {}
                  setUploading(false);
                }}
              />
            </div>
            <div className="absolute top-4 right-14">
              <button onClick={() => router.push('/settings')} className="bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-base">edit</span>
                Edit Profile
              </button>
            </div>
          </div>

          {/* Identity Section */}
          <div className="mt-20 px-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-black text-[#111418]">{profile?.full_name || 'Alex Smith'}</h1>
              <p className="text-lg text-[#137fec] font-semibold">{profile?.title || '—'}</p>
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
                  {profile?.bio || '—'}
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-[#111418] mb-4 border-b border-gray-100 pb-2">Experience</h3>
                <div className="space-y-6">
                  {profile?.experiences?.length ? (
                    profile.experiences.map((exp: any, idx: number) => {
                      const startDate = exp.start_date ? format(new Date(exp.start_date), 'MMMM d, yyyy') : '';
                      const endDate = exp.end_date ? format(new Date(exp.end_date), 'MMMM d, yyyy') : '';
                      const dateStr = `${startDate}${endDate ? ' - ' + endDate : ''}`;
                      return (
                        <ExperienceItem 
                          key={idx}
                          title={exp.title}
                          company={exp.company}
                          date={dateStr}
                          icon="work"
                        />
                      );
                    })
                  ) : (
                    <p className="text-[#617589]">—</p>
                  )}
                </div>
              </section>
            </div>

            <aside className="space-y-8">
              <div className="bg-[#f6f7f8] p-6 rounded-xl border border-gray-100">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Contact</h3>
                <div className="space-y-4">
                  <ContactItem icon="mail" text={profile?.email || '—'} />
                  <ContactItem icon="location_on" text={profile?.location || '—'} />
                  <ContactItem icon="call" text={profile?.phone || '—'} />
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