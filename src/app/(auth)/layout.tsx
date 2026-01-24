import { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Authentication - Kallcast',
  description: 'Sign in or create an account on Kallcast',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden flex flex-col font-sans">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-[20%] -left-[10%] w-[30%] h-[30%] bg-purple-100/30 rounded-full blur-[100px] animate-pulse delay-700"></div>
        <div className="absolute bottom-[10%] right-[20%] w-[25%] h-[25%] bg-indigo-100/40 rounded-full blur-[90px] animate-pulse delay-1000"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Header Navigation */}
      <header className="relative z-20 w-full px-6 py-6 lg:px-12 flex justify-between items-center bg-white/10 backdrop-blur-md border-b border-white/20">
        <Logo size="md" variant="default" />
        <Link 
          href="/" 
          className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to website
        </Link>
      </header>
      
      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
