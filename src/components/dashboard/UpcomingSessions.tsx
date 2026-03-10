'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useApi } from '@/hooks';
import { 
  Calendar, 
  Clock, 
  Video, 
  ArrowRight,
  AlertCircle,
  RefreshCw,
  GraduationCap
} from 'lucide-react';
import { format, isToday, isTomorrow, differenceInMinutes } from 'date-fns';
import { BookingWithDetails } from '@/types/booking';
import { Slot } from '@/types/slot';
import { ROUTES } from '@/constants/routes';

interface UnifiedSession {
  id: string;
  type: 'booking' | 'slot';
  title: string;
  startTime: string | Date;
  endTime?: string | Date;
  duration?: number;
  category?: string;
  status: string;
  otherUser?: {
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  capacity?: {
    current: number;
    max: number;
  };
}

interface UpcomingSessionsProps {
  userRole: 'learner' | 'coach';
  limit?: number;
}

export default function UpcomingSessions({ userRole, limit = 5 }: UpcomingSessionsProps) {
  const [sessions, setSessions] = useState<UnifiedSession[]>([]);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const { data: sessionData } = useSession();
  const router = useRouter();

  const fetchData = useCallback(async () => {
    // Fetch bookings
    const bookingsRes = await fetch(`/api/bookings?role=${userRole}&type=upcoming`, {
      credentials: 'include',
    });
    
    if (!bookingsRes.ok) throw new Error('Failed to fetch bookings');
    const bookingsData = await bookingsRes.ok ? await bookingsRes.json() : { bookings: [] };

    let slots: Slot[] = [];
    if (userRole === 'coach' && sessionData?.user?.id) {
      const slotsRes = await fetch(`/api/slots?coachId=${sessionData.user.id}`, {
        credentials: 'include',
      });
      if (slotsRes.ok) {
        const data = await slotsRes.json();
        slots = data.slots || [];
      }
    }

    // Process and merge
    const processedBookings: UnifiedSession[] = (bookingsData.bookings || []).map((b: BookingWithDetails) => ({
      id: b.id,
      type: 'booking',
      title: b.slot?.title || 'Session',
      startTime: b.scheduledFor,
      duration: b.slot?.duration,
      category: b.slot?.category,
      status: b.sessionStatus,
      otherUser: userRole === 'learner' ? b.coach : b.learner
    }));

    const processedSlots: UnifiedSession[] = slots
      .filter(s => s.status === 'available')
      .map(s => ({
        id: s.id,
        type: 'slot',
        title: s.title,
        startTime: s.startTime,
        endTime: s.endTime,
        duration: s.duration,
        category: s.category,
        status: 'available',
        capacity: {
          current: s.currentParticipants,
          max: s.maxParticipants
        }
      }));

    return [...processedBookings, ...processedSlots]
      .filter(s => new Date(s.startTime) > new Date())
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, limit);
  }, [userRole, sessionData?.user?.id, limit]);

  const { data: unifiedData, loading: isLoading, error, refetch } = useApi(fetchData, { immediate: true });

