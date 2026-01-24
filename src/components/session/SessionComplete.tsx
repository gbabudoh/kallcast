'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, CheckCircle, AlertTriangle, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface SessionCompleteProps {
  bookingId: string;
  coachName: string;
  clientName: string;
  sessionTitle: string;
  duration: number; // actual duration in minutes
  isCoach: boolean;
  onConfirm: (confirmed: boolean, rating?: number, feedback?: string) => Promise<void>;
}

export default function SessionComplete({
  // bookingId is available for future API calls if needed
  coachName,
  clientName,
  sessionTitle,
  duration,
  isCoach,
  onConfirm,
}: SessionCompleteProps) {
  const router = useRouter();
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasReported, setHasReported] = useState(false);

  const handleConfirm = async (confirmed: boolean) => {
    setIsSubmitting(true);
    try {
      await onConfirm(confirmed, confirmed ? rating : undefined, feedback || undefined);
      
      if (confirmed) {
        toast.success('Session confirmed! Payment will be processed.');
      } else {
        toast.info('Issue reported. Our team will review it.');
        setHasReported(true);
      }
      
      // Redirect to dashboard after a delay
      setTimeout(() => {
        router.push(isCoach ? '/my-sessions' : '/my-bookings');
      }, 2000);
    } catch {
      toast.error('Failed to submit confirmation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasReported) {
    return (
      <Card className="max-w-lg mx-auto border-none shadow-2xl rounded-[2rem] overflow-hidden bg-white">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Issue Reported</h2>
          <p className="text-slate-500 mb-6">
            Our team has been notified and will review your case within 24 hours.
          </p>
          <Button
            onClick={() => router.push(isCoach ? '/my-sessions' : '/my-bookings')}
            className="bg-slate-900 hover:bg-black text-white font-bold px-8 py-3 rounded-xl"
          >
            Return to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-lg mx-auto border-none shadow-2xl rounded-[2rem] overflow-hidden bg-white">
      <div className="h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500" />
      
      <CardHeader className="p-8 pb-4 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-black text-slate-900">
          Session Complete!
        </CardTitle>
        <CardDescription className="text-slate-500 font-medium">
          Please confirm that the session was completed successfully.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-8 pt-0 space-y-6">
        {/* Session Summary */}
        <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-sm font-medium">Session</span>
            <span className="text-slate-900 font-bold text-sm">{sessionTitle}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-sm font-medium">
              {isCoach ? 'Client' : 'Coach'}
            </span>
            <span className="text-slate-900 font-bold text-sm">
              {isCoach ? clientName : coachName}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-sm font-medium">Duration</span>
            <Badge className="bg-blue-100 text-blue-700 border-none">
              {duration} minutes
            </Badge>
          </div>
        </div>

        {/* Rating (only for clients) */}
        {!isCoach && (
          <div className="space-y-3">
            <label className="text-slate-900 font-bold text-sm">Rate Your Experience</label>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feedback */}
        <div className="space-y-2">
          <label className="text-slate-900 font-bold text-sm flex items-center">
            <MessageSquare className="w-4 h-4 mr-2" />
            Feedback (Optional)
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your thoughts about the session..."
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl resize-none h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <Button
            onClick={() => handleConfirm(true)}
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-black h-14 rounded-xl text-lg cursor-pointer"
          >
            {isSubmitting ? 'Processing...' : '✅ Confirm & Release Payment'}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => handleConfirm(false)}
            disabled={isSubmitting}
            className="w-full border-slate-200 text-slate-600 hover:bg-slate-50 font-bold h-12 rounded-xl cursor-pointer"
          >
            ⚠️ Report Issue
          </Button>
        </div>

        <p className="text-xs text-slate-400 text-center">
          By confirming, you agree that the session was completed as scheduled.
          {!isCoach && ' Payment will be released to the coach.'}
        </p>
      </CardContent>
    </Card>
  );
}
