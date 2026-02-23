import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData } from '@/lib/session'

export async function GET(req: NextRequest) {
  try {
    const res = NextResponse.next()
    const session = await getIronSession<SessionData>(req, res, sessionOptions)

    if (!session.isAdmin) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({ authenticated: true })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
