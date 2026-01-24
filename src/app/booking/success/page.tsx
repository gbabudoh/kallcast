'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Card className="max-w-md w-full border-none shadow-2xl rounded-[2rem] overflow-hidden">
        <div className="h-2 bg-green-500 w-full"></div>
        <CardHeader className="pt-10 pb-6 text-center">
          <div className="mx-auto bg-green-100 p-4 rounded-full w-fit mb-6 animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-black text-slate-900">Session Reserved!</CardTitle>
          <p className="text-slate-500 font-medium">Your acceleration journey begins now.</p>
        </CardHeader>
        <CardContent className="space-y-8 px-8 pb-10">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-2.5 rounded-xl shadow-sm">
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                <p className="font-bold text-slate-900">Tomorrow, Oct 24</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white p-2.5 rounded-xl shadow-sm">
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</p>
                <p className="font-bold text-slate-900">3:00 PM - 4:00 PM</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full bg-slate-900 hover:bg-black text-white font-black py-6 rounded-xl shadow-lg cursor-pointer">
              <Link href={ROUTES.LEARNER.MY_SESSIONS} className="cursor-pointer">
                View My Sessions
                <ArrowRight className="w-4 h-4 ml-2 cursor-pointer" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full border-slate-200 text-slate-600 font-bold py-6 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
              <Link href={ROUTES.LEARNER.EXPLORE} className="cursor-pointer">
                Back to Explore
              </Link>
            </Button>
          </div>

          <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Booking ID: {sessionId?.slice(-8) || 'MOCK-123'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
