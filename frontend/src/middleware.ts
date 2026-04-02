import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected route patterns
const protectedRoutes = {
  admin: /^\/admin(?!\/login)/,
  agent: /^\/agent(?!\/login)/,
  customer: /^\/customer/,
};

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/search',
  '/admin/login',
  '/agent/login',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for authentication token in cookies
  const token = request.cookies.get('auth-token')?.value;
  const userRole = request.cookies.get('user-role')?.value;

  // Check admin routes
  if (protectedRoutes.admin.test(pathname)) {
    if (!token || userRole !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Check agent routes
  if (protectedRoutes.agent.test(pathname)) {
    if (!token || userRole !== 'agent') {
      return NextResponse.redirect(new URL('/agent/login', request.url));
    }
  }

  // Check customer routes
  if (protectedRoutes.customer.test(pathname)) {
    if (!token || userRole !== 'customer') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};
