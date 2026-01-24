'use client';

import { useState } from 'react';
import VideoRoom from '@/components/video/VideoRoom';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Video, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export default function VideoTestPage() {
  const [inRoom, setInRoom] = useState(false);

  // Mock session data
  const mockSession = {
    sessionId: 'test-room-123',
    bookingId: 'booking-abc',
    displayName: 'Test User',
    sessionTitle: 'Jitsi Integration Test',
    startTime: new Date(),
    durationMinutes: 60,
  };

  if (inRoom) {
    return (
      <div className="min-h-screen bg-slate-950 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
               <ShieldCheck className="w-6 h-6 text-blue-500" />
               <h2 className="text-xl font-bold text-white tracking-tight">KallCast Secure Video</h2>
            </div>
            <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10"
                onClick={() => setInRoom(false)}
            >
                Exit Test Room
            </Button>
          </div>
          
          <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900">
            <VideoRoom 
              {...mockSession}
              onSessionEnd={() => setInRoom(false)}
            />
          </div>

          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium text-center">
            This is a sandboxed environment for verifying the Jitsi conferencing engine and session timer logic.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-0 shadow-2xl overflow-hidden rounded-3xl">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Video className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-black mb-2">Video Verification</CardTitle>
          <CardDescription className="text-blue-100 text-lg">
            Ensure your conferencing engine is primed for coaching sessions.
          </CardDescription>
        </div>
        
        <CardContent className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="mt-1 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                Connects to <code className="bg-slate-100 px-1 rounded text-blue-600">jitsi.feendesk.com</code>
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="mt-1 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                Verifies real-time session duration timers
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="mt-1 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                Validates microphone and camera integration
              </p>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <Button 
              size="lg" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg transform active:scale-95 transition-all"
              onClick={() => setInRoom(true)}
            >
              <Phone className="w-5 h-5 mr-2" />
              Launch Test Room
            </Button>
            
            <Link href={ROUTES.DASHBOARD.LEARNER_BASE} className="block">
              <Button variant="ghost" className="w-full text-slate-500 font-medium">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
