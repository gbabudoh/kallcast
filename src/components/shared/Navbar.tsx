'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/ui/logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, User, Settings, LogOut } from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Logo size="md" variant="default" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/dashboard" className="text-gray-700 hover:text-gray-900">
              Dashboard
            </a>
            <a href="/explore" className="text-gray-700 hover:text-gray-900">
              Explore
            </a>
            {session?.user?.role === 'learner' && (
              <a href="/my-bookings" className="text-gray-700 hover:text-gray-900">
                My Bookings
              </a>
            )}
            {session?.user?.role === 'coach' && (
              <>
                <a href="/my-sessions" className="text-gray-700 hover:text-gray-900">
                  My Sessions
                </a>
                <a href="/earnings" className="text-gray-700 hover:text-gray-900">
                  Earnings
                </a>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full cursor-pointer">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user.profileImage} alt={session.user.firstName} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold">
                        {session.user.firstName?.[0]}{session.user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.user.firstName} {session.user.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a href="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <a href="/login">
                  <Button variant="ghost">Sign In</Button>
                </a>
                <a href="/register">
                  <Button>Get Started</Button>
                </a>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <a
                href="/dashboard"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </a>
              <a
                href="/explore"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Explore
              </a>
              {session?.user?.role === 'learner' && (
                <a
                  href="/my-bookings"
                  className="block px-3 py-2 text-gray-700 hover:text-gray-900"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Bookings
                </a>
              )}
              {session?.user?.role === 'coach' && (
                <>
                  <a
                    href="/my-sessions"
                    className="block px-3 py-2 text-gray-700 hover:text-gray-900"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Sessions
                  </a>
                  <a
                    href="/earnings"
                    className="block px-3 py-2 text-gray-700 hover:text-gray-900"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Earnings
                  </a>
                </>
              )}
              {session && (
                <>
                  <a
                    href="/settings"
                    className="block px-3 py-2 text-gray-700 hover:text-gray-900"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Settings
                  </a>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Sign out
                  </button>
                </>
              )}
              {!session && (
                <>
                  <a
                    href="/login"
                    className="block px-3 py-2 text-gray-700 hover:text-gray-900"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </a>
                  <a
                    href="/register"
                    className="block px-3 py-2 text-gray-700 hover:text-gray-900"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
