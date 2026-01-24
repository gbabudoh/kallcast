'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  ArrowRight, 
  GraduationCap,
  MessageSquare,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { useApi } from '@/hooks';
import { BookingWithDetails } from '@/types/booking';
import { ROUTES } from '@/constants/routes';

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  profileImage?: string;
  totalSessions: number;
  lastSession: Date;
  joinedAt: Date;
}

export default function CoachStudentsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>([]);

  const fetchBookings = useCallback(async () => {
    const response = await fetch(`/api/bookings?role=coach&type=all`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch students');
    }
    return response.json();
  }, []);

  const { data: bookingsData, loading: isLoading } = useApi(fetchBookings, { immediate: true });

  useEffect(() => {
    if (bookingsData?.bookings) {
      const studentMap = new Map<string, Student>();

      bookingsData.bookings.forEach((booking: BookingWithDetails) => {
        const studentData = booking.learner;
        if (!studentData) return;

        const studentId = studentData._id.toString();
        const existing = studentMap.get(studentId);

        if (existing) {
          existing.totalSessions += 1;
          if (new Date(booking.scheduledFor) > new Date(existing.lastSession)) {
            existing.lastSession = new Date(booking.scheduledFor);
          }
        } else {
          studentMap.set(studentId, {
            _id: studentId,
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            email: studentData.email,
            profileImage: studentData.profileImage,
            totalSessions: 1,
            lastSession: new Date(booking.scheduledFor),
            joinedAt: new Date(booking.createdAt || booking.scheduledFor), // Use createdAt if available
          });
        }
      });

      setStudents(Array.from(studentMap.values()).sort((a, b) => b.lastSession.getTime() - a.lastSession.getTime()));
    }
  }, [bookingsData]);

  const filteredStudents = students.filter(student => 
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 mb-8 shadow-2xl">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10">
          <Button 
            variant="ghost" 
            className="mb-4 text-blue-100 hover:text-white hover:bg-white/10 cursor-pointer"
            onClick={() => router.push(ROUTES.DASHBOARD.COACH_BASE)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center cursor-pointer">
                <Users className="w-6 h-6 text-white cursor-pointer" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">My Students</h1>
                <p className="text-blue-100 text-lg">Manage and track your learners</p>
              </div>
            </div>
            
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-100" />
              <Input 
                placeholder="Search students..." 
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg border-b-4 border-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Students</p>
                <p className="text-3xl font-black text-slate-900 mt-1">{students.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg border-b-4 border-purple-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Active This Month</p>
                <p className="text-3xl font-black text-slate-900 mt-1">
                  {students.filter(s => s.lastSession > new Date(Date.now() - 30 * 24 * 3600 * 1000)).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg border-b-4 border-emerald-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Student Growth</p>
                <p className="text-3xl font-black text-slate-900 mt-1">+12%</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
        <CardHeader>
          <CardTitle>Learner Directory</CardTitle>
          <CardDescription>View and contact students who have booked with you</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4 animate-pulse p-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-slate-500 text-sm uppercase tracking-wider">
                    <th className="pb-4 font-bold">Learner</th>
                    <th className="pb-4 font-bold">Sessions</th>
                    <th className="pb-4 font-bold">Last Active</th>
                    <th className="pb-4 font-bold">Joined</th>
                    <th className="pb-4 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredStudents.map((student) => (
                    <tr key={student._id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10 border-2 border-white shadow-sm cursor-pointer">
                            <AvatarImage src={student.profileImage} className="cursor-pointer" />
                            <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold cursor-pointer">
                              {student.firstName[0]}{student.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer">
                              {student.firstName} {student.lastName}
                            </p>
                            <p className="text-xs text-slate-500 cursor-pointer">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 font-medium cursor-pointer">
                          {student.totalSessions} sessions
                        </Badge>
                      </td>
                      <td className="py-4">
                        <p className="text-sm font-medium text-slate-700 cursor-pointer">
                          {format(student.lastSession, 'MMM dd, yyyy')}
                        </p>
                      </td>
                      <td className="py-4 text-sm text-slate-500 cursor-pointer">
                        {format(student.joinedAt, 'MMM yyyy')}
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 cursor-pointer" title="Send Message">
                            <MessageSquare className="w-4 h-4 cursor-pointer" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 cursor-pointer" title="View History">
                            <ArrowRight className="w-4 h-4 cursor-pointer" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No students yet</h3>
              <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                When learners book your sessions, they will appear here for you to track and manage.
              </p>
              <Button 
                className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 cursor-pointer"
                onClick={() => router.push(ROUTES.COACH.MY_SESSIONS)}
              >
                Create More Slots
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
