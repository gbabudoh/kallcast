'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { loginSchema, type LoginInput } from '@/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, LogIn, Video, Users, ArrowRight, Sparkles, Star, Shield, Play } from 'lucide-react';
import Link from 'next/link';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Invalid email or password');
      } else {
        toast.success('Successfully logged in!');
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Main Login Card */}
      <Card className="shadow-2xl border-0 bg-white/70 backdrop-blur-xl rounded-[2rem] overflow-hidden animate-fade-up">
        <CardContent className="p-6 lg:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100/50 mb-3">
               <Sparkles className="w-3.5 h-3.5 text-blue-600 mr-2" />
               <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Secure Access</span>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Welcome Back</h2>
            <p className="text-gray-500 font-medium text-xs">Sign in to your Kallcast account</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your-email@example.com"
                {...register('email')}
                disabled={isLoading}
                className="h-11 border-gray-100 bg-gray-50/50 rounded-xl px-4 focus:bg-white transition-all shadow-sm focus:ring-2 focus:ring-blue-500/20"
              />
              {errors.email && (
                <p className="text-[10px] text-red-500 font-bold mt-1 pl-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between pl-1">
                <Label htmlFor="password" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Password
                </Label>
                <Link href="/forgot-password" title="Forgot password?" className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password')}
                disabled={isLoading}
                className="h-11 border-gray-100 bg-gray-50/50 rounded-xl px-4 focus:bg-white transition-all shadow-sm focus:ring-2 focus:ring-blue-500/20"
              />
              {errors.password && (
                <p className="text-[10px] text-red-500 font-bold mt-1 pl-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-[0.98] cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center text-sm">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center text-sm">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </div>
              )}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 pt-6 border-t border-gray-50 text-center">
            <p className="text-xs text-gray-500 font-medium">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-bold text-blue-600 hover:underline transition-all">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-up delay-150">
        <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-sm group hover:scale-[1.02] transition-all">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <Video className="w-5 h-5 text-blue-600 group-hover:text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-[13px]">New Learner?</h3>
              <p className="text-[10px] text-gray-500">Pick up new skills</p>
            </div>
          </div>
          <Link href="/register">
            <Button variant="outline" size="sm" className="w-full h-9 rounded-lg text-[10px] font-bold border-gray-100 bg-white hover:bg-gray-50 text-blue-600 shadow-sm group-hover:border-blue-200 cursor-pointer">
              Get Started
              <ArrowRight className="ml-1.5 h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-sm group hover:scale-[1.02] transition-all">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center group-hover:bg-purple-600 transition-colors">
              <Users className="w-5 h-5 text-purple-600 group-hover:text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-[13px]">Want to Teach?</h3>
              <p className="text-[10px] text-gray-500">Become a coach</p>
            </div>
          </div>
          <Link href="/register">
            <Button variant="outline" size="sm" className="w-full h-9 rounded-lg text-[10px] font-bold border-gray-100 bg-white hover:bg-gray-50 text-purple-600 shadow-sm group-hover:border-purple-200 cursor-pointer">
              Join Coaches
              <ArrowRight className="ml-1.5 h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Preview Banner */}
      <div className="bg-gradient-to-br from-gray-900 to-slate-900 rounded-[1.5rem] p-6 text-white relative overflow-hidden shadow-xl animate-fade-up delay-300">
        <div className="absolute top-0 right-0 p-4 opacity-10"><Play className="w-12 h-12" /></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-3 h-3 text-blue-400" />
            <h3 className="font-black text-[9px] uppercase tracking-widest text-blue-400">
              Kallcast verified platform
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-0.5">
              <div className="text-xl font-black text-white">10K+</div>
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Sessions</div>
            </div>
            <div className="space-y-0.5 border-x border-white/10 px-2">
              <div className="text-xl font-black text-white">500+</div>
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Experts</div>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center justify-center text-xl font-black text-white italic">
                4.9<Star className="w-3 h-3 text-yellow-400 ml-1 fill-yellow-400" />
              </div>
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
