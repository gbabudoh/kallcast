'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoading = status === 'loading';
  const isAuthenticated = !!session;
  const user = session?.user;

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    isLearner: user?.role === 'learner',
    isCoach: user?.role === 'coach',
  };
}

export function useRequireAuth() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  return { user, isLoading, isAuthenticated };
}

export function useRequireRole(requiredRole: 'learner' | 'coach') {
  const { user, isLoading, isAuthenticated, isLearner, isCoach } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (requiredRole === 'learner' && !isLearner) {
        router.push('/dashboard');
      } else if (requiredRole === 'coach' && !isCoach) {
        router.push('/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, isLearner, isCoach, requiredRole, router]);

  return { user, isLoading, isAuthenticated, isLearner, isCoach };
}
