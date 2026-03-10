'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Clock, 
  Video, 
  Loader2,
  BookmarkCheck,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface PopulatedBooking {
  id: string;
  amount: number;
  sessionStatus: string;
  scheduledFor: string;
  slotId?: {
    id: string;
    title: string;
    duration: number;
  };
  coachId?: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  learnerId?: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
}

interface RawBooking {
  id: string;
  amount: number;
  sessionStatus: string;
  scheduledFor: string;
  slot: {
    id: string;
    title: string;
    duration: number;
  };
  coach: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  learner: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
}

export default function BookingsReservationPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<PopulatedBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchBookings();
    }
    // Relationship sync
  }, [session]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/bookings?role=coach`);
      if (res.ok) {
        const data = await res.json();
        const bookingList = (data.bookings || []).map((b: RawBooking) => ({
          ...b,
          learnerId: b.learner,
          coachId: b.coach,
          slotId: b.slot
        }));
        setBookings(bookingList);
      }
    } catch (err) {
      console.error('Fetch bookings error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
        <p className="mt-4 text-slate-400 font-medium animate-pulse uppercase tracking-[0.2em] text-[10px] font-black">Syncing Reservations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 mt-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-indigo-50 rounded-2xl">
                <BookmarkCheck className="h-6 w-6 text-indigo-600" />
             </div>
             <h1 className="text-4xl font-black text-slate-900 tracking-tight">Reservation Store</h1>
          </div>
          <p className="text-slate-500 font-medium text-lg max-w-2xl px-1">
            Manage your confirmed bookings and upcoming learner connections.
          </p>
        </div>
      </div>

      {/* Grid Display */}
      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {bookings.map((booking) => (
            <Card key={booking.id} className="group relative overflow-hidden border-slate-100 shadow-xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-700 rounded-[3rem] bg-white border-t-white">
              {/* Profile Background Effect */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50/30 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
              
              <CardContent className="p-10 relative">
                {/* Header: Learner Info & Status */}
                <div className="flex items-center justify-between mb-10">
                  <div className="relative">
                    <Avatar className="h-20 w-20 rounded-[1.8rem] shadow-xl border-4 border-white group-hover:rotate-6 transition-transform duration-500">
                        <AvatarImage src={booking.learnerId?.profileImage} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-black text-xl">
                        {booking.learnerId?.firstName?.[0]}{booking.learnerId?.lastName?.[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 h-7 w-7 bg-white p-1 rounded-full shadow-lg">
                        <div className="h-full w-full bg-emerald-500 rounded-full flex items-center justify-center">
                            <ShieldCheck className="h-3 w-3 text-white" />
                        </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge className="bg-white/80 backdrop-blur-md text-slate-800 border border-slate-100 shadow-[0_4px_12px_rgb(0,0,0,0.05)] px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {booking.sessionStatus}
                    </Badge>
                  </div>
                </div>

                {/* Body: Title & Partner */}
                <div className="space-y-1 mb-8">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Learner Partner</p>
                     <h3 className="text-3xl font-black text-slate-900 leading-[1.1] tracking-tight group-hover:text-indigo-900 transition-colors duration-500">
                        {booking.learnerId?.firstName ?? 'Unknown'} <span className="text-indigo-600">{booking.learnerId?.lastName ?? 'Learner'}</span>
                    </h3>
                </div>

                {/* Session Context */}
                <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100/50 mb-10 group-hover:bg-indigo-50/30 group-hover:border-indigo-100 transition-all duration-500">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 opacity-60">Programme Title</p>
                    <p className="text-sm font-bold text-slate-700 mb-6 leading-relaxed line-clamp-1 italic">
                        &ldquo;{booking.slotId?.title ?? 'Untitled Session'}&rdquo;
                    </p>
                    
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-indigo-400" />
                            <span className="text-sm font-black text-slate-900">
                                {new Date(booking.scheduledFor).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                            </span>
                         </div>
                         <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-indigo-400" />
                            <span className="text-sm font-black text-slate-900">
                                {new Date(booking.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                         </div>
                    </div>
                </div>

                {/* Actions */}
                <Button className="w-full bg-slate-900 hover:bg-black text-white font-black py-7 rounded-[2rem] h-auto flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] group/btn">
                    <Video className="h-6 w-6 text-indigo-400 group-hover/btn:scale-110 transition-transform" />
                    <span className="text-lg">Join Private Room</span>
                    <ArrowRight className="h-5 w-5 ml-1 opacity-40 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-40 bg-slate-50/10 rounded-[4rem] border-2 border-dashed border-slate-100/50 flex flex-col items-center">
            <div className="h-24 w-24 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-100 flex items-center justify-center mb-10">
                <BookmarkCheck className="h-12 w-12 text-slate-200" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">No Active Reservations</h2>
            <p className="text-slate-400 font-medium text-lg mb-12 max-w-sm mx-auto leading-relaxed">
              Learner bookings will appear here once your programmes start gaining traction.
            </p>
        </div>
      )}
    </div>
  );
}
