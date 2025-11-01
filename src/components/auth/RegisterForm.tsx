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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Play, Video, ArrowRight, CheckCircle, Globe, Users, GraduationCap } from 'lucide-react';
import Link from 'next/link';

const timezones = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
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
        headers: {
          'Content-Type': 'application/json',
        },
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
    <Card className="shadow-xl border-0 bg-white">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
        <CardDescription className="text-gray-600">
          Join Kallcast as a learner or coach
        </CardDescription>
      </CardHeader>
      
      <CardContent className="px-6 pb-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Role Selection */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              I want to join as:
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setValue('role', 'learner')}
                className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                  selectedRole === 'learner'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
                disabled={isLoading}
              >
                <div className="flex flex-col items-center space-y-2">
                  <GraduationCap className={`w-6 h-6 ${selectedRole === 'learner' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="font-medium text-sm">Learner</span>
                  <span className="text-xs text-center">Learn from expert coaches</span>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setValue('role', 'coach')}
                className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                  selectedRole === 'coach'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
                disabled={isLoading}
              >
                <div className="flex flex-col items-center space-y-2">
                  <Users className={`w-6 h-6 ${selectedRole === 'coach' ? 'text-purple-600' : 'text-gray-400'}`} />
                  <span className="font-medium text-sm">Coach</span>
                  <span className="text-xs text-center">Teach and earn money</span>
                </div>
              </button>
            </div>
            {errors.role && (
              <p className="text-xs text-red-500 mt-2">{errors.role.message}</p>
            )}
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                First Name
              </Label>
              <Input
                id="firstName"
                placeholder="John"
                {...register('firstName')}
                disabled={isLoading}
                className="mt-1 h-10"
              />
              {errors.firstName && (
                <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                Last Name
              </Label>
              <Input
                id="lastName"
                placeholder="Doe"
                {...register('lastName')}
                disabled={isLoading}
                className="mt-1 h-10"
              />
              {errors.lastName && (
                <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

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
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              {...register('password')}
              disabled={isLoading}
              className="mt-1 h-10"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm password"
              {...register('confirmPassword')}
              disabled={isLoading}
              className="mt-1 h-10"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Timezone */}
          <div>
            <Label htmlFor="timezone" className="text-sm font-medium text-gray-700">
              Timezone
            </Label>
            <Select
              value={watch('timezone')}
              onValueChange={(value) => setValue('timezone', value)}
              disabled={isLoading}
            >
              <SelectTrigger className="mt-1 h-10">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.timezone && (
              <p className="text-xs text-red-500 mt-1">{errors.timezone.message}</p>
            )}
          </div>

          <input type="hidden" {...register('role')} value={selectedRole} />

          {/* Benefits based on role */}
          {selectedRole && (
            <div className={`p-4 rounded-lg border ${
              selectedRole === 'learner' 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-purple-50 border-purple-200'
            }`}>
              <h4 className={`font-medium text-sm mb-2 ${
                selectedRole === 'learner' ? 'text-blue-800' : 'text-purple-800'
              }`}>
                {selectedRole === 'learner' ? '🎓 As a Learner, you get:' : '👨‍🏫 As a Coach, you get:'}
              </h4>
              <div className="space-y-1 text-xs text-gray-600">
                {selectedRole === 'learner' ? (
                  <>
                    <div className="flex items-center">
                      <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                      <span>Access to HD video coaching sessions</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                      <span>Interactive learning tools & whiteboard</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                      <span>Session recordings & progress tracking</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center">
                      <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                      <span>Earn money teaching your expertise</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                      <span>Professional video streaming tools</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                      <span>Flexible scheduling & payment system</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            className={`w-full h-11 font-medium text-white cursor-pointer ${
              selectedRole === 'learner'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                {selectedRole === 'learner' ? (
                  <GraduationCap className="mr-2 h-4 w-4" />
                ) : (
                  <Users className="mr-2 h-4 w-4" />
                )}
                {selectedRole === 'learner' ? 'Start Learning' : 'Start Teaching'}
              </>
            )}
          </Button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <div className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">
              Sign in
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
