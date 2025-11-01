'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  CreditCard,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

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
  const [step, setStep] = useState(1); // 1: Review, 2: Payment, 3: Confirmation

  useEffect(() => {
    const fetchSlotDetails = async () => {
      try {
        const response = await fetch(`/api/slots/${params.slotId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch slot details');
        }
        
        const data = await response.json();
        setSlot(data.slot);
      } catch (error) {
        toast.error('Failed to load session details');
        router.push('/explore');
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
                The session you're looking for doesn't exist or is no longer available.
              </p>
              <Button onClick={() => router.push('/explore')}>
                Browse Other Sessions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isAvailable = slot.currentParticipants < slot.maxParticipants;
  const spotsLeft = slot.maxParticipants - slot.currentParticipants;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Book Session</h1>
      </div>

      {/* Session Details */}
      <Card>
        <CardHeader>
          <div className="flex items-start space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={slot.coachId.profileImage} alt={`${slot.coachId.firstName} ${slot.coachId.lastName}`} />
              <AvatarFallback className="text-lg">
                {slot.coachId.firstName[0]}{slot.coachId.lastName[0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <CardTitle className="text-xl">{slot.title}</CardTitle>
              <CardDescription className="text-base">
                with {slot.coachId.firstName} {slot.coachId.lastName}
              </CardDescription>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline">{slot.category}</Badge>
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-600">★ {slot.coachId.averageRating}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Session Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium">
                  {format(new Date(slot.startTime), 'MMM dd, yyyy')}
                </p>
                <p className="text-sm text-gray-600">
                  {format(new Date(slot.startTime), 'EEEE')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium">
                  {format(new Date(slot.startTime), 'h:mm a')} - {format(new Date(slot.endTime), 'h:mm a')}
                </p>
                <p className="text-sm text-gray-600">{slot.duration} minutes</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium">
                  {slot.currentParticipants}/{slot.maxParticipants} participants
                </p>
                <p className="text-sm text-gray-600">
                  {isAvailable ? `${spotsLeft} spots left` : 'Fully booked'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium">${slot.price}</p>
                <p className="text-sm text-gray-600">per session</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {slot.description && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">About this session</h4>
                <p className="text-gray-600">{slot.description}</p>
              </div>
            </>
          )}

          {/* Availability Status */}
          {!isAvailable && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-800 font-medium">This session is fully booked</p>
              </div>
              <p className="text-red-600 text-sm mt-1">
                All spots have been taken. Please choose another session.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Booking Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Session fee</span>
              <span>${slot.price}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Platform fee (20%)</span>
              <span>${(slot.price * 0.2).toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${slot.price}</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">What's included:</p>
                <ul className="mt-1 space-y-1">
                  <li>• Live video session with {slot.coachId.firstName}</li>
                  <li>• Session recording (if enabled)</li>
                  <li>• Chat and screen sharing</li>
                  <li>• 24/7 customer support</li>
                </ul>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleBookSession}
            disabled={!isAvailable || isBooking}
            className="w-full"
            size="lg"
          >
            {isBooking ? (
              'Processing...'
            ) : !isAvailable ? (
              'Fully Booked'
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Book Session - ${slot.price}
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            You'll be redirected to our secure payment processor to complete your booking.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
