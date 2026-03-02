import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData } from '@/lib/session'
import fs from 'fs'
import path from 'path'

async function requireAdmin(req: NextRequest) {
  const res = NextResponse.next()
  const session = await getIronSession<SessionData>(req, res, sessionOptions)
  if (!session.isAdmin) {
    return {
      authorized: false,
      error: NextResponse.json({ error: 'Unauthorized', success: false }, { status: 401 }),
    }
  }
  return { authorized: true, error: null }
}

const isProduction = process.env.NODE_ENV === 'production'

const reportsFilePath = isProduction
  ? '/tmp/question_reports.json'
  : path.join(process.cwd(), 'public', 'reports', 'question_reports.json')

function ensureReportsFile() {
  const dir = path.dirname(reportsFilePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(reportsFilePath)) {
    fs.writeFileSync(reportsFilePath, JSON.stringify([], null, 2))
  }
}

function readReports() {
  ensureReportsFile()
  const fileContent = fs.readFileSync(reportsFilePath, 'utf-8')
  return JSON.parse(fileContent)
}

function writeReports(reports) {
  fs.writeFileSync(reportsFilePath, JSON.stringify(reports, null, 2))
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.authorized) return auth.error

  try {
    const reports = readReports()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let filteredReports = reports
    if (status && status !== 'all') {
      filteredReports = reports.filter((r: { status: string }) => r.status === status)
    }

    return NextResponse.json({
      success: true,
      reports: filteredReports,
      storage: isProduction ? 'temporary production storage (/tmp)' : 'development storage (public/reports)',
    })
  } catch (error) {
    console.error('Error reading reports:', error)
    return NextResponse.json({ success: false, error: 'Failed to read reports' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.authorized) return auth.error

  try {
    const { id, status } = await request.json()
    const reports = readReports()
    const index = reports.findIndex((r: { id: string }) => r.id === id)

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Report not found' }, { status: 404 })
    }

    reports[index].status = status
    writeReports(reports)

    return NextResponse.json({ success: true, report: reports[index] })
  } catch (error) {
    console.error('Error updating report:', error)
    return NextResponse.json({ success: false, error: 'Failed to update report' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.authorized) return auth.error

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Report ID required' }, { status: 400 })
    }

    const reports = readReports()
    const filteredReports = reports.filter((r: { id: string }) => r.id !== id)
    writeReports(filteredReports)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting report:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete report' }, { status: 500 })
  }
}

// POST - Public endpoint for users to submit reports (no auth required)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newReport = {
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...body,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    const reports = readReports()
    reports.unshift(newReport)
    writeReports(reports)

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully',
      report: newReport,
    })
  } catch (error) {
    console.error('Error submitting report:', error)
    return NextResponse.json({ success: false, error: 'Failed to submit report' }, { status: 500 })
  }
}
