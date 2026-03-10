'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { createSlotFormSchema, type CreateSlotFormInput } from '@/validations/coach';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, DollarSign, X, Users, AlertCircle, Sparkles } from 'lucide-react';
import { format, addMinutes, eachDayOfInterval } from 'date-fns';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const categories = [
  'Business Strategy', 'Leadership Development', 'Marketing & Sales',
  'Financial Planning', 'Career Development', 'Entrepreneurship',
  'Project Management', 'Communication Skills', 'Time Management', 'Other'
];

interface CreateSlotFormProps {
  initialData?: Partial<CreateSlotFormInput> & { id?: string; startTime?: Date; status?: string };
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateSlotForm({ initialData, onSuccess, onClose }: CreateSlotFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialData?.startTime ? new Date(initialData.startTime) : undefined
  );
  const [endDate, setEndDate] = useState<Date>();
  const [startTime, setStartTime] = useState(
    initialData?.startTime ? format(new Date(initialData.startTime), 'HH:mm') : ''
  );
  const router = useRouter();

  const isEditMode = !!initialData?.id;

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    getValues,
    watch,
    formState: { errors },
  } = useForm<CreateSlotFormInput>({
    resolver: zodResolver(createSlotFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      category: initialData?.category || '',
      price: initialData?.price ?? undefined,
      maxParticipants: initialData?.maxParticipants ?? undefined,
      duration: initialData?.duration || 60,
      isRecurring: initialData?.isRecurring || false,
    },
  });

  const watchedPrice = watch('price');

  const handleCreateSlots = async (status: 'available' | 'blueprint') => {
    if (!startDate || !startTime) {
      toast.error('Please select a date and time', {
        icon: <AlertCircle className="h-4 w-4 text-red-500" />
      });
      return;
    }

    const isValid = await trigger();
    if (!isValid) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const formData = getValues();
    setIsLoading(true);

    try {
      if (isEditMode) {
        const startDateTime = new Date(`${format(startDate, 'yyyy-MM-dd')}T${startTime}`);
        const endTime = addMinutes(startDateTime, formData.duration);
        
        const response = await fetch(`/api/slots/${initialData.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            startTime: startDateTime,
            endTime,
            status: status || initialData.status,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update session');
        }

        toast.success('Session updated!');
      } else {
        const dates = endDate 
          ? eachDayOfInterval({ start: startDate, end: endDate })
          : [startDate];

        const slotsData = dates.map((date) => {
          const startDateTime = new Date(`${format(date, 'yyyy-MM-dd')}T${startTime}`);
          const endTime = addMinutes(startDateTime, formData.duration);
          return { ...formData, startTime: startDateTime, endTime, status };
        });
          
        const response = await fetch('/api/slots', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(slotsData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to process request');
        }

        toast.success(status === 'blueprint' ? 'Draft saved!' : 'Session published!');
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/coach/my-sessions');
        router.refresh();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.push('/coach/my-sessions');
    }
  };

  const onSubmit = () => handleCreateSlots('available');
  const onSaveBlueprint = () => handleCreateSlots('blueprint');

  return (
    <div className="bg-white rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              {isEditMode ? 'Edit Session' : 'Create Session'}
            </h1>
            <p className="text-sm text-slate-500">Configure your coaching session</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-slate-400 hover:text-slate-600 rounded-xl h-9 w-9"
          onClick={handleClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        {/* Title & Category */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-slate-700">Session Title</Label>
            <Input
              id="title"
              placeholder="e.g., Mastering Product Strategy"
              {...register('title')}
              disabled={isLoading}
              className="h-11 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
            />
            {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Category</Label>
            <Select 
              onValueChange={(value) => setValue('category', value)} 
              defaultValue={initialData?.category}
              disabled={isLoading}
            >
              <SelectTrigger className="h-11 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium text-slate-700">Description</Label>
          <Textarea
            id="description"
            placeholder="What will participants learn? What outcomes can they expect?"
            {...register('description')}
            disabled={isLoading}
            className="min-h-[80px] bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 resize-none"
          />
          {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description.message}</p>}
        </div>

        {/* Schedule Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-11 justify-start text-left rounded-xl border-slate-200 bg-slate-50 hover:bg-slate-100",
                    !startDate && "text-slate-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                  {startDate ? format(startDate, "MMM d, yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-xl" align="start">
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
            <Label className="text-sm font-medium text-slate-700">End Date <span className="text-slate-400 font-normal">(opt)</span></Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-11 justify-start text-left rounded-xl border-slate-200 bg-slate-50 hover:bg-slate-100",
                    !endDate && "text-slate-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                  {endDate ? format(endDate, "MMM d, yyyy") : "Recurring..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                <Calendar 
                  mode="single" 
                  selected={endDate} 
                  onSelect={setEndDate} 
                  disabled={(date) => date < (startDate || new Date())} 
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Start Time</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="h-11 bg-slate-50 border-slate-200 rounded-xl pl-10 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Duration</Label>
            <Select 
              onValueChange={(v) => setValue('duration', parseInt(v))} 
              defaultValue={String(initialData?.duration || 60)}
            >
              <SelectTrigger className="h-11 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {[30, 45, 60, 90, 120].map((d) => (
                  <SelectItem key={d} value={d.toString()}>{d} minutes</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Pricing Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium text-slate-700">Price (USD)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="price"
                type="number"
                {...register('price', { valueAsNumber: true })}
                className="h-11 bg-slate-50 border-slate-200 rounded-xl pl-10 font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                disabled={isLoading}
              />
            </div>
            {errors.price && <p className="text-xs text-rose-500 mt-1">{errors.price.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxParticipants" className="text-sm font-medium text-slate-700">Max Participants</Label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="maxParticipants"
                type="number"
                min={1}
                max={50}
                {...register('maxParticipants', { valueAsNumber: true })}
                className="h-11 bg-slate-50 border-slate-200 rounded-xl pl-10 font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                disabled={isLoading}
              />
            </div>
            {errors.maxParticipants && <p className="text-xs text-rose-500 mt-1">{errors.maxParticipants.message}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-5 border-t border-slate-100">
          <p className="text-sm text-slate-500">
            Potential earnings: <span className="font-semibold text-slate-800">${(watchedPrice || 0) * (watch('maxParticipants') || 1)}</span>
          </p>
          
          <div className="flex items-center gap-3">
            <Button 
              type="button"
              variant="outline"
              onClick={onSaveBlueprint}
              className="h-10 px-5 rounded-xl border-slate-200 hover:bg-slate-50"
              disabled={isLoading}
            >
              Save as Draft
            </Button>
            <Button 
              type="submit" 
              className="h-10 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                isEditMode ? 'Update Session' : 'Publish Session'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
