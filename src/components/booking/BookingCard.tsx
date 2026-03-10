'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Clock, 
  Video, 
  User, 
  DollarSign, 
  X,
  CheckCircle
} from 'lucide-react';
import { BookingWithDetails } from '@/types/booking';
import { format } from 'date-fns';

interface BookingCardProps {
  booking: BookingWithDetails;
  onCancel?: (bookingId: string) => void;
  onJoin?: (bookingId: string) => void;
  onComplete?: (bookingId: string) => void;
  userRole: 'learner' | 'coach';
}

export default function BookingCard({ 
  booking, 
  onCancel, 
  onJoin, 
  onComplete,
  userRole 
}: BookingCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canJoin = () => {
    const now = new Date();
    const sessionStart = new Date(booking.scheduledFor);
    const earlyAccess = new Date(sessionStart.getTime() - 15 * 60 * 1000); // 15 minutes early
    
    return (
      booking.sessionStatus === 'scheduled' && 
      now >= earlyAccess && 
      booking.paymentStatus === 'paid'
    );
  };

  const canCancel = () => {
    const now = new Date();
    const sessionStart = new Date(booking.scheduledFor);
    const cancelDeadline = new Date(sessionStart.getTime() - 24 * 60 * 60 * 1000); // 24 hours before
    
    return (
      ['scheduled', 'in-progress'].includes(booking.sessionStatus) && 
      now < cancelDeadline
    );
  };

  const canComplete = () => {
    return userRole === 'coach' && booking.sessionStatus === 'in-progress';
  };

  const handleAction = async (action: string) => {
    setIsLoading(true);
    try {
      switch (action) {
        case 'join':
          if (onJoin) onJoin(booking.id);
          break;
        case 'cancel':
          if (onCancel) onCancel(booking.id);
          break;
        case 'complete':
          if (onComplete) onComplete(booking.id);
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage 
                src={userRole === 'learner' ? booking.coach.profileImage : booking.learner.profileImage} 
                alt={userRole === 'learner' ? booking.coach.firstName : booking.learner.firstName} 
              />
              <AvatarFallback>
                {userRole === 'learner' 
                  ? `${booking.coach.firstName[0]}${booking.coach.lastName[0]}`
                  : `${booking.learner.firstName[0]}${booking.learner.lastName[0]}`
                }
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg">
                {booking.slot.title}
              </CardTitle>
              <CardDescription className="flex items-center space-x-2 mt-1">
                <User className="h-4 w-4" />
                <span>
                  {userRole === 'learner' 
                    ? `with ${booking.coach.firstName} ${booking.coach.lastName}`
                    : `with ${booking.learner.firstName} ${booking.learner.lastName}`
                  }
                </span>
              </CardDescription>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <Badge className={getStatusColor(booking.sessionStatus)}>
              {booking.sessionStatus.replace('-', ' ')}
            </Badge>
            <Badge variant="outline" className={getPaymentStatusColor(booking.paymentStatus)}>
              {booking.paymentStatus}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Session Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>{format(new Date(booking.scheduledFor), 'MMM dd, yyyy')}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{format(new Date(booking.scheduledFor), 'h:mm a')}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{booking.slot.duration} minutes</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span>${booking.amount}</span>
          </div>
        </div>

        {/* Session Description */}
        {booking.slot.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {booking.slot.description}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          {canJoin() && (
            <Button 
              onClick={() => handleAction('join')}
              disabled={isLoading}
              className="flex-1"
            >
              <Video className="h-4 w-4 mr-2" />
              Join Session
            </Button>
          )}
          
          {canCancel() && (
            <Button 
              variant="outline"
              onClick={() => handleAction('cancel')}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          )}
          
          {canComplete() && (
            <Button 
              onClick={() => handleAction('complete')}
              disabled={isLoading}
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Session
            </Button>
          )}
          
          {booking.sessionStatus === 'completed' && !booking.isReviewed && userRole === 'learner' && (
            <Button 
              variant="outline"
              className="flex-1"
              onClick={() => {
                // Navigate to review page
                window.location.href = `/review/${booking.id}`;
              }}
            >
              Leave Review
            </Button>
          )}
        </div>

        {/* Cancellation Info */}
        {booking.sessionStatus === 'cancelled' && booking.cancellationReason && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">
              <strong>Cancelled:</strong> {booking.cancellationReason}
            </p>
            {booking.cancelledAt && (
              <p className="text-xs text-red-600 mt-1">
                Cancelled on {format(new Date(booking.cancelledAt), 'MMM dd, yyyy h:mm a')}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
