'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  Users, 
  ArrowRight, 
  Sparkles,
  Lock,
  Wallet,
  Video,
  ArrowLeft
} from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { ROUTES } from '@/constants/routes';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="md" variant="default" href="/" />
            <div className="hidden md:flex items-center space-x-8">
              <Link href={ROUTES.EXPLAIN} className="text-slate-600 font-bold hover:text-blue-600 transition-colors">Explain</Link>
              <Link href={ROUTES.PRICING} className="text-blue-600 font-bold">Pricing</Link>
              <Link href={ROUTES.RESOURCES} className="text-slate-600 font-bold hover:text-blue-600 transition-colors">Resources</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href={ROUTES.AUTH.LOGIN}>
                <Button variant="ghost" className="text-slate-600 font-bold hover:bg-slate-100 rounded-xl">Sign In</Button>
              </Link>
              <Link href={ROUTES.AUTH.REGISTER}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 px-6">
                  Join Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <Link 
          href={ROUTES.HOME} 
          className="group inline-flex items-center space-x-3 text-slate-400 hover:text-blue-600 transition-all cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shadow-sm cursor-pointer">
            <ArrowLeft className="w-5 h-5 cursor-pointer" />
          </div>
          <span className="text-sm font-black uppercase tracking-widest cursor-pointer">Back to Home</span>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-4 py-1 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-4">
            Transparent Pricing
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Simple, honest pricing for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-black">everyone</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Whether you&apos;re here to learn or to share your expertise, Kallcast provides the most secure and fair platform in the industry.
          </p>
        </div>
      </div>

      {/* Main Pricing Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* For Learners */}
          <Card className="border border-slate-200 bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col group overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Users className="w-32 h-32 text-blue-600" />
            </div>
            <CardHeader className="p-10 pb-6 relative z-10">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-3xl font-black text-slate-900">For Learners</CardTitle>
              <CardDescription className="text-lg font-bold text-slate-400 mt-2 uppercase tracking-widest">
                Grow your skills
              </CardDescription>
              <div className="mt-8 flex items-baseline gap-2">
                <span className="text-5xl font-black text-slate-900">$0</span>
                <span className="text-lg font-bold text-slate-400 italic">to join</span>
              </div>
            </CardHeader>
            <CardContent className="p-10 flex-1 flex flex-col pt-0 relative z-10">
              <ul className="space-y-5 mb-10">
                {[
                  "Free lifetime account usage",
                  "Browse expert coaches globally",
                  "Escrow-protected payments",
                  "HD video learning environment",
                  "Full refund protection",
                  "Community event access"
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-slate-600 font-semibold group-hover:translate-x-1 transition-transform">
                    <CheckCircle2 className="w-6 h-6 text-green-500 mr-4 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8 border-t border-slate-50">
                <Link href={ROUTES.AUTH.REGISTER}>
                  <Button className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-lg transition-all group-hover:shadow-blue-500/20 group-hover:shadow-2xl">
                    Create Learner Account
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* For Coaches */}
          <Card className="border-4 border-blue-100 bg-white shadow-2xl rounded-[2.5rem] flex flex-col relative overflow-hidden group">
            {/* Featured Badge */}
            <div className="absolute top-0 right-10 bg-blue-600 text-white px-6 py-2 rounded-b-2xl font-black text-xs uppercase tracking-widest z-20">
              Most Popular
            </div>
            
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            <CardHeader className="p-10 pb-6 relative z-10">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-3xl font-black text-slate-900">For Coaches</CardTitle>
              <CardDescription className="text-lg font-bold text-blue-600 mt-2 uppercase tracking-widest">
                Monetize expertise
              </CardDescription>
              <div className="mt-8 flex items-baseline gap-2">
                <span className="text-5xl font-black text-slate-900">$0</span>
                <span className="text-lg font-bold text-slate-400 italic">to join</span>
              </div>
            </CardHeader>
            <CardContent className="p-10 flex-1 flex flex-col pt-0 relative z-10">
              <ul className="space-y-5 mb-10">
                {[
                  "No monthly subscription fees",
                  "Set your own hourly rate",
                  "Keep 80% of your earnings",
                  "Automated session recording",
                  "Global client payments",
                  "Integrated scheduling system"
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-slate-600 font-semibold group-hover:translate-x-1 transition-transform">
                    <CheckCircle2 className="w-6 h-6 text-blue-600 mr-4 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8 border-t border-slate-50">
                <Link href={ROUTES.AUTH.REGISTER_COACH}>
                  <Button className="w-full h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-lg shadow-xl shadow-blue-300 group-hover:scale-[1.02] transition-transform">
                    Start Coaching Free
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trust & Escrow Detail */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 mb-10">
            <ShieldCheck className="w-5 h-5 text-blue-400 font-black" />
            <span className="text-xs font-black uppercase tracking-widest">Kallcast Protection Engine</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-12">How our <span className="text-blue-400">Secure Escrow</span> works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 items-start">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white/10 rounded-[1.5rem] flex items-center justify-center mx-auto border border-white/5 shadow-2xl">
                <CreditCard className="w-8 h-8 text-blue-400 font-black text-[20px]" />
              </div>
              <h4 className="font-black text-lg">Booking</h4>
              <p className="text-slate-400 text-sm font-medium">Learner checks out & pays safely via Stripe.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white/10 rounded-[1.5rem] flex items-center justify-center mx-auto border border-white/5 shadow-2xl">
                <Lock className="w-8 h-8 text-blue-400 font-black text-[20px]" />
              </div>
              <h4 className="font-black text-lg">Hold</h4>
              <p className="text-slate-400 text-sm font-medium">Kallcast holds the funds securely in escrow.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white/10 rounded-[1.5rem] flex items-center justify-center mx-auto border border-white/5 shadow-2xl">
                <Video className="w-8 h-8 text-blue-400 font-black text-[20px]" />
              </div>
              <h4 className="font-black text-lg">Session</h4>
              <p className="text-slate-400 text-sm font-medium">Both join the live HD video session room.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white/10 rounded-[1.5rem] flex items-center justify-center mx-auto border border-white/5 shadow-2xl">
                <Wallet className="w-8 h-8 text-blue-400 font-black text-[20px]" />
              </div>
              <h4 className="font-black text-lg">Release</h4>
              <p className="text-slate-400 text-sm font-medium">Funds release to coach after dual confirmation.</p>
            </div>
          </div>

          <div className="mt-20 p-10 bg-white/5 rounded-[3rem] border border-white/10 inline-block text-left">
            <h4 className="text-2xl font-black mb-6 flex items-center">
              <Badge className="bg-blue-600 mr-4 font-black">Fee Breakdown</Badge>
              Coach Payout Structure
            </h4>
            <div className="space-y-4 text-slate-300 font-bold max-w-2xl">
               <div className="flex justify-between border-b border-white/5 pb-4">
                  <span className="text-white">Coach Hourly Rate</span>
                  <span className="text-white">Set by Coach (e.g. $100)</span>
               </div>
               <div className="flex justify-between text-slate-400 font-medium">
                  <span>Platform Service Fee</span>
                  <span>- 20.0%</span>
               </div>
               <div className="flex justify-between text-slate-400 font-medium">
                  <span>Standard Stripe Fees</span>
                  <span>- ~2.9% + 30¢</span>
               </div>
               <div className="flex justify-between text-blue-400 text-xl font-black pt-4">
                  <span>Net Payout to Coach</span>
                  <span>~ 77% of Booking Total</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-black text-slate-900 text-center mb-16 uppercase tracking-widest">Common Questions</h2>
        <div className="space-y-8">
          {[
            {
              q: "Is registration really free?",
              a: "Yes! There are no signup or monthly subscription fees for either learners or coaches. You only pay or earn when a session is actually booked."
            },
            {
              q: "When does the coach get paid?",
              a: "Coaches are paid automatically after the session is complete and both the coach and learner have confirmed. This protects both parties."
            },
            {
              q: "What happens if a coach doesn't show up?",
              a: "Our escrow system protects you. If a session doesn't occur, the learner is issued a full refund immediately after validation."
            },
            {
              q: "Which payment methods are supported?",
              a: "We support all major credit cards, Apple Pay, and Google Pay through our secure Stripe integration."
            }
          ].map((faq, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="text-xl font-black text-slate-900 mb-3">{faq.q}</h4>
              <p className="text-slate-500 font-medium leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-blue-600 py-24 text-center px-6">
         <h2 className="text-4xl md:text-5xl font-black text-white mb-8">Ready to get started?</h2>
         <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-xl mx-auto">
            <Link href={ROUTES.AUTH.REGISTER} className="flex-1">
               <Button className="w-full h-16 bg-white text-blue-600 hover:bg-slate-50 font-black text-lg rounded-2xl shadow-2xl">
                  Leaner Signup
               </Button>
            </Link>
            <Link href={ROUTES.AUTH.REGISTER_COACH} className="flex-1">
               <Button className="w-full h-16 bg-slate-900 text-white hover:bg-black font-black text-lg rounded-2xl shadow-2xl">
                  Coach Signup
               </Button>
            </Link>
         </div>
      </section>
    </div>
  );
}
