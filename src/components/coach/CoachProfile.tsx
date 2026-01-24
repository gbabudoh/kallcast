'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Calendar, MessageCircle, Award, Timer, CheckCircle2, Sparkles, Clock, Target } from 'lucide-react';
import { CoachProfile as CoachProfileType, TimeSlot } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function CoachProfile() {
  const params = useParams();
  const router = useRouter();
  const [coach, setCoach] = useState<CoachProfileType | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoachProfile = async () => {
      try {
        const response = await fetch(`/api/coaches/${params.coachId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch coach profile');
        }
        
        const data = await response.json();
        setCoach(data.coach);
        setAvailableSlots(data.availableSlots || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.coachId) {
      fetchCoachProfile();
    }
  }, [params.coachId]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error || !coach) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Coach not found
              </h3>
              <p className="text-gray-600">
                {error || 'The coach you are looking for does not exist.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-10">
        {/* Session Focus Header - Premium Redesign */}
        <div className="relative rounded-[2rem] bg-[#ededed] overflow-hidden shadow-2xl animate-fade-in border border-slate-200">
          {/* Animated Background Layers - Subtler for Light Theme */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 animate-gradient"></div>
          <div className="absolute inset-0 bg-grid-slate-200/50 pointer-events-none opacity-30"></div>
          
          <div className="relative px-6 py-10 md:px-12 md:py-14">
            <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start">
              <div className="flex-1 space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center space-x-3 bg-blue-50/50 backdrop-blur-md px-4 py-2 rounded-xl border border-blue-100 shadow-sm animate-float">
                  <div className="bg-blue-500/10 p-1.5 rounded-lg">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-blue-700 text-[10px] font-bold uppercase tracking-[0.2em]">Premium coaching</span>
                </div>

                <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{coach.sessionTitle || `Accelerate Your Success with ${coach.firstName}`}</span>
                </h1>

                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  {(coach.sessionGains || ['Personalized guidance', 'Industry insights', 'Career growth']).map((gain, i) => (
                    <div key={i} className="flex items-center bg-white/60 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-100 shadow-sm hover-lift group/gain">
                      <div className="bg-green-500/10 p-1 rounded-lg mr-3 group-hover/gain:scale-110 transition-transform">
                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                      </div>
                      <span className="text-slate-600 text-sm font-semibold">{gain}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap justify-center lg:justify-start gap-10 pt-4">
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] mb-1">Market Investment</span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-4xl font-black text-slate-900">${coach.hourlyRate}</span>
                      <span className="text-base text-slate-400 font-bold italic">/ hr</span>
                    </div>
                  </div>
                  <div className="flex flex-col border-l border-slate-200 pl-10">
                    <span className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] mb-1">Status</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-glow"></div>
                      <span className="text-2xl font-black text-green-600">Slots Today</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-[320px] w-full animate-slide-in-right">
                <Card className="border border-slate-200 bg-white/80 backdrop-blur-xl text-slate-900 shadow-2xl overflow-hidden rounded-[2rem]">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        <Avatar className="h-16 w-16 ring-3 ring-white relative">
                          <AvatarImage src={coach.profileImage} alt={`${coach.firstName} ${coach.lastName}`} className="object-cover" />
                          <AvatarFallback className="text-xl bg-slate-100 text-slate-400 font-bold">
                            {coach.firstName[0]}{coach.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900">{coach.firstName} {coach.lastName}</h4>
                        <div className="flex items-center text-slate-500 font-bold text-[10px] uppercase tracking-wider mt-1">
                          <span className="text-blue-600 mr-2">{coach.title}</span>
                          <span>@ {coach.company}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center text-amber-500 mb-0.5">
                          <Star className="w-3 h-3 fill-amber-500 mr-1.5" />
                          <span className="font-black text-slate-900 text-sm">{coach.averageRating?.toFixed(1) || '5.0'}</span>
                        </div>
                        <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider">{coach.totalSessions || 0} Sessions</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center text-blue-600 mb-0.5">
                          <Timer className="w-3 h-3 mr-1.5" />
                          <span className="font-black text-slate-900 text-sm">{coach.responseTime ? `< ${coach.responseTime}h` : '< 2h'}</span>
                        </div>
                        <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Response</span>
                      </div>
                    </div>

                    <Button 
                      onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-7 rounded-2xl shadow-glow transition-all text-lg relative group overflow-hidden"
                    >
                      <span className="relative z-10">Secure Your Spot</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 px-2">
        <div className="lg:col-span-2 space-y-12 animate-fade-in">
          {/* Bio Section */}
          {coach.background && (
            <section className="space-y-6">
              <div className="inline-flex items-center space-x-3 bg-slate-100 px-3 py-1.5 rounded-lg text-slate-600 font-bold text-[10px] uppercase tracking-widest">
                <Target className="w-3.5 h-3.5 text-blue-500" />
                <span>Mentorship Philosophy</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 leading-tight">Empowering your journey with <span className="text-blue-600">proven expertise</span></h2>
              <p className="text-xl text-slate-600 leading-relaxed font-medium italic border-l-4 border-blue-500 pl-6 py-1">
                &ldquo;{coach.background}&rdquo;
              </p>
              {coach.bio && (
                <div className="prose prose-slate max-w-none">
                  <p className="text-base text-slate-500 leading-relaxed pl-7">
                    {coach.bio}
                  </p>
                </div>
              )}
            </section>
          )}

          {/* Specialties */}
          <section className="space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Core Expertise</h3>
            <div className="flex flex-wrap gap-3">
              {(coach.specialties || coach.expertise || []).map((skill) => (
                <Badge key={skill} className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-[13px] shadow-sm hover:shadow-md hover:border-blue-200 transition-all hover:-translate-y-0.5 cursor-default">
                  {skill}
                </Badge>
              ))}
            </div>
          </section>

          {/* Achievements Section - Gainsboro Theme */}
          {coach.coachAchievements && coach.coachAchievements.length > 0 && (
            <div className="bg-[#DCDCDC] rounded-[2rem] p-10 space-y-8 relative overflow-hidden border border-slate-300 shadow-sm">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 blur-[60px] rounded-full"></div>
              <h3 className="text-2xl font-black text-slate-900 relative flex items-center">
                <Award className="w-6 h-6 mr-3 text-amber-500" />
                Professional Milestones
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                {coach.coachAchievements.map((achievement, index) => (
                  <div key={index} className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all group hover-lift shadow-sm">
                    <div className="bg-white p-2.5 rounded-xl text-amber-500 shrink-0 mb-4 w-fit group-hover:scale-110 transition-transform shadow-sm">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base mb-1.5">{achievement.title}</h4>
                      {achievement.description && (
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">{achievement.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div id="booking-section" className="space-y-8">
          {/* Available Sessions Sidebar Card */}
          <Card className="border border-slate-200 shadow-xl overflow-hidden rounded-[2rem] sticky top-6 bg-white/80 backdrop-blur-xl">
            <CardHeader className="bg-slate-50 p-6 border-b border-slate-100">
              <div className="flex items-center justify-between mb-1.5">
                <CardTitle className="flex items-center space-x-2 text-lg font-black text-slate-900">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>Reserve Session</span>
                </CardTitle>
                <div className="bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ring-1 ring-blue-100">Fast Resp.</div>
              </div>
              <CardDescription className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                Select a slot below
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {availableSlots.length > 0 ? (
                <div className="space-y-4">
                  {availableSlots.map((slot) => (
                    <div 
                      key={slot.id} 
                      onClick={() => {
                        if (slot.isAvailable) {
                          router.push(`/booking/${slot.id}`);
                        }
                      }}
                      className={cn(
                        "group/slot border border-slate-100 bg-slate-50/50 rounded-xl p-4 transition-all",
                        slot.isAvailable ? "hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer hover:shadow-md active:scale-[0.98]" : "opacity-60 cursor-not-allowed"
                      )}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="space-y-0.5">
                          <h4 className="font-black text-slate-900 text-sm">{new Date(slot.startTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</h4>
                          <div className="text-[11px] text-slate-500 font-bold flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                            {new Date(slot.startTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <Badge variant={slot.isAvailable ? "default" : "secondary"} className={cn(
                          "px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-lg",
                          slot.isAvailable ? "bg-green-100 text-green-700 hover:bg-green-100 ring-1 ring-green-600/10" : "bg-slate-200 text-slate-500 hover:bg-slate-200"
                        )}>
                          {slot.isAvailable ? "Open" : "Booked"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="font-black text-xl text-slate-900">${slot.price}</div>
                        <Button 
                          size="sm"
                          disabled={!slot.isAvailable}
                          className="bg-slate-900 hover:bg-black text-white font-black rounded-lg px-4 h-10 shadow-md transition-transform active:scale-95 cursor-pointer"
                        >
                          Select
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Calendar className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                  <h3 className="text-lg font-black text-slate-900 mb-1">
                    Fully Booked
                  </h3>
                  <p className="text-slate-500 text-[11px] px-6 font-medium">
                    Try checking again tomorrow.
                  </p>
                </div>
              )}

              <div className="pt-5 border-t border-slate-100">
                <Button 
                  variant="outline" 
                  onClick={() => toast.success(`Starting conversation with ${coach.firstName}...`)}
                  className="w-full border-slate-200 text-slate-700 font-black py-6 rounded-xl flex items-center justify-center space-x-2.5 hover:bg-slate-50 transition-colors shadow-sm text-sm cursor-pointer active:scale-95"
                >
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                  <span>Send Message</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
}
