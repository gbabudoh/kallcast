import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { 
  Video, 
  Users, 
  Star, 
  Clock, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle,
  Play,
  Sparkles,
  TrendingUp,
  Award
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-lg shadow-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            <Logo size="md" variant="default" />
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-gray-700 hover:text-gray-900 hover:bg-white/60 transition-all duration-300 cursor-pointer">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 mb-8 animate-fade-in">
                <Video className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">Live Video Learning Platform</span>
              </div>
              
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  Master skills with{" "}
                </span>
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">
                  live video
                </span>
                <br />
                <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  coaching
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Join interactive video sessions with world-class coaches. Real-time learning, 
                personalized feedback, and instant collaboration tools.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/register">
                  <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 group cursor-pointer">
                    <Play className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    Start Learning Live
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
                <Link href="/register-coach">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-2 border-gray-300 hover:border-purple-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group cursor-pointer">
                    <Video className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    Teach Live Sessions
                  </Button>
                </Link>
              </div>
              
              {/* Live indicators */}
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                  <span>127 live sessions now</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                  <span>2.3K coaches online</span>
                </div>
              </div>
            </div>

            {/* Right Content - Video Demo */}
            <div className="relative">
              {/* Main video container */}
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl">
                {/* Video screen */}
                <div className="bg-black rounded-2xl overflow-hidden relative">
                  {/* Video header */}
                  <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex items-center space-x-2 text-white text-sm">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span>LIVE</span>
                    </div>
                  </div>
                  
                  {/* Video content */}
                  <div className="aspect-video bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
                    {/* Animated video elements */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="grid grid-cols-2 gap-4 w-full h-full p-6">
                        {/* Coach video */}
                        <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl border border-white/10 relative overflow-hidden">
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">Coach</div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          <div className="absolute bottom-2 left-2 text-white text-sm font-medium">Sarah Johnson</div>
                          {/* Animated speaking indicator */}
                          <div className="absolute bottom-2 right-2 flex space-x-1">
                            <div className="w-1 h-4 bg-green-400 rounded animate-pulse"></div>
                            <div className="w-1 h-6 bg-green-400 rounded animate-pulse delay-100"></div>
                            <div className="w-1 h-3 bg-green-400 rounded animate-pulse delay-200"></div>
                          </div>
                        </div>
                        
                        {/* Student video */}
                        <div className="bg-gradient-to-br from-indigo-600/20 to-blue-600/20 rounded-xl border border-white/10 relative overflow-hidden">
                          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">Student</div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          <div className="absolute bottom-2 left-2 text-white text-sm font-medium">Alex Chen</div>
                        </div>
                        
                        {/* Screen share area */}
                        <div className="col-span-2 bg-white/10 rounded-xl border border-white/10 relative overflow-hidden">
                          <div className="absolute top-2 left-2 bg-purple-500 text-white text-xs px-2 py-1 rounded flex items-center">
                            <Video className="w-3 h-3 mr-1" />
                            Screen Share
                          </div>
                          {/* Animated content */}
                          <div className="p-4 h-full flex items-center justify-center">
                            <div className="text-center text-white/80">
                              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-2 animate-pulse"></div>
                              <div className="text-sm">Interactive Whiteboard</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Video controls */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black/50 backdrop-blur-sm rounded-full px-6 py-2">
                      <button className="text-white hover:text-blue-400 transition-colors">
                        <Video className="w-5 h-5" />
                      </button>
                      <button className="text-white hover:text-blue-400 transition-colors">
                        <Users className="w-5 h-5" />
                      </button>
                      <button className="text-red-500 hover:text-red-400 transition-colors">
                        <div className="w-5 h-5 bg-red-500 rounded"></div>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-bounce">
                  HD Quality
                </div>
                <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-bounce delay-500">
                  Screen Share
                </div>
              </div>
              
              {/* Floating notification cards */}
              <div className="absolute top-8 -left-8 bg-white rounded-lg shadow-lg p-3 animate-float">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">New session started</div>
                    <div className="text-xs text-gray-500">with Maria Rodriguez</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-8 -right-8 bg-white rounded-lg shadow-lg p-3 animate-float delay-1000">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <div>
                    <div className="text-sm font-medium">5.0 rating</div>
                    <div className="text-xs text-gray-500">from 1,247 sessions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">10K+</div>
              <div className="text-sm text-gray-600 mt-1">Live Sessions Daily</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">500+</div>
              <div className="text-sm text-gray-600 mt-1">Video Coaches</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">99.9%</div>
              <div className="text-sm text-gray-600 mt-1">Video Uptime</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">4K</div>
              <div className="text-sm text-gray-600 mt-1">HD Quality</div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-gray-50/50 to-white relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] opacity-25"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200/50 mb-6 animate-fade-in">
              <Video className="w-4 h-4 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-purple-800">Advanced Video Technology</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Professional{" "}
              </span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                video learning
              </span>
              <br />
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                experience
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              State-of-the-art video technology designed specifically for interactive learning and coaching
            </p>
          </div>

          {/* Interactive Video Demo */}
          <div className="mb-20">
            <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-3xl p-8 relative overflow-hidden">
              {/* Floating particles */}
              <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                <div className="absolute top-20 right-20 w-1 h-1 bg-purple-400 rounded-full animate-ping delay-500"></div>
                <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping delay-1000"></div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
                {/* Left - Video Interface */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white mb-4">Live Interactive Sessions</h3>
                  
                  {/* Video call interface */}
                  <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {/* Coach video */}
                      <div className="aspect-video bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-lg relative overflow-hidden border border-white/20">
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center">
                          <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                          Coach
                        </div>
                        <div className="absolute bottom-2 right-2 flex space-x-1">
                          <div className="w-1 h-3 bg-green-400 rounded animate-pulse"></div>
                          <div className="w-1 h-5 bg-green-400 rounded animate-pulse delay-100"></div>
                          <div className="w-1 h-2 bg-green-400 rounded animate-pulse delay-200"></div>
                        </div>
                      </div>
                      
                      {/* Student video */}
                      <div className="aspect-video bg-gradient-to-br from-indigo-600/30 to-blue-600/30 rounded-lg relative overflow-hidden border border-white/20">
                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">You</div>
                      </div>
                    </div>
                    
                    {/* Controls */}
                    <div className="flex items-center justify-center space-x-4 bg-black/50 rounded-full px-6 py-3">
                      <button className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                        <Video className="w-5 h-5 text-white" />
                      </button>
                      <button className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                        <Users className="w-5 h-5 text-white" />
                      </button>
                      <button className="w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors">
                        <div className="w-4 h-4 bg-white rounded-sm"></div>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Right - Features List */}
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">4K HD Video Quality</h4>
                      <p className="text-gray-300">Crystal clear video with adaptive streaming for any connection</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Multi-Participant Sessions</h4>
                      <p className="text-gray-300">Support for up to 50 participants with breakout rooms</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Real-time Collaboration</h4>
                      <p className="text-gray-300">Interactive whiteboard, screen sharing, and file transfer</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Enterprise Security</h4>
                      <p className="text-gray-300">End-to-end encryption with SOC 2 compliance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Video,
                title: "HD Video Streaming",
                description: "Adaptive 4K streaming with low latency for seamless learning",
                gradient: "from-blue-500 to-blue-600",
                bgGradient: "from-white to-blue-50/30 hover:from-blue-50/50 hover:to-purple-50/30"
              },
              {
                icon: Users,
                title: "Interactive Breakouts",
                description: "Create instant breakout rooms for group activities and discussions",
                gradient: "from-emerald-500 to-teal-600",
                bgGradient: "from-white to-emerald-50/30 hover:from-emerald-50/50 hover:to-teal-50/30"
              },
              {
                icon: Star,
                title: "AI-Powered Insights",
                description: "Get real-time feedback and learning analytics during sessions",
                gradient: "from-purple-500 to-indigo-600",
                bgGradient: "from-white to-purple-50/30 hover:from-purple-50/50 hover:to-indigo-50/30"
              },
              {
                icon: Clock,
                title: "Session Recording",
                description: "Automatic cloud recording with searchable transcripts",
                gradient: "from-orange-500 to-amber-600",
                bgGradient: "from-white to-orange-50/30 hover:from-orange-50/50 hover:to-amber-50/30"
              },
              {
                icon: Shield,
                title: "Virtual Whiteboard",
                description: "Collaborative drawing tools with real-time synchronization",
                gradient: "from-red-500 to-rose-600",
                bgGradient: "from-white to-red-50/30 hover:from-red-50/50 hover:to-rose-50/30"
              },
              {
                icon: Zap,
                title: "One-Click Join",
                description: "No downloads required - join directly from your browser",
                gradient: "from-yellow-500 to-amber-600",
                bgGradient: "from-white to-yellow-50/30 hover:from-yellow-50/50 hover:to-amber-50/30"
              }
            ].map((feature, index) => (
              <Card key={index} className={`group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br ${feature.bgGradient} transform hover:-translate-y-2`}>
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 mb-6">
              <Play className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">Success Stories</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                See the{" "}
              </span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                transformation
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Real stories from learners who achieved their goals through live video coaching
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Product Manager",
                company: "Tech Startup",
                rating: 5,
                text: "The live video sessions transformed my leadership skills. Having real-time feedback during role-playing exercises was game-changing.",
                avatar: "SJ",
                gradient: "from-blue-500 to-purple-600"
              },
              {
                name: "Michael Chen",
                role: "Software Engineer",
                company: "Fortune 500",
                rating: 5,
                text: "Screen sharing during coding sessions helped me debug complex problems faster than I ever imagined possible.",
                avatar: "MC",
                gradient: "from-purple-500 to-indigo-600"
              },
              {
                name: "Emily Rodriguez",
                role: "Marketing Director",
                company: "Agency",
                rating: 5,
                text: "The interactive whiteboard feature made strategy sessions incredibly engaging. It's like having a coach right next to you.",
                avatar: "ER",
                gradient: "from-indigo-500 to-blue-600"
              }
            ].map((testimonial, index) => (
              <div key={index} className="group">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden">
                  {/* Video play overlay */}
                  <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  </div>
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${testimonial.gradient} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center mt-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed italic">"{testimonial.text}"</p>
                    
                    {/* Video session indicator */}
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <Video className="w-4 h-4 mr-2" />
                      <span>Completed 12 video sessions</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Video stats */}
          <div className="mt-16 bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  4.9/5
                </div>
                <div className="text-sm text-gray-600 mt-1">Average Video Session Rating</div>
              </div>
              <div className="group">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  98%
                </div>
                <div className="text-sm text-gray-600 mt-1">Session Completion Rate</div>
              </div>
              <div className="group">
                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  45min
                </div>
                <div className="text-sm text-gray-600 mt-1">Average Session Length</div>
              </div>
              <div className="group">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  24/7
                </div>
                <div className="text-sm text-gray-600 mt-1">Video Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] opacity-25"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-blue-100 border border-indigo-200/50 mb-6">
              <Play className="w-4 h-4 text-indigo-600 mr-2" />
              <span className="text-sm font-medium text-indigo-800">Video Learning Process</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Start learning in{" "}
              </span>
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                3 simple steps
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From browsing coaches to joining live video sessions - your learning journey starts here
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
            {/* Connection lines */}
            <div className="hidden lg:block absolute top-32 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-indigo-200"></div>
            
            {/* Step 1 */}
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl group-hover:scale-110 transition-all duration-500 relative z-10">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                Browse Video Coaches
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Explore profiles with video introductions, see their expertise, and read reviews from other learners
              </p>
              
              {/* Mini preview */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 group-hover:bg-white/80 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Play className="w-4 h-4 text-white ml-0.5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900">Watch intro videos</div>
                    <div className="text-xs text-gray-600">See coaches in action</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl group-hover:scale-110 transition-all duration-500 relative z-10">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-purple-700 transition-colors duration-300">
                Schedule Video Session
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Pick your preferred time slot, choose session type (1-on-1 or group), and complete secure payment
              </p>
              
              {/* Mini preview */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 group-hover:bg-white/80 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <Video className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900">Instant video room</div>
                    <div className="text-xs text-gray-600">Auto-generated for your session</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl group-hover:scale-110 transition-all duration-500 relative z-10">
                  <Video className="w-10 h-10 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">
                Join Live Session
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                One-click join to your HD video session with interactive tools, screen sharing, and real-time collaboration
              </p>
              
              {/* Mini preview */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 group-hover:bg-white/80 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900">Interactive learning</div>
                    <div className="text-xs text-gray-600">Whiteboard, chat, screen share</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video session preview */}
          <div className="mt-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-3xl p-8 relative overflow-hidden">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Experience Live Video Learning</h3>
              <p className="text-blue-100 max-w-2xl mx-auto">
                See what a typical video coaching session looks like with our advanced collaboration tools
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="aspect-video bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-lg mb-3 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white/80" />
                  </div>
                </div>
                <div className="text-white text-sm font-medium">HD Video Quality</div>
                <div className="text-blue-200 text-xs">Crystal clear 4K streaming</div>
              </div>
              
              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="aspect-video bg-gradient-to-br from-purple-600/30 to-indigo-600/30 rounded-lg mb-3 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Users className="w-8 h-8 text-white/80" />
                  </div>
                </div>
                <div className="text-white text-sm font-medium">Multi-Participant</div>
                <div className="text-purple-200 text-xs">Up to 50 learners per session</div>
              </div>
              
              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="aspect-video bg-gradient-to-br from-indigo-600/30 to-blue-600/30 rounded-lg mb-3 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white/80" />
                  </div>
                </div>
                <div className="text-white text-sm font-medium">Interactive Tools</div>
                <div className="text-indigo-200 text-xs">Whiteboard, chat, file sharing</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-8">
            <Sparkles className="w-4 h-4 text-white mr-2" />
            <span className="text-sm font-medium text-white">Join the Community</span>
          </div>
          
          <h2 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to start your
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              learning journey?
            </span>
          </h2>
          
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of learners who are already growing with Kallcast. 
            Start learning from world-class coaches today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-10 py-6 bg-white text-blue-600 hover:bg-gray-50 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 group cursor-pointer">
                Get Started Free
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
            <Link href="/register-coach">
              <Button size="lg" variant="outline" className="text-lg px-10 py-6 border-2 border-white/30 text-gray-800 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 group cursor-pointer">
                <TrendingUp className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                Teach on Kallcast
              </Button>
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-white/80">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="text-sm">No setup fees</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="text-sm">Cancel anytime</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="text-sm">Money-back guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.1))]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <Logo size="md" variant="white" href="/" className="mb-6" />
              <p className="text-gray-400 leading-relaxed mb-6">
                Connecting learners with expert coaches for transformative live learning experiences.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-lg text-white">For Learners</h4>
              <ul className="space-y-3">
                <li><Link href="/explore" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Browse Coaches</Link></li>
                <li><Link href="/register" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Sign Up</Link></li>
                <li><Link href="/login" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Sign In</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-lg text-white">For Coaches</h4>
              <ul className="space-y-3">
                <li><Link href="/register-coach" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Become a Coach</Link></li>
                <li><Link href="/earnings" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Earnings</Link></li>
                <li><Link href="/my-sessions" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">My Sessions</Link></li>
                <li><Link href="/resources" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Resources</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-lg text-white">Support</h4>
              <ul className="space-y-3">
                <li><Link href="/help" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Help Center</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Contact Us</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800/50 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                &copy; 2024 Kallcast. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <span className="text-gray-400 text-sm">Made with</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-400 text-sm">for learners worldwide</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
