import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProfileModal } from '@/components/modals/ProfileModal';
import { apiClient } from '@/lib/apiClient';

export default function ProfilePreviewPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [profile, setProfile] = useState<{ full_name?: string; email?: string; location?: string; title?: string; bio?: string; phone?: string; profile_picture_url?: string; experiences?: { title?: string; company?: string; start_date?: string; end_date?: string; description?: string }[] } | undefined>(undefined);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiClient('/api/profile/me');
        if (data.role === 'candidate') {
          setProfile(data.profile);
        } else {
          router.replace('/employer/profile');
        }
      } catch (e) {
        router.replace('/');
      }
    };
    load();
  }, [router]);

  return (
    <DashboardLayout>
      <ProfileModal
        isOpen={isModalOpen}
        profile={profile}
        onClose={() => {
          setIsModalOpen(false);
          if (typeof window !== 'undefined' && window.history.length > 1) {
            router.back();
          } else {
            router.push('/profile');
          }
        }}
      />
    </DashboardLayout>
  );
}
