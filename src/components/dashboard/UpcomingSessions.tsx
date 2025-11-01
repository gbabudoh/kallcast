'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useApi } from '@/hooks';
import { 
  Calendar, 
  Clock, 
  Video, 
  User,
  ArrowRight,
  AlertCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { format, isToday, isTomorrow, differenceInMinutes } from 'date-fns';
import { BookingWithDetails } from '@/types/booking';
import { ROUTES } from '@/constants/routes';

interface UpcomingSessionsProps {
  userRole: 'learner' | 'coach';
  limit?: number;
}

export default function UpcomingSessions({ userRole, limit = 5 }: UpcomingSessionsProps) {
  const [sessions, setSessions] = useState<BookingWithDetails[]>([]);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const router = useRouter();

  const { data: bookingsData, loading: isLoading, error, refetch } = useApi(async () => {
    const response = await fetch(`/api/bookings?role=${userRole}&type=upcoming`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch upcoming sessions');
    }
    return response.json();
  }, { immediate: true, onError: () => {
    // Don't show toast for this error, just handle it silently
  }});

  useEffect(() => {
    if (bookingsData) {
      const upcomingSessions = (bookingsData.bookings || [])
        .filter((booking: any) => 
          booking.sessionStatus === 'scheduled' && 
          new Date(booking.scheduledFor) > new Date()
        )
        .sort((a: any, b: any) => 
          new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
        )
        .slice(0, limit);
      
      setSessions(upcomingSessions);
    }
  }, [bookingsData, userRole, limit]);

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
    const earlyAccess = new Date(sessionTime.getTime() - 15 * 60 * 1000); // 15 minutes early
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
  if (error || !bookingsData) {
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
                : "You don't have any upcoming coaching sessions. Create session slots to start teaching."
              }
            </p>
            <Button
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
              const otherUser = userRole === 'learner' ? session.coach : session.learner;
              const sessionDate = new Date(session.scheduledFor);
              const canJoin = canJoinSession(session.scheduledFor);
              
              return (
                <div key={session._id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={otherUser?.profileImage} alt={`${otherUser?.firstName} ${otherUser?.lastName}`} />
                    <AvatarFallback>
                      {otherUser?.firstName?.[0]}{otherUser?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium truncate">{session.slot?.title || 'Session'}</h4>
                      <Badge variant="outline" className="text-xs">
                        {session.slot?.category || 'General'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {userRole === 'learner' ? 'with' : 'with'} {otherUser?.firstName} {otherUser?.lastName}
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
                      {session.slot?.duration && (
                        <div className="flex items-center space-x-1">
                          <span>{session.slot.duration} min</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <Badge 
                      variant={canJoin ? "default" : "secondary"}
                      className={canJoin ? "bg-green-100 text-green-800" : ""}
                    >
                      {getTimeUntilSession(session.scheduledFor)}
                    </Badge>
                    
                    {canJoin ? (
                      <Button 
                        size="sm"
                        onClick={() => {
                          router.push(`/session/${session._id}/room`);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Join Session
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        <Clock className="h-4 w-4 mr-2" />
                        Not Ready
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
                  className="w-full"
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
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No upcoming sessions
            </h3>
            <p className="text-gray-600 mb-4">
              {userRole === 'learner' 
                ? "You don't have any upcoming learning sessions. Browse coaches to book your next session."
                : "You don't have any upcoming coaching sessions. Create session slots to start teaching."
              }
            </p>
            <Button
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
