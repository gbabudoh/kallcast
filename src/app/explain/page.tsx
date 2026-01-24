'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  Video, 
  CreditCard, 
  ShieldCheck, 
  Zap, 
  Search,
  Lock,
  TrendingUp,
  Target,
  Rocket,
  ArrowLeft
} from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { ROUTES } from '@/constants/routes';

const platformSteps = [
  {
    title: "Browse & Discover",
    description: "Find the perfect mentor from our global pool of industry experts. Filter by expertise, rating, and availability.",
    icon: Search,
    color: "blue"
  },
  {
    title: "Secure Booking",
    description: "Select a time slot and pay securely via Stripe. Your funds are held safely in escrow by Kallcast.",
    icon: CreditCard,
    color: "purple"
  },
  {
    title: "Live Video Session",
    description: "Join your coach in our premium 4K HD video room featuring whiteboards, screen sharing, and real-time chat.",
    icon: Video,
    color: "indigo"
  },
  {
    title: "Confirm & Release",
    description: "Once the session is complete, both parties confirm and funds are released. Quality and trust guaranteed.",
    icon: ShieldCheck,
    color: "green"
  }
];

const learnerBenefits = [
  "Direct access to top-tier industry mentors",
  "Pay-on-delivery escrow protection",
  "Premium video environment (no downloads)",
  "Instant session recordings for review",
  "Lifetime access to your learning history"
];

const coachBenefits = [
  "Monetize your expertise on your own schedule",
  "Automated global billing and payouts",
  "No monthly subscription or platform fees",
  "Built-in 4K HD collaboration tools",
  "Automated session management and scheduling"
];

