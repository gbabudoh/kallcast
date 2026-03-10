import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookie first
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const isLoggedIn = !!token;
  const userRole = token?.role as string;

  // ============================================
  // COACH LOCKDOWN - Coaches stay in coach area
  // ============================================
  if (isLoggedIn && userRole === 'coach') {
    // Allowed routes for coaches
    const allowedCoachPaths = [
      '/coach',
      '/session',
      '/settings',
    ];
    
    const isAllowedPath = allowedCoachPaths.some(path => pathname.startsWith(path));
    
    // If coach tries to access anything outside their allowed area, redirect to coach dashboard
    if (!isAllowedPath) {
      return NextResponse.redirect(new URL('/coach/dashboard', request.url));
    }
  }

  // ============================================
  // Legacy Redirects
  // ============================================
  if (pathname === '/dashboard/learner' || pathname === '/dashboard/coach') {
    const target = pathname.includes('learner') ? '/learner/dashboard' : '/coach/dashboard';
    return NextResponse.redirect(new URL(target, request.url));
  }
  
  if (pathname === '/explore') {
    if (isLoggedIn && userRole === 'coach') {
      return NextResponse.redirect(new URL('/coach/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/learner/explore', request.url));
  }
  
  if (pathname === '/my-bookings') {
    if (!isLoggedIn) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('callbackUrl', '/learner/my-bookings');
      return NextResponse.redirect(redirectUrl);
    }
    if (userRole === 'coach') {
      return NextResponse.redirect(new URL('/coach/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/learner/my-bookings', request.url));
  }

  if (pathname === '/students') {
    if (!isLoggedIn) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('callbackUrl', '/coach/students');
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.redirect(new URL('/coach/students', request.url));
  }

  if (pathname === '/my-sessions') {
    if (!isLoggedIn) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    const target = userRole === 'coach' ? '/coach/my-sessions' : '/learner/my-sessions';
    return NextResponse.redirect(new URL(target, request.url));
  }

  if (pathname === '/earnings') {
    if (!isLoggedIn) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    if (userRole === 'coach') {
      return NextResponse.redirect(new URL('/coach/earnings', request.url));
    }
    return NextResponse.redirect(new URL('/learner/dashboard', request.url));
  }

  // ============================================
  // Public routes
  // ============================================
  const publicRoutes = ['/login', '/register', '/pricing', '/resources', '/explain'];
  const isPublicRoute = pathname === '/' || publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  );

  // Redirect logged-in users away from auth pages
  const authRoutes = ['/login', '/register', '/register-coach'];
  const isAuthRoute = authRoutes.some(route => pathname === route || pathname.startsWith(route));

  if (isLoggedIn && (isAuthRoute || pathname === '/')) {
    const dashboardUrl = userRole === 'coach' ? '/coach/dashboard' : '/learner/dashboard';
    return NextResponse.redirect(new URL(dashboardUrl, request.url));
  }

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // ============================================
  // Protected routes - require login
  // ============================================
  if (!isLoggedIn) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // ============================================
  // Role-based access control
  // ============================================
  
  // Prevent learners from accessing coach routes
  if (pathname.startsWith('/coach') && userRole !== 'coach') {
    return NextResponse.redirect(new URL('/learner/dashboard', request.url));
  }

  // Prevent coaches from accessing learner routes (already handled above, but double-check)
  if (pathname.startsWith('/learner') && userRole === 'coach') {
    return NextResponse.redirect(new URL('/coach/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
