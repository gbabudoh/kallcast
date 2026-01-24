'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Video, 
  Zap, 
  ArrowRight, 
  Search,
  Sparkles,
  TrendingUp,
  Target,
  MessageSquare,
  Shield,
  Lightbulb,
  ArrowLeft
} from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { ROUTES } from '@/constants/routes';

const resourceCategories = [
  {
    title: "For Coaches",
    description: "Build and scale your coaching practice on Kallcast.",
    icon: TrendingUp,
    color: "blue",
    resources: [
      {
        title: "Session Strategy Guide",
        description: "How to structure your first session for maximum impact and value.",
        tag: "Growth",
        readTime: "8 min"
      },
      {
        title: "Mastering Video Setup",
        description: "Tips for professional lighting, audio, and background for your live calls.",
        tag: "Technical",
        readTime: "5 min"
      },
      {
        title: "Pricing for Profit",
        description: "Determining your market value and setting optimal hourly rates.",
        tag: "Business",
        readTime: "12 min"
      }
    ]
  },
  {
    title: "For Learners",
    description: "Get the most out of your mentorship experience.",
    icon: Target,
    color: "purple",
    resources: [
      {
        title: "Finding Your Mentor",
        description: "How to identify the right coach for your specific career stage and goals.",
        tag: "Success",
        readTime: "6 min"
      },
      {
        title: "Session Preparation",
        description: "What to prepare before your live call to ensure you get every question answered.",
        tag: "Guide",
        readTime: "4 min"
      },
      {
        title: "Sustaining Progress",
        description: "How to apply what you've learned and build a long-term growth plan.",
        tag: "Strategy",
        readTime: "10 min"
      }
    ]
  }
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="md" variant="default" href="/" />
            <div className="hidden md:flex items-center space-x-8">
              <Link href={ROUTES.EXPLAIN} className="text-slate-600 font-bold hover:text-blue-600 transition-colors">Explain</Link>
              <Link href={ROUTES.PRICING} className="text-slate-600 font-bold hover:text-blue-600 transition-colors">Pricing</Link>
              <Link href={ROUTES.AUTH.LOGIN} className="text-slate-600 font-bold hover:text-blue-600 transition-colors">Sign In</Link>
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

      {/* Hero Section */}
      <div className="bg-white border-b border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-br from-blue-50/50 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="max-w-3xl">
            <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-none px-4 py-1 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6">
              Knowledge Hub
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-6">
              Everything you need to <span className="text-blue-600">succeed</span> on Kallcast
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10">
              Expert advice, technical guides, and growth strategies tailored for modern mentors and ambitious learners.
            </p>
            
            <div className="relative max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search for guides, tips, or tutorials..."
                className="w-full pl-12 pr-4 h-14 bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-2xl transition-all font-medium text-slate-900 shadow-inner"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col gap-20">
          {resourceCategories.map((category, idx) => (
            <section key={idx} className="space-y-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${category.color === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                    <category.icon className="w-7 h-7" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900">{category.title}</h2>
                  <p className="text-lg text-slate-500 font-medium max-w-xl">{category.description}</p>
                </div>
                <Button variant="ghost" className="text-blue-600 font-black hover:bg-blue-50 p-0 hover:px-4 transition-all h-10">
                  Explore all {category.title} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {category.resources.map((item, i) => (
                  <Card key={i} className="group border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 rounded-[2rem] overflow-hidden flex flex-col hover:-translate-y-1">
                    <CardHeader className="p-8 pb-4">
                      <Badge className="w-fit mb-4 bg-slate-100 text-slate-600 hover:bg-slate-200 border-none font-bold uppercase text-[10px] tracking-widest">
                        {item.tag}
                      </Badge>
                      <CardTitle className="text-xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 flex-1 flex flex-col justify-between">
                      <p className="text-slate-500 font-medium leading-relaxed mb-6">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                          <BookOpen className="w-3 h-3 mr-2 text-slate-300" />
                          {item.readTime} read
                        </span>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Featured Community Section */}
        <section className="mt-32">
          <div className="bg-slate-900 rounded-[3rem] p-10 md:p-20 relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none"></div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-4 py-1 rounded-full text-xs font-black uppercase tracking-[0.2em]">
                  Kallcast Pro
                </Badge>
                <h2 className="text-4xl md:text-5xl font-black leading-tight">
                  Join our weekly <span className="text-blue-400">Coaching Masterclass</span>
                </h2>
                <p className="text-lg text-slate-400 font-medium leading-relaxed italic border-l-4 border-blue-500 pl-6">
                  &quot;Every Tuesday, we host live sessions with our top-earning partners to share what&apos;s working right now in the industry.&quot;
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl h-14 px-8 shadow-xl shadow-blue-900/50">
                    Register for Session
                    <Video className="ml-3 w-5 h-5" />
                  </Button>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/5 font-black rounded-2xl h-14 px-8">
                    View Recording Archive
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Zap, label: "Live Q&A" },
                  { icon: MessageSquare, label: "Community Chat" },
                  { icon: Shield, label: "Verified Hosts" },
                  { icon: Lightbulb, label: "Trend Reports" }
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-[2rem] text-center space-y-3">
                     <item.icon className="w-8 h-8 mx-auto text-blue-400" />
                     <p className="font-black text-sm uppercase tracking-widest">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* CTA Section */}
      <section className="bg-blue-600 py-24 text-center px-6">
        <h2 className="text-4xl font-black text-white mb-8">Ready to grow your potential?</h2>
        <Link href={ROUTES.AUTH.REGISTER}>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-black text-xl px-12 h-20 rounded-[1.5rem] shadow-2xl transition-all hover:scale-105">
            Join the Community Now
            <Sparkles className="ml-3 w-6 h-6" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