export default function ExplainPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="md" variant="default" href="/" />
            <div className="hidden md:flex items-center space-x-8">
              <Link href={ROUTES.EXPLAIN} className="text-blue-600 font-bold">Explain</Link>
              <Link href={ROUTES.PRICING} className="text-slate-600 font-bold hover:text-blue-600 transition-colors">Pricing</Link>
              <Link href={ROUTES.RESOURCES} className="text-slate-600 font-bold hover:text-blue-600 transition-colors">Resources</Link>
              <Link href={ROUTES.AUTH.LOGIN}>
                <Button variant="ghost" className="text-slate-600 font-bold hover:bg-slate-100 rounded-xl">Sign In</Button>
              </Link>
              <Link href={ROUTES.AUTH.REGISTER}>
                <Button className="bg-slate-900 hover:bg-black text-white font-bold rounded-xl px-6">
                  Get Started
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

      {/* Hero Header */}
      <section className="relative py-24 overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-8">
            <Badge className="bg-blue-600 text-white border-none px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em]">
              The Kallcast Methodology
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
              A platform built for <span className="text-blue-600">transformative</span> learning.
            </h1>
            <p className="text-2xl text-slate-500 font-medium leading-relaxed">
              Kallcast bridges the gap between seekers and experts through high-fidelity video, secure escrowed payments, and specialized collaboration tools.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works - Interactive Timeline */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-4xl font-black text-slate-900">How the Platform Works</h2>
            <p className="text-xl text-slate-500 font-medium">Four steps to absolute clarity and growth</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            {/* Desktop Connector Line */}
            <div className="hidden md:block absolute top-[68px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-blue-200 via-indigo-200 to-green-200"></div>

            {platformSteps.map((step, idx) => (
              <div key={idx} className="relative z-10 text-center group">
                <div className={`w-24 h-24 mx-auto rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 
                  ${step.color === 'blue' ? 'bg-blue-600 text-white shadow-blue-200' : 
                    step.color === 'purple' ? 'bg-purple-600 text-white shadow-purple-200' :
                    step.color === 'indigo' ? 'bg-indigo-600 text-white shadow-indigo-200' :
                    'bg-green-600 text-white shadow-green-200'}`}>
                  <step.icon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed px-4">{step.description}</p>
                <div className="absolute -top-4 -right-2 bg-white border border-slate-200 w-8 h-8 rounded-full flex items-center justify-center font-black text-xs text-slate-400">
                  {idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Based Benefits Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Learners Card */}
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-4xl font-black text-slate-900 leading-tight">Why <span className="text-blue-600">Learners</span> choose Kallcast</h2>
              </div>
              <div className="space-y-6">
                {learnerBenefits.map((benefit, i) => (
                  <div key={i} className="flex items-center space-x-4 bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0" />
                    <span className="text-lg font-bold text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Coaches Card */}
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="w-16 h-16 bg-purple-100 rounded-3xl flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-4xl font-black text-slate-900 leading-tight">Why <span className="text-purple-600">Coaches</span> thrive on Kallcast</h2>
              </div>
              <div className="space-y-6">
                {coachBenefits.map((benefit, i) => (
                  <div key={i} className="flex items-center space-x-4 bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <Zap className="w-6 h-6 text-purple-600 shrink-0" />
                    <span className="text-lg font-bold text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security Detailed Grid */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
         <div className="absolute inset-0 bg-grid-white/5 pointer-events-none"></div>
         <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-20">
            <div className="max-w-3xl mx-auto space-y-6">
               <h2 className="text-4xl md:text-5xl font-black">Built on <span className="text-blue-400">Trust and Technology</span></h2>
               <p className="text-xl text-slate-400 font-medium">We handle the technical complexity so you can focus on the human connection.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
               <Card className="bg-white/5 border-white/10 rounded-[2rem] p-8 space-y-6">
                  <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center">
                     <Lock className="w-7 h-7 text-blue-400" />
                  </div>
                  <h4 className="text-2xl font-black">Escrow Protection</h4>
                  <p className="text-slate-400 font-medium leading-relaxed">
                     Payments are held securely by Kallcast until the session is confirmed complete. This ensures learners get what they paid for and coaches get paid for their work.
                  </p>
               </Card>

               <Card className="bg-white/5 border-white/10 rounded-[2rem] p-8 space-y-6">
                  <div className="w-14 h-14 bg-indigo-600/20 rounded-2xl flex items-center justify-center">
                     <Video className="w-7 h-7 text-indigo-400" />
                  </div>
                  <h4 className="text-2xl font-black">Native 4K Video</h4>
                  <p className="text-slate-400 font-medium leading-relaxed">
                     Experience zero-latency video streaming optimized for educational environments. Features built-in whiteboard and screen-sharing tools for deep technical coaching.
                  </p>
               </Card>

               <Card className="bg-white/5 border-white/10 rounded-[2rem] p-8 space-y-6">
                  <div className="w-14 h-14 bg-purple-600/20 rounded-2xl flex items-center justify-center">
                     <Rocket className="w-7 h-7 text-purple-400" />
                  </div>
                  <h4 className="text-2xl font-black">Smart Scheduling</h4>
                  <p className="text-slate-400 font-medium leading-relaxed">
                     Automated time-zone synchronization and calendar integration ensure you never miss a beat. Both parties receive automated reminders for upcoming sessions.
                  </p>
               </Card>
            </div>
         </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-blue-600 py-32 text-center px-6">
         <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">Ready to experience the future of <span className="text-blue-200">live learning</span>?</h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
               <Link href={ROUTES.AUTH.REGISTER} className="sm:flex-1 max-w-xs">
                  <Button className="w-full h-20 bg-white text-blue-600 hover:bg-slate-50 font-black text-xl rounded-2xl shadow-2xl transition-transform hover:scale-105">
                     Join as Learner
                  </Button>
               </Link>
               <Link href={ROUTES.AUTH.REGISTER_COACH} className="sm:flex-1 max-w-xs">
                  <Button className="w-full h-20 bg-slate-900 text-white hover:bg-black font-black text-xl rounded-2xl shadow-2xl transition-transform hover:scale-105">
                     Apply to Coach
                  </Button>
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
}
