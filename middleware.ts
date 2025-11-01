import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/register-coach',
    '/api/auth',
  ];

  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  );

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // If user is not logged in and trying to access protected route
  if (!isLoggedIn) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access control
  const userRole = req.auth?.user?.role;

  // Coach-only routes
  const coachRoutes = [
    '/my-sessions',
    '/earnings',
    '/api/coaches',
    '/api/slots',
  ];

  const isCoachRoute = coachRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isCoachRoute && userRole !== 'coach') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Learner-only routes
  const learnerRoutes = [
    '/my-bookings',
  ];

  const isLearnerRoute = learnerRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isLearnerRoute && userRole !== 'learner') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
