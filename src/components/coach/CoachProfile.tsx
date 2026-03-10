'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MessageCircle, Award, Timer, CheckCircle2, Sparkles, Clock, Target, MapPin } from 'lucide-react';
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
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-12 pb-24 animate-fade-in">
        
        {/* Row 1: Session Focus Header - Premium Minimalism */}
        <div className="relative rounded-[3rem] bg-white overflow-hidden shadow-2xl border border-slate-100 min-h-[480px] flex items-center">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-white pointer-events-none"></div>
          <div className="relative w-full px-8 py-12 md:px-20 md:py-16">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="flex-1 space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-blue-700 text-[10px] font-black uppercase tracking-widest">Premium Mentorship</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.95] tracking-tighter">
                  {coach.sessionTitle || `Accelerate Your Success with ${coach.firstName}`}
                </h1>

                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  {(coach.sessionGains || ['Personalized guidance', 'Industry insights', 'Career growth']).map((gain, i) => (
                    <div key={i} className="flex items-center bg-white px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm transition-transform hover:scale-105">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mr-2.5 shrink-0" />
                      <span className="text-slate-700 text-sm font-bold tracking-tight">{gain}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap justify-center lg:justify-start gap-12 pt-6">
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Investment Rate</span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-5xl font-black text-slate-900 tracking-tighter">${coach.hourlyRate || '0'}</span>
                      <span className="text-lg text-slate-400 font-bold italic">/ hr</span>
                    </div>
                  </div>
                  <div className="flex flex-col border-l border-slate-100 pl-12">
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Availability</span>
                    <div className="text-3xl font-black text-green-600 tracking-tighter">{availableSlots.length} Slots Today</div>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-[380px] w-full animate-slide-in-right">
                <Card className="border border-slate-100 bg-white shadow-2xl overflow-hidden rounded-[3rem]">
                  <CardContent className="p-10 space-y-8">
                    <div className="flex items-center space-x-6">
                      <Avatar className="h-24 w-24 relative rounded-[2rem] shadow-xl overflow-hidden">
                        <AvatarImage src={coach.profileImage ?? undefined} alt={`${coach.firstName} ${coach.lastName}`} className="object-cover" />
                        <AvatarFallback className="text-3xl bg-transparent text-slate-900 font-black">
                          {coach.firstName[0]}{coach.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <h4 className="text-2xl font-black text-slate-900 tracking-tighter leading-none mb-2">{coach.firstName} {coach.lastName}</h4>
                        <div className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">{coach.title || 'Professional Coach'}</div>
                        {coach.company && <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">@ {coach.company}</div>}
                      </div>
                    </div>

                    {coach.location && (
                      <div className="flex items-center text-slate-500 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100 w-fit">
                        <MapPin className="w-4 h-4 mr-2.5 text-slate-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{coach.location}</span>
                      </div>
                    )}

                    <Button 
                      onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
                      className="w-full bg-slate-900 hover:bg-black text-white font-black py-8 rounded-[1.5rem] shadow-xl transition-all active:scale-95 text-base border-t border-white/10"
                    >
                      Secure Your Spot Today
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Bio - Expansive Flow */}
        {coach.background && (
          <section className="bg-white rounded-[3rem] p-12 md:p-16 border border-slate-100 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-slate-50/50 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="relative space-y-10">
              <div className="inline-flex items-center space-x-3 bg-slate-50 px-6 py-3 rounded-2xl text-slate-500 font-black text-xs uppercase tracking-[0.3em] border border-slate-100">
                <Target className="w-5 h-5 text-blue-600" />
                <span>About the Coach</span>
              </div>
              <div className="space-y-8 max-w-5xl">
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1] tracking-tight">
                  {coach.background}
                </h2>
                {coach.bio && (
                  <p className="text-xl md:text-2xl text-slate-500 leading-relaxed font-medium opacity-90">
                    {coach.bio}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Row 3: Horizontal Triptych (Booking & Social) */}
        <section id="booking-section" className="space-y-8">
          <div className="flex items-center justify-between px-4">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] flex items-center">
               <Calendar className="w-5 h-5 mr-3 text-blue-600" />
               Reserve Your Session
             </h3>
          </div>

          {availableSlots.length > 0 ? (
            <div className="space-y-8">
              {availableSlots.map((slot) => (
                <div key={slot.id} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                  {/* Frame 1: Narrative Anchor - Target Outcome (Dark Theme) */}
                  <div className="bg-slate-900 rounded-[3rem] p-10 border border-slate-800 shadow-2xl flex flex-col justify-between space-y-12 relative overflow-hidden group/target">
                    {/* Premium Ambient Background */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 blur-[60px] rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

                    <div className="space-y-8 relative">
                      <div className="space-y-4">
                        <h3 className="text-3xl font-black text-white tracking-tighter leading-none">Target Outcome</h3>
                        <Badge className="bg-blue-600 text-white border-none font-black uppercase tracking-[0.2em] text-[10px] px-5 py-2 rounded-full shadow-lg w-fit transition-transform group-hover/target:scale-110">
                          High Impact
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <p className="text-[11px] text-blue-400 font-black uppercase tracking-[0.4em]">Your Roadmap to Excellence</p>
                        <div className="h-1 w-12 bg-blue-500/30 rounded-full"></div>
                        <p className="text-sm text-slate-400 font-medium leading-relaxed opacity-90 max-w-[240px]">
                          Solve your complex challenges with tailored mentorship and expert guidance.
                        </p>
                      </div>
                    </div>

                    <div className="pt-10 border-t border-slate-800/50 space-y-2 relative">
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Status Anchor</p>
                      <div className="flex items-center space-x-2 text-white font-black text-xs uppercase tracking-widest">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Verified Mentorship</span>
                      </div>
                    </div>
                  </div>

                  {/* Frame 2: Slot Details & Programme Context */}
                  <div 
                    onClick={() => slot.isAvailable && router.push(`/booking/${slot.id}`)}
                    className={cn(
                      "rounded-[3rem] border-2 p-10 flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden group/slot",
                      slot.isAvailable 
                        ? "border-blue-500 bg-white shadow-2xl scale-[1.02] z-10" 
                        : "border-slate-50 bg-slate-50 opacity-40 cursor-not-allowed"
                    )}
                  >
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em] mb-1">Programme Details</p>
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-[1.1]">
                          {slot.title || 'Leadership Development Programme'}
                        </h4>
                      </div>

                      <div className="space-y-4 pt-6 border-t border-slate-50">
                        <div className="text-3xl font-black text-slate-900 tracking-tighter">
                          {new Date(slot.startTime).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
                        </div>
                        <div className="flex items-center space-x-8">
                          <div className="flex items-center text-slate-600 font-black text-lg tracking-tight">
                            <Clock className="w-5 h-5 mr-2.5 text-blue-500" />
                            {new Date(slot.startTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="flex items-center text-slate-600 font-black text-lg tracking-tight">
                            <Timer className="w-5 h-5 mr-1 text-blue-500" />
                            {slot.duration} min
                          </div>
                        </div>
                        <Badge className={cn(
                          "mt-4 px-4 py-1.5 font-black uppercase tracking-widest text-[10px] rounded-lg border-none shadow-sm",
                          slot.isAvailable ? "bg-green-500 text-white" : "bg-slate-200 text-slate-500"
                        )}>
                          {slot.isAvailable ? "Open Status" : "Booked"}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-8 border-t border-slate-50 mt-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Investment</span>
                        <span className="text-4xl font-black text-slate-900 tracking-tighter">${slot.price}</span>
                      </div>
                      <Button className="bg-slate-900 text-white font-black px-10 py-7 rounded-2xl text-sm transition-transform group-hover/slot:scale-105 active:scale-95 shadow-lg">Select</Button>
                    </div>
                  </div>

                  {/* Frame 3: Social Proof */}
                  <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-lg flex flex-col justify-between">
                    <div className="space-y-2">
                      <p className="text-xl font-black text-slate-900 tracking-tight">Satisfied learners</p>
                      <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em]">Trusted by the community</p>
                    </div>
                    <div className="flex items-center justify-between pt-8">
                      <div className="flex -space-x-4">
                        {['A', 'B', 'C', 'D'].map(char => (
                          <div key={char} className="h-14 w-14 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-lg font-black text-slate-400 shadow-xl">
                            {char}
                          </div>
                        ))}
                        <div className="h-14 w-14 rounded-full border-4 border-white bg-blue-600 flex items-center justify-center text-sm font-black text-white shadow-2xl relative">
                          <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-400" />
                          +12
                        </div>
                      </div>
                      <div 
                        onClick={() => toast.info(`Direct messaging with ${coach.firstName} is currently being established. Check back soon!`)}
                        className="bg-blue-50 p-4 rounded-2xl text-blue-600 shadow-sm border border-blue-100 cursor-pointer hover:bg-blue-600 hover:text-white hover:scale-110 active:scale-95 transition-all group/msg"
                      >
                        <MessageCircle className="w-7 h-7 group-hover/msg:animate-bounce" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[3.5rem] border border-slate-100 shadow-xl">
              <Calendar className="h-16 w-16 text-slate-200 mx-auto mb-6" />
              <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">Fully Booked</h3>
              <p className="text-slate-400 font-bold text-lg">Check back tomorrow for fresh openings.</p>
            </div>
          )}
        </section>

        {/* Row 4: Professional Milestones */}
        {coach.coachAchievements && Array.isArray(coach.coachAchievements) && coach.coachAchievements.length > 0 && (
          <section className="bg-white rounded-[3.5rem] p-16 space-y-16 border border-slate-100 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/20 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
            
            <div className="flex items-center justify-between relative">
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 flex items-center tracking-tighter">
                <Award className="w-10 h-10 mr-6 text-blue-600" />
                Professional Milestones
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative">
              {coach.coachAchievements.map((achievement, index) => (
                <div key={index} className="bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100 hover:border-blue-200 hover:bg-white transition-all group shadow-sm flex flex-col justify-between min-h-[220px]">
                  <div className="space-y-4">
                    <div className="w-10 h-1 bg-blue-500 rounded-full mb-6 group-hover:w-16 transition-all"></div>
                    <h4 className="font-black text-slate-900 text-2xl leading-[1.1] tracking-tight">{achievement.title}</h4>
                    {achievement.description && (
                      <p className="text-lg text-slate-500 leading-relaxed font-medium opacity-80">{achievement.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Row 5: Expertise Section - Bottom Weighted */}
        <section className="bg-white rounded-[3.5rem] p-16 border border-slate-100 shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-10">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 p-4 rounded-2xl shadow-sm">
                <Sparkles className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.5em]">Core Expertise</h3>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 max-w-4xl">
              {(coach.specialties || coach.expertise || []).map((skill) => (
                <Badge 
                  key={skill} 
                  className="bg-slate-50 border border-slate-100 text-slate-600 px-8 py-5 rounded-[2rem] font-black text-lg shadow-sm hover:bg-white hover:border-blue-300 hover:scale-105 transition-all cursor-default"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
