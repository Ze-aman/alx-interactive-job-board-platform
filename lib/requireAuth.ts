import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';

export const useRequireAuth = (role?: 'candidate' | 'employer' | 'admin') => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/');
      return;
    }

    if (role && user.role !== role) {
      router.replace('/');
    }
  }, [user, loading, role, router]);
};
