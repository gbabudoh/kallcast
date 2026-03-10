'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Users, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

export interface Slot {
  id: string;
  coachId: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  maxParticipants: number;
  currentParticipants: number;
  category: string;
  startTime: string;
  endTime: string;
  coach: {
    firstName: string;
    lastName: string;
    profileImage: string | null;
    averageRating: number;
  };
}

interface PackageCardProps {
  slot: Slot;
}

export default function PackageCard({ slot }: PackageCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleBookSession = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    router.push(`/coach/${slot.coachId}#booking-section`); 
  };

  const startDate = new Date(slot.startTime);
  const seatsLeft = slot.maxParticipants - slot.currentParticipants;

  return (
    <Link href={`/coach/${slot.coachId}`}>
      <Card className="group hover:shadow-2xl transition-all duration-300 border-slate-100 overflow-hidden bg-white flex flex-col h-full rounded-[1.5rem] shadow-sm">
        <CardContent className="p-0 flex flex-col h-full">
          {/* Header focusing on Package Title */}
          <div className="relative p-5 bg-slate-900 text-white min-h-[150px] flex flex-col justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-0.5 bg-blue-500/20 backdrop-blur-md border border-blue-400/30 rounded-full text-[9px] font-black uppercase tracking-widest text-blue-300">
                  {slot.category}
                </span>
                <span className="px-2 py-0.5 bg-green-500/20 backdrop-blur-md border border-green-400/30 rounded-full text-[9px] font-black uppercase tracking-widest text-green-300">
                  Available
                </span>
              </div>
              <h2 className="text-xl font-black leading-tight mb-3 group-hover:text-blue-300 transition-colors">
                {slot.title}
              </h2>
              
              <div className="flex items-center space-x-4 text-[11px] font-bold text-slate-300">
                <div className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                  {format(startDate, 'EEEE d MMMM')}
                </div>
                <div className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                  {format(startDate, 'HH:mm')}
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col">
            {/* Coach Credit */}
            <div className="flex items-center space-x-3 mb-5">
              <Avatar className="h-8 w-8 ring-2 ring-slate-100">
                <AvatarImage src={slot.coach.profileImage ?? undefined} alt={slot.coach.firstName} className="object-cover" />
                <AvatarFallback className="bg-slate-200 text-slate-600 font-bold text-[10px]">
                  {slot.coach.firstName[0]}{slot.coach.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="text-[12px] font-black text-slate-900 truncate">
                  {slot.coach.firstName} {slot.coach.lastName}
                </div>
                <div className="flex items-center text-[10px] font-bold text-amber-500">
                  <Star className="h-3 w-3 fill-amber-500 mr-1" />
                  <span>{slot.coach.averageRating?.toFixed(1) || '5.0'}</span>
                </div>
              </div>
            </div>

            {/* Description/Gains (Mocked if empty) */}
            <p className="text-xs text-slate-500 mb-5 line-clamp-2 font-medium">
              {slot.description || "Master these professional skills in a high-impact coaching session designed for your growth."}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="flex items-center text-slate-500 text-[11px] font-bold">
                <Users className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                <span className={seatsLeft <= 2 ? 'text-orange-600' : ''}>
                  {slot.currentParticipants} / {slot.maxParticipants} Seats
                </span>
              </div>
              <div className="flex items-center justify-end text-slate-900 font-black">
                <span className="text-lg">${slot.price}</span>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-50">
              <Button 
                onClick={handleBookSession}
                disabled={isLoading}
                className="w-full bg-slate-900 hover:bg-black text-white font-black h-10 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer text-xs uppercase tracking-widest"
              >
                {isLoading ? 'Processing...' : 'Enroll Now'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
