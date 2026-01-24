'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ROUTES } from '@/constants/routes';

export default function DashboardSessionsRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      if (session.user.role === 'coach') {
        router.replace(ROUTES.COACH.MY_SESSIONS);
      } else {
        router.replace(ROUTES.LEARNER.MY_SESSIONS);
      }
    } else if (status === 'unauthenticated') {
      router.replace(ROUTES.AUTH.LOGIN);
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 font-medium">Redirecting to your sessions...</p>
      </div>
    </div>
  );
}
