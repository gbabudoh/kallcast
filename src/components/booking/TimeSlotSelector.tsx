'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, Users, Check } from 'lucide-react';
import { format, isSameDay, isToday, isTomorrow } from 'date-fns';
import { cn } from '@/lib/utils';
import { TimeSlot } from '@/types/slot';

interface TimeSlotSelectorProps {
  coachId: string;
  onSlotSelect: (slot: TimeSlot) => void;
  selectedSlot?: TimeSlot | null;
}

export default function TimeSlotSelector({ 
  coachId, 
  onSlotSelect, 
  selectedSlot 
}: TimeSlotSelectorProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/slots?coachId=${coachId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch available slots');
        }
        
        const data = await response.json();
        setSlots(data.slots || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load slots');
      } finally {
        setIsLoading(false);
      }
    };

    if (coachId) {
      fetchSlots();
    }
  }, [coachId]);

  const getSlotsForDate = (date: Date) => {
    return slots.filter(slot => 
      isSameDay(new Date(slot.startTime), date) && 
      slot.isAvailable
    );
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEEE, MMM dd');
  };

  const formatTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

  const isDateDisabled = (date: Date) => {
    return date < new Date() || getSlotsForDate(date).length === 0;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Select Time Slot</CardTitle>
          <CardDescription>Loading available sessions...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Select Time Slot</CardTitle>
          <CardDescription>Error loading slots</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const availableSlots = getSlotsForDate(selectedDate);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Time Slot</CardTitle>
        <CardDescription>
          Choose your preferred date and time for the session
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Picker */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? getDateLabel(selectedDate) : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                disabled={isDateDisabled}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Available Time Slots */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Available Times for {getDateLabel(selectedDate)}
          </label>
          
          {availableSlots.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableSlots.map((slot) => (
                <Button
                  key={slot.id}
                  variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                  className={cn(
                    "h-auto p-4 flex flex-col items-start space-y-2",
                    selectedSlot?.id === slot.id && "ring-2 ring-primary"
                  )}
                  onClick={() => onSlotSelect(slot)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">
                        {formatTime(new Date(slot.startTime))} - {formatTime(new Date(slot.endTime))}
                      </span>
                    </div>
                    {selectedSlot?.id === slot.id && (
                      <Check className="h-4 w-4" />
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{slot.currentParticipants}/{slot.maxParticipants}</span>
                    </div>
                    <div className="font-semibold text-primary">
                      ${slot.price}
                    </div>
                  </div>
                  
                  {slot.currentParticipants === slot.maxParticipants - 1 && (
                    <Badge variant="secondary" className="text-xs">
                      Only 1 spot left!
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No available slots
              </h3>
              <p className="text-gray-600">
                {isToday(selectedDate) 
                  ? "No sessions available today. Try selecting another date."
                  : `No sessions available on ${getDateLabel(selectedDate)}. Try selecting another date.`
                }
              </p>
            </div>
          )}
        </div>

        {/* Selected Slot Summary */}
        {selectedSlot && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium text-primary mb-2">Selected Session</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{getDateLabel(selectedDate)}</span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span>
                  {formatTime(new Date(selectedSlot.startTime))} - {formatTime(new Date(selectedSlot.endTime))}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>{selectedSlot.duration} minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Participants:</span>
                <span>{selectedSlot.currentParticipants}/{selectedSlot.maxParticipants}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Price:</span>
                <span>${selectedSlot.price}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
