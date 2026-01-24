'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  Plus, 
  Sparkles, 
  Video, 
  TrendingUp,
  Award,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ROUTES } from '@/constants/routes';

interface SessionSlot {
  _id: string;
  title: string;
  startTime: string;
  status: string;
  price: number;
  currentParticipants: number;
  maxParticipants: number;
}

interface PopulatedBooking {
  _id: string;
  amount: number;
  sessionStatus: string;
  scheduledFor: string;
  slotId: {
    _id: string;
    title: string;
    duration: number;
    category?: string;
  };
  coachId: {
    _id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  learnerId: {
    _id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  coachPayout?: number;
}

export default function MySessionsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [slots, setSlots] = useState<SessionSlot[]>([]);
  const [bookings, setBookings] = useState<PopulatedBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    upcoming: 0,
    completed: 0,
    students: 0,
    earnings: 0,
    spent: 0
  });

  const userRole = session?.user?.role || 'learner';

  useEffect(() => {
    async function fetchData() {
      if (!session) return;
      
      try {
        setIsLoading(true);
        if (userRole === 'coach') {
          const [slotsRes, bookingsRes] = await Promise.all([
            fetch('/api/slots'),
            fetch('/api/bookings?role=coach')
          ]);

          if (slotsRes.ok && bookingsRes.ok) {
            const slotsData = await slotsRes.json();
            const bookingsData = await bookingsRes.json();
            
            setSlots(slotsData.slots || []);
            const bookingsList: PopulatedBooking[] = bookingsData.bookings || [];
            
            const upcoming = bookingsList.filter((b) => b.sessionStatus === 'scheduled').length;
            const completed = bookingsList.filter((b) => b.sessionStatus === 'completed').length;
            const students = new Set(bookingsList.map((b) => b.learnerId._id)).size;
            const earnings = bookingsList.reduce((acc, b) => acc + (b.coachPayout || 0), 0);

            setStats({ upcoming, completed, students, earnings, spent: 0 });
          }
        } else {
          // Learner role
          const bookingsRes = await fetch('/api/bookings?role=learner');
          if (bookingsRes.ok) {
            const bookingsData = await bookingsRes.json();
            const bookingsList: PopulatedBooking[] = bookingsData.bookings || [];
            setBookings(bookingsList);

            const upcoming = bookingsList.filter((b) => b.sessionStatus === 'scheduled').length;
            const completed = bookingsList.filter((b) => b.sessionStatus === 'completed').length;
            const spent = bookingsList.reduce((acc, b) => acc + (b.amount || 0), 0);

            setStats({ 
              upcoming, 
              completed, 
              students: 0, 
              earnings: 0, 
              spent 
            });
          }
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Failed to load sessions data');
      } finally {
        setIsLoading(false);
      }
    }
    
    if (session) {
      fetchData();
    }
  }, [session, userRole]);

  const isLearner = userRole === 'learner';

  return (
    <div className="space-y-8 min-h-screen bg-[#F8FAFC] p-6 rounded-[2.5rem]">
      {/* Back Button */}
      <Link 
        href={isLearner ? ROUTES.DASHBOARD.LEARNER_BASE : ROUTES.DASHBOARD.COACH_BASE} 
        className="group inline-flex items-center space-x-3 text-slate-400 hover:text-blue-600 transition-all cursor-pointer"
      >
        <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shadow-sm cursor-pointer">
          <ArrowLeft className="w-5 h-5 cursor-pointer" />
        </div>
        <span className="text-sm font-black uppercase tracking-widest cursor-pointer">Back to Dashboard</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            {isLearner ? 'My Learning Journey' : 'My Coaching Hub'}
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            {isLearner 
              ? 'Track your progress and attend your scheduled sessions' 
              : 'Manage your schedule and track your global impact'}
          </p>
        </div>
        {!isLearner && (
          <Link href="/my-sessions/create" className="cursor-pointer">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-6 rounded-2xl shadow-glow transition-all flex items-center space-x-2 cursor-pointer">
              <Plus className="h-5 w-5 cursor-pointer" />
              <span className="cursor-pointer">Create Session Slot</span>
            </Button>
          </Link>
        )}
        {isLearner && (
          <Link href={ROUTES.LEARNER.EXPLORE} className="cursor-pointer">
            <Button className="bg-slate-900 hover:bg-black text-white font-black px-6 py-6 rounded-2xl shadow-xl transition-all flex items-center space-x-2 cursor-pointer">
              <Sparkles className="h-5 w-5 cursor-pointer text-blue-400" />
              <span className="cursor-pointer">Explore More Coaches</span>
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Upcoming', val: stats.upcoming.toString(), icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Completed', val: stats.completed.toString(), icon: isLearner ? Award : Users, color: 'text-purple-600', bg: 'bg-purple-50' },
          { title: isLearner ? 'Growth Streak' : 'Students', val: isLearner ? '7 Days' : stats.students.toString(), icon: isLearner ? TrendingUp : Sparkles, color: 'text-amber-600', bg: 'bg-amber-50' },
          { title: isLearner ? 'Total Invested' : 'Earnings', val: isLearner ? `$${stats.spent}` : `$${stats.earnings}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-xl rounded-3xl bg-white/70 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.title}</CardTitle>
              <div className={`${stat.bg} p-2 rounded-xl cursor-pointer`}>
                <stat.icon className={`h-4 w-4 ${stat.color} cursor-pointer`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900">{stat.val}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sessions List */}
      <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-xl">
        <div className="h-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"></div>
        <CardHeader className="p-8">
          <CardTitle className="text-2xl font-black text-slate-900">
            {isLearner ? 'Booked Sessions' : 'Live Sessions'}
          </CardTitle>
          <CardDescription className="font-medium text-slate-500">
            {isLearner 
              ? 'Your upcoming and past mentorship sessions' 
              : 'Current availability and scheduled mentorships'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (isLearner ? bookings.length > 0 : slots.length > 0) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isLearner ? (
                bookings.map((booking: PopulatedBooking) => (
                  <div key={booking._id} className="bg-slate-50/50 border border-slate-100 p-6 rounded-[2rem] hover:border-blue-200 transition-all group shadow-sm flex flex-col">
                    <div className="flex items-center space-x-4 mb-5">
                      <Avatar className="h-12 w-12 rounded-2xl ring-2 ring-white cursor-pointer">
                        <AvatarImage src={booking.coachId.profileImage} className="cursor-pointer" />
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-bold cursor-pointer">
                          {booking.coachId.firstName[0]}{booking.coachId.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-lg font-black text-slate-900">{booking.slotId.title}</h4>
                          <Badge className={
                            booking.sessionStatus === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                            booking.sessionStatus === 'completed' ? 'bg-green-100 text-green-700' :
                            'bg-slate-100 text-slate-600'
                          }>
                            {booking.sessionStatus}
                          </Badge>
                        </div>
                        <p className="text-slate-500 text-sm font-medium">Session with {booking.coachId.firstName} {booking.coachId.lastName}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white/50 p-3 rounded-xl border border-slate-100">
                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Date & Time</div>
                        <div className="text-sm font-bold text-slate-900 flex items-center cursor-pointer">
                          <Calendar className="h-3.5 w-3.5 mr-2 text-blue-500 cursor-pointer" />
                          {new Date(booking.scheduledFor).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-slate-500 font-medium ml-5 mt-0.5">
                          {new Date(booking.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div className="bg-white/50 p-3 rounded-xl border border-slate-100">
                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Duration</div>
                        <div className="text-sm font-bold text-slate-900 flex items-center cursor-pointer">
                          <Clock className="h-3.5 w-3.5 mr-2 text-blue-500 cursor-pointer" />
                          {booking.slotId.duration} Minutes
                        </div>
                        <div className="text-xs text-slate-500 font-medium ml-5 mt-0.5">
                          4K Live Video
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-5 border-t border-slate-100 flex justify-between items-center">
                      <div className="font-black text-xl text-slate-900">${booking.amount}</div>
                      {booking.sessionStatus === 'scheduled' && (
                        <Button 
                          onClick={() => router.push(ROUTES.SESSION.ROOM(booking._id))}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl px-5 py-5 flex items-center space-x-2 transition-all shadow-md active:scale-95 cursor-pointer"
                        >
                          <Video className="h-4 w-4 cursor-pointer" />
                          <span className="cursor-pointer">Join Session</span>
                        </Button>
                      )}
                      {booking.sessionStatus === 'completed' && (
                        <Button 
                          variant="outline"
                          className="border-slate-200 text-slate-700 font-black rounded-xl cursor-pointer"
                        >
                          View Recording
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                slots.map((slot) => (
                  <div key={slot._id} className="bg-slate-50/50 border border-slate-100 p-6 rounded-[2rem] hover:border-blue-200 transition-all group shadow-sm cursor-pointer">
                    <div className="flex justify-between items-start mb-4 cursor-pointer">
                      <h4 className="text-lg font-black text-slate-900 cursor-pointer">{slot.title}</h4>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer ${
                        slot.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {slot.status}
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 cursor-pointer">
                      <div className="flex items-center text-slate-500 text-xs font-bold uppercase tracking-wider cursor-pointer">
                        <Calendar className="h-4 w-4 mr-2 text-blue-600 cursor-pointer" />
                        {new Date(slot.startTime).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-slate-500 text-xs font-bold uppercase tracking-wider cursor-pointer">
                        <Clock className="h-4 w-4 mr-2 text-blue-600 cursor-pointer" />
                        {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center cursor-pointer">
                      <div className="text-2xl font-black text-slate-900 cursor-pointer">${slot.price}</div>
                      <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center cursor-pointer">
                        <Users className="h-3.5 w-3.5 mr-1.5 cursor-pointer" />
                        {slot.currentParticipants} / {slot.maxParticipants} Seats
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
              <div className="bg-white w-20 h-20 rounded-3xl shadow-lg flex items-center justify-center mx-auto mb-6 transform hover:rotate-6 transition-transform cursor-pointer">
                <Calendar className="h-10 w-10 text-blue-600 cursor-pointer" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">
                {isLearner ? 'No Sessions Booked' : 'Blueprint Your First Session'}
              </h3>
              <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium">
                {isLearner 
                  ? "You haven't booked any mentorship sessions yet. Start your journey by exploring expert coaches."
                  : "You haven't set your availability yet. Start by defining your first session slot."}
              </p>
              {isLearner ? (
                <Button 
                  onClick={() => router.push(ROUTES.LEARNER.EXPLORE)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-7 rounded-2xl shadow-xl transition-all h-auto text-lg cursor-pointer"
                >
                  Explore Coaches
                </Button>
              ) : (
                <Link href="/my-sessions/create">
                  <Button className="bg-slate-900 hover:bg-black text-white font-black px-10 py-7 rounded-2xl shadow-xl transition-all h-auto text-lg cursor-pointer">
                    Create Session Slot
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {isLearner && bookings.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 border-0 shadow-2xl text-white rounded-[2.5rem]">
          <CardContent className="p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h3 className="text-3xl font-black mb-3 flex items-center cursor-default">
                <Sparkles className="w-8 h-8 mr-4 text-blue-300 cursor-pointer" />
                Accelerate Your Growth
              </h3>
              <p className="text-blue-100 text-lg font-medium opacity-90 max-w-xl">
                Every session is a step closer to your goals. Review your completed sessions or book a follow-up to maintain your momentum.
              </p>
            </div>
            <div className="flex gap-4">
              <Button 
                onClick={() => router.push(ROUTES.LEARNER.EXPLORE)}
                className="bg-white text-blue-600 hover:bg-slate-50 font-black py-7 px-8 rounded-2xl text-lg shadow-xl active:scale-95 transition-transform cursor-pointer"
              >
                Find Coaches
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
