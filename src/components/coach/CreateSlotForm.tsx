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
import { CalendarIcon, Clock, DollarSign, Sparkles, Target, Zap, ArrowRight, X } from 'lucide-react';
import { format, addMinutes } from 'date-fns';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const categories = [
  'Business Strategy', 'Leadership Development', 'Marketing & Sales',
  'Financial Planning', 'Career Development', 'Entrepreneurship',
  'Project Management', 'Communication Skills', 'Time Management', 'Other'
];

export default function CreateSlotForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [startTime, setStartTime] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateSlotInput>({
    resolver: zodResolver(createSlotSchema),
    defaultValues: {
      maxParticipants: 1,
      duration: 60,
      isRecurring: false,
    },
  });

  const onSubmit = async (data: CreateSlotInput) => {
    if (!startDate || !startTime) {
      toast.error('Please select a start date and time');
      return;
    }

    setIsLoading(true);
    try {
      const startDateTime = new Date(`${format(startDate, 'yyyy-MM-dd')}T${startTime}`);
      const endTime = addMinutes(startDateTime, data.duration);
      
      const response = await fetch('/api/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, startTime: startDateTime, endTime }),
      });

      if (!response.ok) throw new Error('Failed to create slot');

      toast.success('Session slot created successfully!');
      router.push('/my-sessions');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create slot');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#DCDCDC] p-1 md:p-8 rounded-[2.5rem] shadow-inner">
      <Card className="w-full max-w-2xl mx-auto border-none shadow-2xl rounded-[2rem] overflow-hidden bg-white/90 backdrop-blur-xl">
        <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
        <CardHeader className="p-8 pb-4 relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-6 top-6 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            onClick={() => router.push('/my-sessions')}
          >
            <X className="h-5 w-5 cursor-pointer" />
          </Button>
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-blue-600/10 p-2 rounded-xl">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">New Offering</span>
          </div>
          <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">
            Design Your Session
          </CardTitle>
          <CardDescription className="text-slate-500 font-medium text-base">
            Configure a premium mentorship experience for your learners.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-8 pt-0">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-6">
            {/* Session Details */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                <Target className="h-4 w-4 text-slate-400" />
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Core Objectives</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-900 font-black text-sm px-1">Blueprint Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Scaling Engineering Teams"
                  {...register('title')}
                  disabled={isLoading}
                  className="bg-slate-50 border-slate-100 rounded-xl h-12 focus:ring-2 focus:ring-blue-600/20 font-medium"
                />
                {errors.title && <p className="text-xs text-red-500 font-bold ml-1">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-900 font-black text-sm px-1">Session Gains</Label>
                <Textarea
                  id="description"
                  placeholder="What will they master by the end of this hour?"
                  {...register('description')}
                  disabled={isLoading}
                  className="bg-slate-50 border-slate-100 rounded-xl min-h-[120px] focus:ring-2 focus:ring-blue-600/20 font-medium"
                />
                {errors.description && <p className="text-xs text-red-500 font-bold ml-1">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-slate-900 font-black text-sm px-1">Domain</Label>
                  <Select onValueChange={(value) => setValue('category', value)} disabled={isLoading}>
                    <SelectTrigger className="bg-slate-50 border-slate-100 h-12 rounded-xl focus:ring-2 focus:ring-blue-600/20 font-medium cursor-pointer">
                      <SelectValue placeholder="Select niche" className="cursor-pointer" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100 shadow-xl cursor-pointer">
                      {categories.map((c) => (
                        <SelectItem key={c} value={c} className="font-medium focus:bg-blue-50 focus:text-blue-600 cursor-pointer">{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-slate-900 font-black text-sm px-1 flex items-center">
                    Investment <span className="text-[10px] text-slate-400 font-bold ml-2 uppercase tracking-tighter">($ USD)</span>
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="price"
                      type="number"
                      {...register('price', { valueAsNumber: true })}
                      className="bg-slate-50 border-slate-100 h-12 rounded-xl pl-10 focus:ring-2 focus:ring-blue-600/20 font-black text-lg"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.price && <p className="text-xs text-red-500 font-bold ml-1">{errors.price.message}</p>}
                </div>
              </div>
            </div>

            {/* Mechanics */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                <Zap className="h-4 w-4 text-slate-400" />
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Logistics</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-900 font-black text-sm px-1">Target Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 justify-start text-left rounded-xl border-slate-100 bg-slate-50 hover:bg-slate-100 font-medium cursor-pointer",
                          !startDate && "text-slate-400"
                        )}
                      >
                        <CalendarIcon className="mr-3 h-4 w-4 text-blue-600 cursor-pointer" />
                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-2xl" align="start">
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
                  <Label className="text-slate-900 font-black text-sm px-1">Launch Time</Label>
                  <div className="relative cursor-pointer">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600 cursor-pointer" />
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="bg-slate-50 border-slate-100 h-12 rounded-xl pl-10 focus:ring-2 focus:ring-blue-600/20 font-black cursor-pointer"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <Label className="text-slate-900 font-black text-sm px-1">Duration</Label>
                  <Select onValueChange={(v) => setValue('duration', parseInt(v))} defaultValue="60">
                    <SelectTrigger className="bg-slate-50 border-slate-100 h-12 rounded-xl font-black cursor-pointer">
                      <SelectValue className="cursor-pointer" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl shadow-xl cursor-pointer">
                      {[30, 45, 60, 90, 120].map((d) => (
                        <SelectItem key={d} value={d.toString()} className="font-bold cursor-pointer">{d} Minutes</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-900 font-black text-sm px-1">Seat Capacity</Label>
                  <Select onValueChange={(v) => setValue('maxParticipants', parseInt(v))} defaultValue="1">
                    <SelectTrigger className="bg-slate-50 border-slate-100 h-12 rounded-xl font-black cursor-pointer">
                      <SelectValue className="cursor-pointer" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl shadow-xl cursor-pointer">
                      {[1, 2, 3, 5, 10].map((n) => (
                        <SelectItem key={n} value={n.toString()} className="font-bold cursor-pointer">{n} {n === 1 ? 'Seat' : 'Seats'}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex flex-col-reverse md:flex-row gap-4">
              <Button 
                type="button"
                variant="outline"
                onClick={() => router.push('/my-sessions')}
                className="w-full md:w-1/3 border-slate-200 text-slate-600 font-black h-16 rounded-[1.25rem] hover:bg-slate-50 transition-all text-lg cursor-pointer"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="w-full md:w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-black h-16 rounded-[1.25rem] shadow-glow transform transition-all active:scale-95 text-lg flex items-center justify-center space-x-3 group cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="cursor-pointer">Initializing Slot...</span>
                ) : (
                  <>
                    <span className="cursor-pointer">Publish Session Slot</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform cursor-pointer" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
