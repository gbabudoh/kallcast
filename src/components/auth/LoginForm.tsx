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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogIn, Video, Users, ArrowRight } from 'lucide-react';
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
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-xl border-0 bg-white">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
          <CardDescription className="text-gray-600">
            Sign in to your Kallcast account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-6 pb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your-email@example.com"
                {...register('email')}
                disabled={isLoading}
                className="mt-1 h-10"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Link href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password')}
                disabled={isLoading}
                className="mt-1 h-10"
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium cursor-pointer" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <div className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-700">
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Video className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900 text-sm">New Learner?</h3>
              <p className="text-xs text-blue-700">Start learning today</p>
            </div>
          </div>
          <Link href="/register">
            <Button variant="outline" size="sm" className="w-full text-xs border-blue-300 text-blue-700 hover:bg-blue-100 cursor-pointer">
              Create Learner Account
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-purple-900 text-sm">Want to Teach?</h3>
              <p className="text-xs text-purple-700">Become a coach</p>
            </div>
          </div>
          <Link href="/register">
            <Button variant="outline" size="sm" className="w-full text-xs border-purple-300 text-purple-700 hover:bg-purple-100 cursor-pointer">
              Create Coach Account
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Preview */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="font-medium text-gray-900 text-sm mb-3 text-center">
          🎥 Join Live Video Learning Sessions
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-600">10K+</div>
            <div className="text-xs text-gray-600">Active Learners</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600">500+</div>
            <div className="text-xs text-gray-600">Expert Coaches</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">4.9★</div>
            <div className="text-xs text-gray-600">Average Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
}
