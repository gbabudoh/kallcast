import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Legacy Redirects - Move to top for priority
  if (pathname === '/dashboard/learner' || pathname === '/dashboard/coach') {
    const target = pathname.includes('learner') ? '/learner/dashboard' : '/coach/dashboard';
    return NextResponse.redirect(new URL(target, request.url));
  }
  
  if (pathname === '/explore') {
    return NextResponse.redirect(new URL('/learner/explore', request.url));
  }
  
  if (pathname === '/my-bookings') {
    return NextResponse.redirect(new URL('/learner/my-bookings', request.url));
  }

  if (pathname === '/students') {
    return NextResponse.redirect(new URL('/coach/students', request.url));
  }
  
  // Get token from cookie
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const isLoggedIn = !!token;
  const userRole = token?.role as string;

  // Legacy Coach Redirects
  if (pathname === '/my-sessions' && userRole === 'coach') {
    return NextResponse.redirect(new URL('/coach/my-sessions', request.url));
  }

  if (pathname === '/earnings' && userRole === 'coach') {
    return NextResponse.redirect(new URL('/coach/earnings', request.url));
  }

  if (pathname === '/my-sessions' && userRole === 'learner') {
    return NextResponse.redirect(new URL('/learner/my-sessions', request.url));
  }

  // Public routes that don't require authentication
  const publicRoutes = [
    '/login',
    '/register',
    '/pricing',
    '/resources',
    '/explain',
    '/api/auth',
  ];

  // Public Access Logic
  const isPublicRoute = (pathname === '/') || publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  );

  // If user is already logged in and trying to access landing/auth pages, redirect to dashboard
  const authRoutes = ['/login', '/register', '/register-coach'];
  const isAuthRoute = authRoutes.some(route => pathname === route || pathname.startsWith(route));
  const isHomePage = pathname === '/';

  if (isLoggedIn && (isAuthRoute || isHomePage)) {
    const dashboardUrl = userRole === 'coach' ? '/coach/dashboard' : '/learner/dashboard';
    return NextResponse.redirect(new URL(dashboardUrl, request.url));
  }

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // If user is not logged in and trying to access protected route
  if (!isLoggedIn) {
    // Specific redirects for Coach features vs Learner/General features
    const isLoginRequired = pathname.includes('/earnings') || pathname.includes('/my-sessions') || pathname.includes('/coach/dashboard');
    const targetPath = isLoginRequired ? '/login' : '/register';
    
    const redirectUrl = new URL(targetPath, request.url);
    redirectUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Role-based access control
  // Coach-only routes
  const coachRoutes = [
    '/coach/dashboard',
    '/coach/my-sessions',
    '/coach/earnings',
    '/coach/students',
    '/api/coaches',
    '/api/slots',
  ];

  const isCoachRoute = coachRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isCoachRoute && userRole !== 'coach') {
    return NextResponse.redirect(new URL('/learner/dashboard', request.url));
  }

  // Learner-only routes
  const learnerRoutes = [
    '/learner/my-bookings',
    '/learner/my-sessions',
    '/learner/explore',
    '/learner/dashboard',
  ];

  const isLearnerRoute = learnerRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Note: We allow coaches to access learner routes if they want to "Learn"
  if (isLearnerRoute && userRole !== 'learner' && userRole !== 'coach') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - IMPORTANT: don't block auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
