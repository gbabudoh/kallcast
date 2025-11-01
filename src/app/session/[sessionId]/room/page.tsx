'use client';

import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DailyVideoRoom from '@/components/session/DailyVideoRoom';

export default function VideoRoomPage() {
  const params = useParams();
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p>Please sign in to join the session.</p>
        </div>
      </div>
    );
  }

  return (
    <DailyVideoRoom 
      bookingId={params.sessionId as string}
      userRole={session.user.role}
    />
  );
}
