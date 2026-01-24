'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { registerSchema, type RegisterInput } from '@/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ArrowRight, CheckCircle, Users, GraduationCap, Play, Shield, Sparkles } from 'lucide-react';
import Link from 'next/link';

const timezones = [
  'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Shanghai', 'Australia/Sydney',
];

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'learner',
      timezone: 'UTC',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      toast.success('Account created successfully! Please sign in.');
      router.push('/login');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-0 bg-white/70 backdrop-blur-xl rounded-[2.5rem] overflow-hidden animate-fade-up">
      <CardContent className="p-8 lg:p-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100/50 mb-4">
             <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
             <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Join Kallcast Today</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-500 font-medium">Step into a smoother learning experience today.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Role Selection */}
          <div className="space-y-4">
            <Label className="text-sm font-bold text-gray-700 tracking-tight pl-1">I want to join as a:</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setValue('role', 'learner')}
                className={`relative p-5 rounded-[1.5rem] border-2 transition-all duration-500 cursor-pointer ${
                  selectedRole === 'learner'
                    ? 'border-blue-600 bg-blue-50 shadow-inner'
                    : 'border-gray-100 hover:border-blue-200 bg-gray-50/50'
                }`}
                disabled={isLoading}
              >
                <div className={`p-2.5 rounded-xl w-fit mb-3 transition-colors ${selectedRole === 'learner' ? 'bg-blue-600 text-white' : 'bg-white text-gray-400 border border-gray-100'}`}>
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className={`font-bold transition-colors ${selectedRole === 'learner' ? 'text-blue-900' : 'text-gray-600'}`}>Learner</div>
                  <div className="text-[10px] text-gray-400 font-medium leading-tight">Upskill with live experts</div>
                </div>
                {selectedRole === 'learner' && <CheckCircle className="absolute top-4 right-4 w-5 h-5 text-blue-600" />}
              </button>

              <button
                type="button"
                onClick={() => setValue('role', 'coach')}
                className={`relative p-5 rounded-[1.5rem] border-2 transition-all duration-500 cursor-pointer ${
                  selectedRole === 'coach'
                    ? 'border-purple-600 bg-purple-50 shadow-inner'
                    : 'border-gray-100 hover:border-purple-200 bg-gray-50/50'
                }`}
                disabled={isLoading}
              >
                <div className={`p-2.5 rounded-xl w-fit mb-3 transition-colors ${selectedRole === 'coach' ? 'bg-purple-600 text-white' : 'bg-white text-gray-400 border border-gray-100'}`}>
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className={`font-bold transition-colors ${selectedRole === 'coach' ? 'text-purple-900' : 'text-gray-600'}`}>Coach</div>
                  <div className="text-[10px] text-gray-400 font-medium leading-tight">Teach and monetize</div>
                </div>
                {selectedRole === 'coach' && <CheckCircle className="absolute top-4 right-4 w-5 h-5 text-purple-600" />}
              </button>
            </div>
            {errors.role && <p className="text-xs text-red-500 mt-2 pl-1">{errors.role.message}</p>}
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 focus-within:scale-[1.02] transition-transform">
              <Label htmlFor="firstName" className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">First Name</Label>
              <Input id="firstName" placeholder="John" {...register('firstName')} disabled={isLoading} className="h-12 border-gray-100 bg-gray-50/50 rounded-xl px-4 focus:bg-white transition-all shadow-sm focus:ring-2 focus:ring-blue-500/20" />
              {errors.firstName && <p className="text-[10px] text-red-500 font-bold mt-1 pl-1">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-1.5 focus-within:scale-[1.02] transition-transform">
              <Label htmlFor="lastName" className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Last Name</Label>
              <Input id="lastName" placeholder="Doe" {...register('lastName')} disabled={isLoading} className="h-12 border-gray-100 bg-gray-50/50 rounded-xl px-4 focus:bg-white transition-all shadow-sm focus:ring-2 focus:ring-blue-500/20" />
              {errors.lastName && <p className="text-[10px] text-red-500 font-bold mt-1 pl-1">{errors.lastName.message}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5 focus-within:scale-[1.01] transition-transform">
             <Label htmlFor="email" className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Email Address</Label>
             <Input id="email" type="email" placeholder="john@example.com" {...register('email')} disabled={isLoading} className="h-12 border-gray-100 bg-gray-50/50 rounded-xl px-4 focus:bg-white transition-all shadow-sm focus:ring-2 focus:ring-blue-500/20" />
             {errors.email && <p className="text-[10px] text-red-500 font-bold mt-1 pl-1">{errors.email.message}</p>}
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 focus-within:scale-[1.02] transition-transform">
              <Label htmlFor="password" className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" {...register('password')} disabled={isLoading} className="h-12 border-gray-100 bg-gray-50/50 rounded-xl px-4 focus:bg-white transition-all shadow-sm focus:ring-2 focus:ring-blue-500/20" />
              {errors.password && <p className="text-[10px] text-red-500 font-bold mt-1 pl-1">{errors.password.message}</p>}
            </div>
            <div className="space-y-1.5 focus-within:scale-[1.02] transition-transform">
              <Label htmlFor="confirmPassword" className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Confirm</Label>
              <Input id="confirmPassword" type="password" placeholder="••••••••" {...register('confirmPassword')} disabled={isLoading} className="h-12 border-gray-100 bg-gray-50/50 rounded-xl px-4 focus:bg-white transition-all shadow-sm focus:ring-2 focus:ring-blue-500/20" />
              {errors.confirmPassword && <p className="text-[10px] text-red-500 font-bold mt-1 pl-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          {/* Timezone */}
          <div className="space-y-1.5">
            <Label htmlFor="timezone" className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Timezone</Label>
            <Select value={watch('timezone')} onValueChange={(v) => setValue('timezone', v)} disabled={isLoading}>
              <SelectTrigger className="h-12 border-gray-100 bg-gray-50/50 rounded-xl px-4 focus:bg-white shadow-sm">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-100 shadow-2xl">
                {timezones.map((tz) => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.timezone && <p className="text-[10px] text-red-500 font-bold mt-1 pl-1">{errors.timezone.message}</p>}
          </div>

          <input type="hidden" {...register('role')} value={selectedRole} />

          {/* Platform Benefits Banner */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100/50 group-hover:bg-blue-50/30 transition-colors">
            <div className="flex items-center space-x-2 mb-3">
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Premium Platform Access</span>
            </div>
            <div className="space-y-2">
               <div className="flex items-center text-[13px] font-bold text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  {selectedRole === 'learner' ? "HD sessions & cloud recordings" : "Powerful streaming & global payouts"}
               </div>
               <div className="flex items-center text-[11px] text-gray-400">
                  <Play className="w-3 h-3 text-blue-400 mr-2" />
                  No credit card required to get started
               </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className={`w-full h-14 rounded-2xl font-bold text-white text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform active:scale-[0.98] cursor-pointer ${
              selectedRole === 'learner'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-blue-500/20'
                : 'bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 shadow-purple-500/20'
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center"><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Securing connection...</div>
            ) : (
              <div className="flex items-center">
                {selectedRole === 'learner' ? 'Complete Onboarding' : 'Begin Teaching Journey'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </div>
            )}
          </Button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 pt-8 border-t border-gray-50 text-center">
           <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-blue-600 hover:underline transition-all">Sign in here</Link>
           </p>
        </div>
      </CardContent>
    </Card>
  );
}
