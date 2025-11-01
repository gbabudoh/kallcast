'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { registerCoachSchema, type RegisterCoachInput } from '@/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, X } from 'lucide-react';

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

const expertiseAreas = [
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

export default function RegisterCoachForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [expertise, setExpertise] = useState<string[]>([]);
  const [customExpertise, setCustomExpertise] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterCoachInput>({
    resolver: zodResolver(registerCoachSchema),
    defaultValues: {
      role: 'coach',
      timezone: 'UTC',
      expertise: [],
      yearsExperience: 0,
      hourlyRate: 50,
    },
  });

  const addExpertise = (area: string) => {
    if (!expertise.includes(area)) {
      const newExpertise = [...expertise, area];
      setExpertise(newExpertise);
      setValue('expertise', newExpertise);
    }
  };

  const removeExpertise = (area: string) => {
    const newExpertise = expertise.filter(e => e !== area);
    setExpertise(newExpertise);
    setValue('expertise', newExpertise);
  };

  const addCustomExpertise = () => {
    if (customExpertise.trim() && !expertise.includes(customExpertise.trim())) {
      addExpertise(customExpertise.trim());
      setCustomExpertise('');
    }
  };

  const onSubmit = async (data: RegisterCoachInput) => {
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

      toast.success('Coach account created successfully! Please sign in.');
      router.push('/login');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Become a Coach</CardTitle>
        <CardDescription className="text-center">
          Join KallKast as a professional coach
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                {...register('firstName')}
                disabled={isLoading}
              />
              {errors.firstName && (
                <p className="text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                {...register('lastName')}
                disabled={isLoading}
              />
              {errors.lastName && (
                <p className="text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your-email@example.com"
              {...register('email')}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                {...register('password')}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                {...register('confirmPassword')}
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about your coaching experience, approach, and what makes you unique..."
              {...register('bio')}
              disabled={isLoading}
              rows={4}
            />
            {errors.bio && (
              <p className="text-sm text-red-600">{errors.bio.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Areas of Expertise</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {expertise.map((area) => (
                <span
                  key={area}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {area}
                  <button
                    type="button"
                    onClick={() => removeExpertise(area)}
                    className="hover:bg-primary/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Select onValueChange={addExpertise} disabled={isLoading}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select expertise areas" />
                </SelectTrigger>
                <SelectContent>
                  {expertiseAreas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add custom expertise"
                value={customExpertise}
                onChange={(e) => setCustomExpertise(e.target.value)}
                disabled={isLoading}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomExpertise())}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addCustomExpertise}
                disabled={isLoading || !customExpertise.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {errors.expertise && (
              <p className="text-sm text-red-600">{errors.expertise.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="yearsExperience">Years of Experience</Label>
              <Input
                id="yearsExperience"
                type="number"
                min="0"
                placeholder="Enter years of experience"
                {...register('yearsExperience', { valueAsNumber: true })}
                disabled={isLoading}
              />
              {errors.yearsExperience && (
                <p className="text-sm text-red-600">{errors.yearsExperience.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
              <Input
                id="hourlyRate"
                type="number"
                min="10"
                placeholder="Enter hourly rate"
                {...register('hourlyRate', { valueAsNumber: true })}
                disabled={isLoading}
              />
              {errors.hourlyRate && (
                <p className="text-sm text-red-600">{errors.hourlyRate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              value={watch('timezone')}
              onValueChange={(value) => setValue('timezone', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your timezone" />
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
              <p className="text-sm text-red-600">{errors.timezone.message}</p>
            )}
          </div>

          <input type="hidden" {...register('role')} value="coach" />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Coach Account
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <a
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
