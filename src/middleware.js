import { NextResponse } from 'next/server';

export function middleware(request) {
  const session = request.cookies.get('admin_session');
  const isAuthenticated = session?.value === 'authenticated';
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  if (pathname === '/') {
    return NextResponse.redirect(
      new URL(isAuthenticated ? '/admin/dashboard' : '/login', request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/admin/:path*'],
};
