'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export default function BookingCancelPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Card className="max-w-md w-full border-none shadow-2xl rounded-[2rem] overflow-hidden">
        <div className="h-2 bg-slate-200 w-full"></div>
        <CardHeader className="pt-10 pb-6 text-center">
          <div className="mx-auto bg-slate-100 p-4 rounded-full w-fit mb-6">
            <XCircle className="w-12 h-12 text-slate-400" />
          </div>
          <CardTitle className="text-3xl font-black text-slate-900">Booking Cancelled</CardTitle>
          <p className="text-slate-500 font-medium">No worries, you can try again anytime.</p>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pb-10">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center">
            <p className="text-sm text-slate-600 font-medium">
              We&apos;ve saved your progress. If you just had a change of heart, your perfect coach is still waiting.
            </p>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full bg-slate-900 hover:bg-black text-white font-black py-6 rounded-xl shadow-lg cursor-pointer">
              <Link href={ROUTES.LEARNER.EXPLORE} className="cursor-pointer">
                Return to Discovery
                <ArrowLeft className="w-4 h-4 ml-2 cursor-pointer" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
