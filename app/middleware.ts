import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Check if the user has the admin session cookie
  const isLoggedIn = request.cookies.get('admin_session')?.value === 'true';
  
  // 2. Check if they are trying to access the admin dashboard
  const isOnAdminPage = request.nextUrl.pathname.startsWith('/admin');

  // 3. If they are trying to access /admin and are NOT logged in, redirect them to login
  if (isOnAdminPage && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. If they are on the login page but ALREADY logged in, send them straight to admin
  if (request.nextUrl.pathname === '/login' && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

// This ensures the middleware ONLY runs on admin and login pages
export const config = {
  matcher: ['/admin/:path*', '/login'],
};