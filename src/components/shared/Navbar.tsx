'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/ui/logo';
import { ROUTES } from '@/constants/routes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, Settings, LogOut } from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  // Determine role based on path (works immediately) or session (after load)
  const isCoachPath = pathname?.startsWith('/coach');
  const isLearnerPath = pathname?.startsWith('/learner');
  const isCoach = session?.user?.role === 'coach' || isCoachPath;
  const isDashboardRoute = isCoachPath || isLearnerPath;

  // Show nav links if on dashboard routes OR if session exists
  const showNavLinks = isDashboardRoute || !!session;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Logo 
              size="md" 
              variant="default" 
              href={showNavLinks ? (isCoach ? ROUTES.DASHBOARD.COACH_BASE : ROUTES.DASHBOARD.LEARNER_BASE) : ROUTES.HOME} 
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {showNavLinks && (
              <>
                <a 
                  href={isCoach ? ROUTES.DASHBOARD.COACH_BASE : ROUTES.DASHBOARD.LEARNER_BASE} 
                  className="text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors"
                >
                  Dashboard
                </a>
                {!isCoach && (
                  <a href={ROUTES.LEARNER.EXPLORE} className="text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors">
                    Explore
                  </a>
                )}
                <a 
                  href={isCoach ? ROUTES.COACH.MY_SESSIONS : ROUTES.LEARNER.MY_SESSIONS} 
                  className="text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors"
                >
                  My Sessions
                </a>
                {isCoach && (
                  <>
                    <a href={ROUTES.COACH.BOOKINGS} className="text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors">
                      Bookings
                    </a>
                    <a href={ROUTES.COACH.EARNINGS} className="text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors">
                      Earnings
                    </a>
                  </>
                )}
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {!mounted || status === 'loading' ? (
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
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
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <a href={isCoach ? ROUTES.COACH.SETTINGS : ROUTES.LEARNER.SETTINGS} className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : !isDashboardRoute ? (
              <div className="flex items-center space-x-2">
                <a href="/login">
                  <Button variant="ghost">Sign In</Button>
                </a>
                <a href="/register">
                  <Button>Get Started</Button>
                </a>
              </div>
            ) : (
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
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
              {showNavLinks && (
                <>
                  <a
                    href={isCoach ? ROUTES.DASHBOARD.COACH_BASE : ROUTES.DASHBOARD.LEARNER_BASE}
                    className="block px-3 py-2 text-gray-700 hover:text-gray-900 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </a>
                  {!isCoach && (
                    <a
                      href={ROUTES.LEARNER.EXPLORE}
                      className="block px-3 py-2 text-gray-700 hover:text-gray-900 font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Explore
                    </a>
                  )}
                  <a
                    href={isCoach ? ROUTES.COACH.MY_SESSIONS : ROUTES.LEARNER.MY_SESSIONS}
                    className="block px-3 py-2 text-gray-700 hover:text-gray-900 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Sessions
                  </a>
                  {isCoach && (
                    <>
                      <a
                        href={ROUTES.COACH.BOOKINGS}
                        className="block px-3 py-2 text-gray-700 hover:text-gray-900 font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Bookings
                      </a>
                      <a
                        href={ROUTES.COACH.EARNINGS}
                        className="block px-3 py-2 text-gray-700 hover:text-gray-900 font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Earnings
                      </a>
                    </>
                  )}
                  {session && (
                    <>
                      <a
                        href={isCoach ? ROUTES.COACH.SETTINGS : ROUTES.LEARNER.SETTINGS}
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
                </>
              )}
              {!showNavLinks && (
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
