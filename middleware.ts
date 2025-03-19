import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if the user is authenticated by looking for the currentUser in localStorage
  // Note: This is a client-side check, so we can't do it in middleware
  // In a real app, you would use a server-side session or JWT token

  // For now, we'll just check if the path is /dashboard and redirect to /auth/signin if needed
  // The actual authentication check will happen in the dashboard page component

  // This is just to demonstrate the concept
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/courses/:path*"],
}

