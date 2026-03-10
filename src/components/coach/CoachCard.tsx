'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, CheckCircle2 } from 'lucide-react';
import { CoachProfile } from '@/types/coach';

interface CoachCardProps {
  coach: CoachProfile;
}

export default function CoachCard({ coach }: CoachCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleBookSession = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    router.push(`/coach/${coach.id}#booking-section`);
  };

  return (
    <Link href={`/coach/${coach.id}`}>
      <Card className="group hover:shadow-2xl transition-all duration-300 border-slate-100 overflow-hidden bg-white flex flex-col h-full rounded-[1.5rem] shadow-sm">
        <CardContent className="p-0 flex flex-col h-full">
          {/* Main Focus: Session Title & Gains */}
          <div className="relative p-5 bg-slate-900 text-white min-h-[150px] flex flex-col justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-50 group-hover:opacity-80 transition-opacity"></div>
            <div className="relative z-10">
              <h2 className="text-xl font-black leading-tight mb-3 group-hover:text-blue-300 transition-colors">
                {coach.sessionTitle || `1-on-1 Coaching with ${coach.firstName}`}
              </h2>
              
              <div className="space-y-1.5">
                {(coach.sessionGains || ['Master core concepts', 'Get personalized feedback', 'Accelerate your progress']).slice(0, 2).map((gain, i) => (
                  <div key={i} className="flex items-center text-slate-300 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-green-400 shrink-0" />
                    <span className="truncate">{gain}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col">
            {/* Coach Identity (Secondary) */}
            <div className="flex items-center space-x-3 mb-5">
              <div className="relative">
                <Avatar className="h-9 w-9 ring-2 ring-slate-100">
                  <AvatarImage src={coach.profileImage ?? undefined} alt={`${coach.firstName} ${coach.lastName}`} className="object-cover" />
                  <AvatarFallback className="bg-slate-200 text-slate-600 font-bold text-xs">
                    {coach.firstName[0]}{coach.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-black text-slate-900 truncate">
                  {coach.firstName} {coach.lastName}
                </div>
                <div className="text-[9px] text-slate-500 font-black uppercase tracking-wider truncate">
                  {coach.title || 'Expert Coach'} {coach.company && <>&nbsp;@ <span className="text-blue-600">{coach.company}</span></>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="flex items-center text-slate-500 text-[11px] font-bold">
                <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                <span className="truncate">{coach.location || 'Remote'}</span>
              </div>
              <div className="flex items-center justify-end text-[11px] font-bold text-slate-900">
                <Star className="h-3 w-3 text-amber-500 fill-amber-500 mr-1" />
                <span>{coach.averageRating?.toFixed(1) || '5.0'}</span>
                <span className="text-slate-400 font-medium ml-1">({coach.totalSessions || 0})</span>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-50 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[9px] text-slate-400 uppercase tracking-widest font-black mb-0.5">Rate</div>
                  <div className="text-lg font-black text-slate-900">${coach.hourlyRate || 0}<span className="text-[10px] text-slate-400 font-bold">/hr</span></div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-slate-400 uppercase tracking-widest font-black mb-0.5">Availability</div>
                  <div className="text-[11px] font-black text-green-600">Today 3:00 PM</div>
                </div>
              </div>

              <Button 
                onClick={handleBookSession}
                disabled={isLoading}
                className="w-full bg-slate-900 hover:bg-black text-white font-black h-10 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer text-xs"
              >
                {isLoading ? 'Wait...' : 'Book Session'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