  useEffect(() => {
    if (unifiedData) {
      setSessions(unifiedData);
    }
  }, [unifiedData]);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        setHasTimedOut(true);
      }, 10000); // 10 second timeout

      return () => clearTimeout(timeout);
    } else {
      setHasTimedOut(false);
    }
  }, [isLoading]);

  const getTimeUntilSession = (scheduledFor: string | Date) => {
    const now = new Date();
    const sessionTime = new Date(scheduledFor);
    const minutesUntil = differenceInMinutes(sessionTime, now);
    
    if (minutesUntil < 0) return 'Session started';
    if (minutesUntil < 60) return `${minutesUntil} minutes`;
    if (minutesUntil < 1440) return `${Math.floor(minutesUntil / 60)} hours`;
    return `${Math.floor(minutesUntil / 1440)} days`;
  };

  const canJoinSession = (scheduledFor: string | Date) => {
    const now = new Date();
    const sessionTime = new Date(scheduledFor);
    const earlyAccess = new Date(sessionTime.getTime() - 24 * 60 * 60 * 1000); // 24 hours early for testing
    return now >= earlyAccess;
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM dd, yyyy');
  };

  if (isLoading && !hasTimedOut) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
          <CardDescription>Loading your upcoming sessions...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // If there's an error or no data, show empty state
  if (error || (!isLoading && sessions.length === 0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Upcoming Sessions</span>
          </CardTitle>
          <CardDescription>
            Your next {userRole === 'learner' ? 'learning' : 'coaching'} sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No upcoming sessions
            </h3>
            <p className="text-gray-600 mb-4">
              {userRole === 'learner' 
                ? "You don't have any upcoming learning sessions. Browse coaches to book your next session."
                : "You don't have any upcoming coaching sessions or open slots. Create session slots to start teaching."
              }
            </p>
            <Button
              className="cursor-pointer"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                router.push(userRole === 'learner' ? ROUTES.LEARNER.EXPLORE : ROUTES.COACH.CREATE_SESSION);
              }}
            >
              {userRole === 'learner' ? 'Browse Coaches' : 'Create Session'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span>Upcoming Sessions</span>
          </CardTitle>
          <CardDescription>Unable to load your upcoming sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Failed to load sessions
            </h3>
            <p className="text-gray-600 mb-4">
              There was an error loading your upcoming sessions. Please try again.
            </p>
            <Button 
              variant="outline"
              onClick={() => refetch()}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Upcoming Sessions</span>
            </CardTitle>
            <CardDescription>
              Your next {userRole === 'learner' ? 'learning' : 'coaching'} sessions
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer"
            style={{ cursor: 'pointer' }}
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => {
              const sessionDate = new Date(session.startTime);
              const canJoin = session.type === 'booking' && canJoinSession(session.startTime);
              
              return (
                <div key={session.id} className="flex items-center space-x-4 p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0 flex items-center space-x-4">
                    {session.type === 'booking' ? (
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={session.otherUser?.profileImage} alt={session.otherUser?.firstName} />
                        <AvatarFallback className="bg-muted">
                          <GraduationCap className="h-6 w-6 text-slate-600" />
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Video className="h-6 w-6 text-blue-600" />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium truncate">{session.title}</h4>
                        <Badge variant={session.type === 'booking' ? 'outline' : 'default'} className={`text-[9px] font-black uppercase tracking-widest ${
                          session.type === 'slot' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : ''
                        }`}>
                          {session.type === 'slot' ? 'Available' : (session.category || 'Mentorship')}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {session.type === 'booking' 
                          ? `With ${session.otherUser?.firstName} ${session.otherUser?.lastName}`
                          : `${session.capacity?.current} / ${session.capacity?.max} Seats remaining`
                        }
                      </p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{getDateLabel(sessionDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{format(sessionDate, 'h:mm a')}</span>
                        </div>
                        {session.duration && (
                          <div className="flex items-center space-x-1">
                            <span>{session.duration} min</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <Badge 
                      variant={(canJoin || session.type === 'slot') ? "default" : "secondary"}
                      className={(canJoin || session.type === 'slot') ? "bg-green-50 text-green-700 border-green-100" : "cursor-default"}
                    >
                      {getTimeUntilSession(session.startTime)}
                    </Badge>
                    
                    {session.type === 'booking' ? (
                      canJoin ? (
                        <Button 
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-lg shadow-blue-100"
                          onClick={() => {
                            router.push(ROUTES.SESSION.ROOM(session.id));
                          }}
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Join Live
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled className="opacity-50">
                          <Clock className="h-4 w-4 mr-2" />
                          Waiting
                        </Button>
                      )
                    ) : (
                      <Button 
                        size="sm"
                        variant="outline"
                        className="hover:bg-blue-50 hover:text-blue-600 border-blue-100"
                        onClick={() => router.push(ROUTES.COACH.MY_SESSIONS)}
                      >
                        Manage Slot
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
            
            {sessions.length >= limit && (
              <div className="pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="w-full cursor-pointer"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    router.push(userRole === 'learner' ? ROUTES.LEARNER.MY_SESSIONS : ROUTES.COACH.MY_SESSIONS);
                  }}
                >
                  View All Sessions
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 cursor-default">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4 cursor-pointer" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No upcoming sessions
            </h3>
            <p className="text-gray-600 mb-4">
              {userRole === 'learner' 
                ? "You don't have any upcoming learning sessions. Browse coaches to book your next session."
                : "You don't have any upcoming coaching sessions or open slots. Create session slots to start teaching."
              }
            </p>
            <Button
              className="cursor-pointer"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                router.push(userRole === 'learner' ? ROUTES.LEARNER.EXPLORE : ROUTES.COACH.CREATE_SESSION);
              }}
            >
              {userRole === 'learner' ? 'Browse Coaches' : 'Create Session'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
