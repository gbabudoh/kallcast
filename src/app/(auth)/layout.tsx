import { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Logo size="md" variant="default" className="mb-4" />
            <p className="text-sm text-gray-600">
              Live Video Learning Platform
            </p>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
}
