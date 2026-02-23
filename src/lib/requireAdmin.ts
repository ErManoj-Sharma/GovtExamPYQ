import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData } from './session'

export async function requireAdmin(req: NextRequest) {
  const res = NextResponse.next()
  const session = await getIronSession<SessionData>(req, res, sessionOptions)
  if (!session.isAdmin) {
    return {
      authorized: false,
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }
  return { authorized: true, error: null }
}
