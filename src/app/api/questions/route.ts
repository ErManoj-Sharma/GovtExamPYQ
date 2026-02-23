import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function extractYear(examName: string): string | null {
  const match = examName.match(/\b(19|20)\d{2}\b/)
  return match ? match[0] : null
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const examTypes = searchParams.get('examTypes')?.split(',').filter(Boolean) || []
  const year = searchParams.get('year')
  const search = searchParams.get('search') || ''

  const where: Record<string, unknown> = {}

  if (examTypes.length > 0 && !examTypes.includes('All Exams')) {
    where.examType = { in: examTypes }
  }

  if (year && year !== 'all') {
    const examYear = parseInt(year)
    where.year = examYear
  }

  if (search.trim()) {
    const searchTerms = search.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
    where.OR = searchTerms.map(term => [
      { questionText: { contains: term, mode: 'insensitive' } },
      { examName: { contains: term, mode: 'insensitive' } },
      { questionTopic: { contains: term, mode: 'insensitive' } },
    ]).flat()
  }

  try {
    const questions = await prisma.question.findMany({
      where,
      orderBy: [{ year: 'desc' }, { questionNumber: 'asc' }],
    })

    const examTypesResult = await prisma.question.findMany({
      select: { examType: true },
      distinct: ['examType'],
    })

    const yearsResult = await prisma.question.findMany({
      select: { year: true },
      distinct: ['year'],
      where: { year: { not: null } },
    })

    return NextResponse.json({
      questions,
      examTypes: examTypesResult.map(e => e.examType),
      years: yearsResult.map(y => y.year).filter(Boolean) as number[],
    })
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
  }
}
