import { NextRequest, NextResponse } from 'next/server'
import { getServerSideURL } from './utilities/getURL'
import { Purchases } from '@revenuecat/purchases-js'
import { RevenueCatProvider } from './providers/RevenueCat'

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
  if (pathname.startsWith('/admin')) {
    try {
      // Get user ID from the auth token
      const token = authCookie.value
      const userResponse = await fetch(`${getServerSideURL()}/api/users/me`, {
        headers: {
          Authorization: `JWT ${token}`,
        },
      })
      
      if (!userResponse.ok) {
        return NextResponse.redirect(new URL('/login', request.url))
      }

      const { user } = await userResponse.json()
      
      if (!user?.id) {
        return NextResponse.redirect(new URL('/login', request.url))
      }

      // Initialize RevenueCat with the user's ID
      const purchases = Purchases.configure(
        process.env.NEXT_PUBLIC_REVENUECAT_PUBLIC_SDK_KEY!,
        String(user.id)
      )

      // Check if user has active entitlements
      const customerInfo = await purchases.getCustomerInfo()
      console.log('RevenueCat Customer ID:', customerInfo.originalAppUserId)
      console.log('Active Entitlements:', Object.keys(customerInfo.entitlements.active))
      const hasActiveSubscription = Object.keys(customerInfo.entitlements.active).length > 0

      if (!hasActiveSubscription) {
        return NextResponse.redirect(new URL('/subscribe', request.url))
        console.log(RevenueCatProvider)
      }
    } catch (error) {
      console.error('Error checking subscription status:', error)
      return NextResponse.redirect(new URL('/subscribe', request.url))
    }
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