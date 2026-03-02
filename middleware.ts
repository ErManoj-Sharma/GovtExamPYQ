import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData } from './src/lib/session'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    try {
      const res = NextResponse.next()
      const session = await getIronSession<SessionData>(req, res, sessionOptions)

      if (!(session as SessionData).isAdmin) {
        return NextResponse.redirect(new URL('/admin/login', req.url))
      }
    } catch {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
