import { NextRequest, NextResponse } from 'next/server'
import { getServerSideURL } from './utilities/getURL'

// Paths that require authentication
const PROTECTED_PATHS = ['/admin']

// Paths that are always allowed
const PUBLIC_PATHS = ['/login', '/subscribe']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next()
  }

  // Check if path requires protection
  const isProtectedPath = PROTECTED_PATHS.some((path) => pathname.startsWith(path))
  if (!isProtectedPath) {
    return NextResponse.next()
  }

  // Get auth cookie
  const authCookie = request.cookies.get('payload-token')
  if (!authCookie?.value) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Check subscription status for admin routes
  const subscriptionCookie = request.cookies.get('rc-subscription')
  if (pathname.startsWith('/admin') && !subscriptionCookie?.value) {
    return NextResponse.redirect(new URL('/subscribe', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 