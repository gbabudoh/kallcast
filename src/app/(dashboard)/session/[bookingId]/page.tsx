'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import VideoRoom from '@/components/video/VideoRoom';
import SessionLobby from '@/components/session/SessionLobby';
import SessionComplete from '@/components/session/SessionComplete';

interface BookingData {
  id: string;
  slotId: {
    title: string;
    duration: number;
  };
  coachId: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  learnerId: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  scheduledFor: string;
  sessionStatus: string;
  videoRoomId?: string;
}

type SessionPhase = 'lobby' | 'live' | 'complete';

export default function SessionPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const resolvedParams = use(params);
  const { bookingId } = resolvedParams;
  const { data: session } = useSession();
  const router = useRouter();
  
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [phase, setPhase] = useState<SessionPhase>('lobby');
  const [error, setError] = useState<string | null>(null);

  const isCoach = session?.user?.id === booking?.coachId.id;

  // Fetch booking data
  useEffect(() => {
    async function fetchBooking() {
      try {
        const res = await fetch(`/api/bookings/${bookingId}`);
        if (!res.ok) {
          throw new Error('Failed to load booking');
        }
        const data = await res.json();
        setBooking(data.booking);

        // Determine initial phase based on session status
        if (data.booking.sessionStatus === 'completed' || 
            data.booking.sessionStatus === 'pending_confirmation') {
          setPhase('complete');
        } else if (data.booking.sessionStatus === 'in-progress') {
          setPhase('live');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    }

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  // Join session handler
  const handleJoinSession = async () => {
    try {
      const res = await fetch('/api/video/create-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to join session');
      }

      setPhase('live');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to join session');
    }
  };

  // Session end handler
  const handleSessionEnd = () => {
    setPhase('complete');
  };

  // Confirm session handler
  const handleConfirm = async (confirmed: boolean, rating?: number, feedback?: string) => {
    const res = await fetch('/api/sessions/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingId,
        confirmed,
        rating,
        feedback,
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to confirm session');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-white/60">Loading session...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error || 'Booking not found'}</p>
          <button
            onClick={() => router.back()}
            className="text-blue-400 hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const coachName = `${booking.coachId.firstName} ${booking.coachId.lastName}`;
  const clientName = `${booking.learnerId.firstName} ${booking.learnerId.lastName}`;
  const scheduledTime = new Date(booking.scheduledFor);
  const displayName = isCoach ? coachName : clientName;

  // Render based on session phase
  if (phase === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <SessionComplete
          bookingId={bookingId}
          coachName={coachName}
          clientName={clientName}
          sessionTitle={booking.slotId.title}
          duration={booking.slotId.duration}
          isCoach={isCoach}
          onConfirm={handleConfirm}
        />
      </div>
    );
  }

  if (phase === 'live') {
    return (
      <div className="min-h-screen bg-slate-900 p-4">
        <VideoRoom
          sessionId={booking.id}
          bookingId={bookingId}
          displayName={displayName}
          email={session?.user?.email || undefined}
          sessionTitle={booking.slotId.title}
          durationMinutes={booking.slotId.duration}
          startTime={scheduledTime}
          onSessionEnd={handleSessionEnd}
        />
      </div>
    );
  }

  // Default: Lobby
  return (
    <SessionLobby
      sessionTitle={booking.slotId.title}
      coachName={coachName}
      coachImage={booking.coachId.profileImage}
      clientName={clientName}
      clientImage={booking.learnerId.profileImage}
      scheduledTime={scheduledTime}
      duration={booking.slotId.duration}
      isCoach={isCoach}
      onJoinSession={handleJoinSession}
      onClose={() => router.back()}
      canJoin={true}
    />
  );
}
