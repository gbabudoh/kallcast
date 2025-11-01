'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { createSlotSchema, type CreateSlotInput } from '@/validations/coach';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, Users, DollarSign } from 'lucide-react';
import { format, addMinutes } from 'date-fns';
import { cn } from '@/lib/utils';
import { SESSION_DURATIONS } from '@/constants/app';
import { VALIDATION_RULES } from '@/constants/validation';
import { APP_CONFIG } from '@/config/app';

const categories = [
  'Business Strategy',
  'Leadership Development',
  'Marketing & Sales',
  'Financial Planning',
  'Career Development',
  'Entrepreneurship',
  'Project Management',
  'Communication Skills',
  'Time Management',
  'Team Building',
  'Digital Marketing',
  'Product Management',
  'Operations',
  'Human Resources',
  'Technology',
  'Healthcare',
  'Education',
  'Real Estate',
  'Consulting',
  'Other',
];

export default function CreateSlotForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [startTime, setStartTime] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateSlotInput>({
    resolver: zodResolver(createSlotSchema),
    defaultValues: {
      maxParticipants: 1,
      duration: APP_CONFIG.SESSION.DEFAULT_DURATION,
      isRecurring: false,
    },
  });

  const isRecurring = watch('isRecurring');

  const onSubmit = async (data: CreateSlotInput) => {
    if (!startDate || !startTime) {
      toast.error('Please select a start date and time');
      return;
    }

    setIsLoading(true);
    
    try {
      // Combine date and time
      const startDateTime = new Date(`${format(startDate, 'yyyy-MM-dd')}T${startTime}`);
      
      // Calculate end time based on duration
      const endTime = addMinutes(startDateTime, data.duration);
      
      const slotData = {
        ...data,
        startTime: startDateTime,
        endTime: endTime,
      };

      const response = await fetch('/api/slots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(slotData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create slot');
      }

      toast.success('Session slot created successfully!');
      
      // Reset form
      reset();
      setStartDate(undefined);
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create slot');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5" />
          <span>Create New Session Slot</span>
        </CardTitle>
        <CardDescription>
          Set up a new coaching session that learners can book
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Session Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center space-x-2">
                <span>Session Title</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., Business Strategy Consultation"
                {...register('title')}
                disabled={isLoading}
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what learners will gain from this session..."
                {...register('description')}
                disabled={isLoading}
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => setValue('category', value)} disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Price ($)</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  min={VALIDATION_RULES.SESSION.PRICE.MIN}
                  max={VALIDATION_RULES.SESSION.PRICE.MAX}
                  placeholder="Enter price"
                  {...register('price', { valueAsNumber: true })}
                  disabled={isLoading}
                />
                {errors.price && (
                  <p className="text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Session Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Session Settings</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration" className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Duration</span>
                </Label>
                <Select 
                  value={watch('duration')?.toString()} 
                  onValueChange={(value) => setValue('duration', parseInt(value))}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {SESSION_DURATIONS.map((duration) => (
                      <SelectItem key={duration} value={duration.toString()}>
                        {duration === 60 ? '1 hour' : 
                         duration === 90 ? '1.5 hours' :
                         duration === 120 ? '2 hours' :
                         `${duration} minutes`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.duration && (
                  <p className="text-sm text-red-600">{errors.duration.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxParticipants" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Max Participants</span>
                </Label>
                <Select 
                  value={watch('maxParticipants')?.toString()} 
                  onValueChange={(value) => setValue('maxParticipants', parseInt(value))}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select max participants" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'person' : 'people'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.maxParticipants && (
                  <p className="text-sm text-red-600">{errors.maxParticipants.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Scheduling */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Schedule</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Session Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            {startDate && startTime && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Session starts:</strong> {format(startDate, "PPP")} at {startTime}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Session ends:</strong> {format(addMinutes(new Date(`${format(startDate, 'yyyy-MM-dd')}T${startTime}`), watch('duration') || 60), "PPP 'at' p")}
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating Slot...' : 'Create Session Slot'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
