'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Clock, 
  CreditCard,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Star,
  Sparkles,
  Shield as ShieldIcon,
  Lock as LockIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { ROUTES } from '@/constants/routes';

interface SlotDetails {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  maxParticipants: number;
  currentParticipants: number;
  startTime: string;
  endTime: string;
  category: string;
  coachId: {
    _id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
    hourlyRate: number;
    averageRating: number;
  };
}

export default function BookingFlow() {
  const params = useParams();
  const router = useRouter();
  const [slot, setSlot] = useState<SlotDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchSlotDetails = async () => {
      try {
        const response = await fetch(`/api/slots/${params.slotId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch slot details');
        }
        
        const data = await response.json();
        setSlot(data.slot);
      } catch {
        toast.error('Failed to load session details');
        router.push(ROUTES.LEARNER.EXPLORE);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.slotId) {
      fetchSlotDetails();
    }
  }, [params.slotId, router]);

  const handleBookSession = async () => {
    if (!slot) return;

    setIsBooking(true);
    
    try {
      // Create Stripe checkout session
      const response = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slotId: slot._id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create checkout session');
      }

      const { checkoutUrl } = await response.json();
      
      // Redirect to Stripe checkout
      window.location.href = checkoutUrl;
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to start booking process');
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!slot) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Session not found
              </h3>
              <p className="text-gray-600 mb-6">
                The session you&apos;re looking for doesn&apos;t exist or is no longer available.
              </p>
              <Button onClick={() => router.push(ROUTES.LEARNER.EXPLORE)}>
                Browse Other Sessions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isAvailable = slot.currentParticipants < slot.maxParticipants;

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.back()}
            className="text-slate-500 hover:text-slate-900 font-bold text-xs uppercase tracking-widest cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <div className="text-right">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Reserve Session</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Step 1 of 2: Review</p>
          </div>
        </div>

        {/* Session Details */}
        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white/70 backdrop-blur-xl">
          <div className="h-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"></div>
          <CardHeader className="p-8 pb-4">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25"></div>
                <Avatar className="h-20 w-20 rounded-2xl ring-4 ring-white relative">
                  <AvatarImage src={slot.coachId.profileImage} alt={`${slot.coachId.firstName} ${slot.coachId.lastName}`} className="object-cover" />
                  <AvatarFallback className="text-xl bg-slate-100 text-slate-400 font-bold">
                    {slot.coachId.firstName[0]}{slot.coachId.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-1 text-center md:text-left space-y-2">
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-2">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-none font-bold text-[10px] uppercase tracking-widest px-2.5 py-0.5">
                    {slot.category}
                  </Badge>
                  <div className="flex items-center bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500 mr-1.5" />
                    {slot.coachId.averageRating}
                  </div>
                </div>
                <CardTitle className="text-2xl font-black text-slate-900 leading-tight">{slot.title}</CardTitle>
                <CardDescription className="text-slate-500 font-medium text-base">
                  Mentorship session with <span className="text-slate-900 font-bold">{slot.coachId.firstName} {slot.coachId.lastName}</span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8 pt-4 space-y-8">
            {/* Session Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass-light p-4 rounded-2xl border border-slate-100 flex items-center space-x-4">
                <div className="bg-white p-2.5 rounded-xl shadow-sm">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Date</p>
                  <p className="font-bold text-slate-900 leading-tight">
                    {new Date(slot.startTime).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
              
              <div className="glass-light p-4 rounded-2xl border border-slate-100 flex items-center space-x-4">
                <div className="bg-white p-2.5 rounded-xl shadow-sm">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Time & Duration</p>
                  <p className="font-bold text-slate-900 leading-tight">
                    {new Date(slot.startTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} • {slot.duration} min
                  </p>
                </div>
              </div>
            </div>

            {/* Description Card */}
            {slot.description && (
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Session Focus</h4>
                <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {slot.description}
                  </p>
                </div>
              </div>
            )}

            {/* Inclusion List */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Premium Features Included</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Live 4K Video Session',
                  'Interactive Whiteboard',
                  'Post-Session Recording',
                  'Collaboration Chat'
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3 text-slate-600 font-bold text-xs">
                    <div className="bg-green-500/10 p-1 rounded-full">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-slate-900 text-white relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[60px] rounded-full"></div>
          <CardHeader className="p-8">
            <CardTitle className="text-xl font-black flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-blue-400" />
              <span>Investment Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-slate-400 text-sm font-bold">Standard Session Fee</span>
                <span className="text-white text-lg font-black">${slot.price}</span>
              </div>
              <div className="flex justify-between items-center text-xs px-2">
                <span className="text-slate-500 font-bold uppercase tracking-widest">Platform Processing</span>
                <span className="text-slate-400 font-bold">Included</span>
              </div>
              <div className="h-px bg-white/10 mx-2"></div>
              <div className="flex justify-between items-center px-2">
                <span className="text-white text-lg font-black">Total Investment</span>
                <span className="text-3xl font-black text-blue-400">${slot.price}</span>
              </div>
            </div>

            <Button 
              onClick={handleBookSession}
              disabled={!isAvailable || isBooking}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-8 rounded-2xl shadow-glow transition-all text-xl relative group overflow-hidden cursor-pointer"
            >
              {isBooking ? (
                'Processing Secured Connection...'
              ) : !isAvailable ? (
                'Capacity Full'
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-3 text-blue-200 animate-pulse" />
                  Confirm & Reserve Now
                </>
              )}
            </Button>

            <div className="flex items-center justify-center space-x-4 text-slate-500">
              <div className="flex items-center space-x-1.5">
                <ShieldIcon className="h-3 w-3" />
                <span className="text-[10px] font-bold uppercase tracking-widest">PCI Secure</span>
              </div>
              <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
              <div className="flex items-center space-x-1.5">
                <LockIcon className="h-3 w-3" />
                <span className="text-[10px] font-bold uppercase tracking-widest">SSL Encrypted</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          By continuing, you agree to the <span className="text-blue-500">Terms of Acceleration</span>
        </p>
      </div>
    </div>
  );
}
