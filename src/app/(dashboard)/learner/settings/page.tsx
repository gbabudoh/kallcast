'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  ShieldCheck, 
  Trash2, 
  Globe, 
  DollarSign, 
  Briefcase,
  Camera,
  CheckCircle2,
  Loader2,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useUserProfile } from '@/hooks';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const { data: profileData, loading: loadingProfile, refetch: refetchProfile } = useUserProfile(session?.user?.id || '');
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  
  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    timezone: '',
    title: '',
    location: '',
    hourlyRate: 0,
    expertise: [] as string[],
    profileImage: ''
  });

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (profileData?.user) {
      const u = profileData.user;
      setProfileForm({
        firstName: u.firstName || '',
        lastName: u.lastName || '',
        email: u.email || '',
        bio: u.bio || '',
        timezone: u.timezone || 'UTC',
        title: u.title || '',
        location: u.location || '',
        hourlyRate: u.hourlyRate || 0,
        expertise: u.expertise || [],
        profileImage: u.profileImage || ''
      });
    }
  }, [profileData]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch(`/api/users/${session?.user?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update profile');

      toast.success('Profile updated successfully');
      await updateSession();
      refetchProfile();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("New passwords don't match");
    }
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordForm),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update password');

      toast.success('Password updated successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const isCoach = session?.user?.role === 'coach';

  if (loadingProfile && !profileForm.email) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Loading your preferences...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Dynamic Glass Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-[40rem] h-[40rem] bg-blue-400/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[35rem] h-[35rem] bg-purple-400/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Settings
            <Sparkles className="w-6 h-6 text-blue-500" />
          </h1>
          <p className="text-slate-500 text-lg font-medium mt-1">
            Tailor KallKast to your professional needs
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
          <ShieldCheck className="w-4 h-4" />
          Secure Dashboard
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
            <TabsList className="flex flex-col h-auto bg-transparent border-0 space-y-1 p-0">
              <TabsTrigger 
                value="profile" 
                className="w-full justify-start gap-3 px-4 py-3 rounded-2xl data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-blue-600 transition-all duration-300 font-bold border border-transparent data-[state=active]:border-slate-100"
              >
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="w-full justify-start gap-3 px-4 py-3 rounded-2xl data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-blue-600 transition-all duration-300 font-bold border border-transparent data-[state=active]:border-slate-100"
              >
                <Lock className="w-4 h-4" />
                Security
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="w-full justify-start gap-3 px-4 py-3 rounded-2xl data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-blue-600 transition-all duration-300 font-bold border border-transparent data-[state=active]:border-slate-100"
              >
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
              {isCoach && (
                <TabsTrigger 
                  value="payouts" 
                  className="w-full justify-start gap-3 px-4 py-3 rounded-2xl data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-blue-600 transition-all duration-300 font-bold border border-transparent data-[state=active]:border-slate-100"
                >
                  <DollarSign className="w-4 h-4" />
                  Payouts
                </TabsTrigger>
              )}
            </TabsList>
          </Tabs>

          <div className="pt-8 mt-8 border-t border-slate-200">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 px-4 py-3 rounded-2xl text-red-500 hover:text-red-600 hover:bg-red-50 border-transparent hover:border-red-100 font-bold transition-all"
              onClick={() => toast.info('Delete account flow coming soon')}
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="profile" className="m-0 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <Card className="bg-white/80 backdrop-blur-xl border-slate-200 shadow-2xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-8 pb-0">
                  <div className="flex items-center gap-6">
                    <div className="relative group">
                      <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
                        <AvatarImage src={profileForm.profileImage} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-3xl font-black">
                          {profileForm.firstName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-slate-100 hover:scale-110 transition-transform text-blue-600 cursor-pointer">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black">{profileForm.firstName} {profileForm.lastName}</CardTitle>
                      <CardDescription className="text-slate-500 font-medium">{session?.user?.role === 'coach' ? 'Expert Coach' : 'Growth Aspirant'}</CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest">Active Member</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <form onSubmit={handleProfileUpdate} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-slate-900 font-bold ml-1">First Name</Label>
                        <Input 
                          value={profileForm.firstName}
                          onChange={e => setProfileForm({...profileForm, firstName: e.target.value})}
                          className="rounded-2xl border-slate-200 focus:ring-blue-500 h-12" 
                          placeholder="Enter first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-900 font-bold ml-1">Last Name</Label>
                        <Input 
                          value={profileForm.lastName}
                          onChange={e => setProfileForm({...profileForm, lastName: e.target.value})}
                          className="rounded-2xl border-slate-200 focus:ring-blue-500 h-12" 
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-900 font-bold ml-1">Email Address</Label>
                      <div className="relative">
                        <Input 
                          value={profileForm.email}
                          disabled 
                          className="rounded-2xl border-slate-200 bg-slate-50 pl-12 h-12 cursor-not-allowed" 
                        />
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      </div>
                    </div>

                    {isCoach && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                          <div className="space-y-2">
                            <Label className="text-slate-900 font-bold ml-1">Professional Title</Label>
                            <div className="relative">
                              <Input 
                                value={profileForm.title}
                                onChange={e => setProfileForm({...profileForm, title: e.target.value})}
                                className="rounded-2xl border-slate-200 pl-12 h-12" 
                                placeholder="E.g. Senior Software Architect"
                              />
                              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-900 font-bold ml-1">Hourly Rate (USD)</Label>
                            <div className="relative">
                              <Input 
                                type="number"
                                value={profileForm.hourlyRate}
                                onChange={e => setProfileForm({...profileForm, hourlyRate: parseInt(e.target.value)})}
                                className="rounded-2xl border-slate-200 pl-12 h-12" 
                                placeholder="100"
                              />
                              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-slate-900 font-bold ml-1">Location</Label>
                            <div className="relative">
                              <Input 
                                value={profileForm.location}
                                onChange={e => setProfileForm({...profileForm, location: e.target.value})}
                                className="rounded-2xl border-slate-200 pl-12 h-12" 
                                placeholder="E.g. London, UK"
                              />
                              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-900 font-bold ml-1">Timezone</Label>
                            <div className="relative">
                              <Input 
                                value={profileForm.timezone}
                                onChange={e => setProfileForm({...profileForm, timezone: e.target.value})}
                                className="rounded-2xl border-slate-200 pl-12 h-12" 
                                placeholder="UTC"
                              />
                              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 pt-4">
                          <Label className="text-slate-900 font-bold ml-1">Professional Bio</Label>
                          <Textarea 
                            value={profileForm.bio}
                            onChange={e => setProfileForm({...profileForm, bio: e.target.value})}
                            className="rounded-2xl border-slate-200 focus:ring-blue-500 min-h-[120px] p-4" 
                            placeholder="Share your expertise and passion..."
                          />
                          <p className="text-xs text-slate-400 font-medium ml-1">Minimum 50 characters requested for a complete profile.</p>
                        </div>
                      </>
                    )}

                    {!isCoach && (
                       <div className="space-y-2 pt-4">
                        <Label className="text-slate-900 font-bold ml-1">Bio</Label>
                        <Textarea 
                          value={profileForm.bio}
                          onChange={e => setProfileForm({...profileForm, bio: e.target.value})}
                          className="rounded-2xl border-slate-200 focus:ring-blue-500 min-h-[120px] p-4" 
                          placeholder="Tell us about your learning goals..."
                        />
                      </div>
                    )}

                    <div className="pt-4 flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={isSaving}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-6 rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-95"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Save Profile
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="m-0 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <Card className="bg-white/80 backdrop-blur-xl border-slate-200 shadow-2xl rounded-[2.5rem]">
                <CardHeader className="p-8">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                    <Lock className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-2xl font-black">Auth security</CardTitle>
                  <CardDescription className="text-slate-500 font-medium tracking-tight">Protect your account with a strong password.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-6">
                  <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-slate-900 font-bold ml-1">Current Password</Label>
                      <Input 
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                        className="rounded-2xl border-slate-200 h-12" 
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-slate-900 font-bold ml-1">New Password</Label>
                        <Input 
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                          className="rounded-2xl border-slate-200 h-12" 
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-900 font-bold ml-1">Confirm New Password</Label>
                        <Input 
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                          className="rounded-2xl border-slate-200 h-12" 
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    <div className="pt-4">
                      <Button 
                        type="submit"
                        disabled={isSaving}
                        className="bg-slate-900 hover:bg-black text-white font-black px-8 py-6 rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-95"
                      >
                         {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4 mr-2" />
                            Update Password
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="m-0 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
               <Card className="bg-white/80 backdrop-blur-xl border-slate-200 shadow-2xl rounded-[2.5rem]">
                <CardHeader className="p-8">
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-4">
                    <Bell className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-2xl font-black">Communication Center</CardTitle>
                  <CardDescription className="text-slate-500 font-medium tracking-tight">Stay updated with the latest session activities.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-6">
                  <div className="space-y-4">
                    {[
                      { title: 'Session Reminders', desc: 'Get notified 30 mins before sessions', icon: Sparkles, color: 'text-blue-500', bg: 'bg-blue-50' },
                      { title: 'New Bookings', desc: 'Alerts for newly scheduled sessions', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                      { title: 'Payment Updates', desc: 'Receipts and payout notifications', icon: DollarSign, color: 'text-purple-500', bg: 'bg-purple-50' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-blue-100 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{item.title}</h4>
                            <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-xl font-bold px-4 hover:bg-white hover:text-blue-600 transition-all">Enabled</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payouts" className="m-0 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
               <Card className="bg-white/80 backdrop-blur-xl border-slate-200 shadow-2xl rounded-[2.5rem]">
                <CardHeader className="p-8">
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-4">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-2xl font-black">Payout Hub</CardTitle>
                  <CardDescription className="text-slate-500 font-medium tracking-tight">Manage your Stripe Connect integration and view income.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-6">
                  <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] text-white">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <p className="text-white/60 font-bold uppercase tracking-widest text-[10px] mb-1">Stripe Status</p>
                        <h4 className="text-2xl font-black flex items-center gap-2">
                          {profileData?.user?.stripeOnboardingComplete ? 'Active & Ready' : 'Onboarding Required'}
                          {profileData?.user?.stripeOnboardingComplete && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                        </h4>
                      </div>
                      <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center">
                        <Briefcase className="w-6 h-6" />
                      </div>
                    </div>
                    
                    <p className="text-white/70 font-medium mb-6 leading-relaxed">
                      {profileData?.user?.stripeOnboardingComplete 
                        ? 'Your Stripe account is connected. You can manage your payout schedule and view detailed statements directly in your Stripe dashboard.'
                        : 'To receive payments from learners, you must complete your Stripe Connect onboarding. Click the button below to finish the setup.'
                      }
                    </p>

                    <Button 
                      className="bg-white text-slate-900 hover:bg-blue-50 font-black px-8 py-6 rounded-2xl shadow-xl transition-all active:scale-95"
                      onClick={() => toast.info('Dashboard redirect coming soon')}
                    >
                      {profileData?.user?.stripeOnboardingComplete ? 'Open Stripe Dashboard' : 'Complete Setup'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
