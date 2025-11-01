'use client';

import { useSession } from 'next-auth/react';

export default function SessionDebug() {
  const { data: session, status } = useSession();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Session Debug</h3>
      <div>
        <strong>Status:</strong> {status}
      </div>
      <div>
        <strong>Session:</strong> {session ? 'Present' : 'None'}
      </div>
      {session && (
        <div>
          <strong>User:</strong> {session.user?.firstName} {session.user?.lastName}
        </div>
      )}
      {session && (
        <div>
          <strong>Email:</strong> {session.user?.email}
        </div>
      )}
      {session && (
        <div>
          <strong>Role:</strong> {session.user?.role}
        </div>
      )}
    </div>
  );
}
