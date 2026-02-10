import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { EmployerLayout } from '@/components/layout/EmployerLayout';
import { EmployerProfileModal } from '@/components/modals/EmployerProfileModal';
import { apiClient } from '@/lib/apiClient';

export default function EmployerProfilePage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiClient('/api/profile/me');
        if (data.role === 'employer') {
          setCompany(data.profile);
        } else {
          router.replace('/profile/preview');
        }
      } catch (e) {
        router.replace('/');
      }
    };
    load();
  }, [router]);

  return (
    <EmployerLayout>
      <EmployerProfileModal
        isOpen={isOpen}
        company={company}
        onClose={() => {
          setIsOpen(false);
          if (typeof window !== 'undefined' && window.history.length > 1) {
            router.back();
          } else {
            router.push('/employer');
          }
        }}
      />
    </EmployerLayout>
  );
}