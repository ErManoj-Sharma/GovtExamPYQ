import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/requireAdmin'

export async function GET(req: NextRequest) {
  const { authorized, error } = await requireAdmin(req)
  if (!authorized) return error

  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get('page') ?? 1)
  const examName = searchParams.get('examName') ?? undefined
  const subject = searchParams.get('subject') ?? undefined
  const year = searchParams.get('year') ? Number(searchParams.get('year')) : undefined

  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      where: {
        ...(examName && { examName }),
        ...(subject && { questionTopic: subject }),
        ...(year && { year }),
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * 20,
      take: 20,
    }),
    prisma.question.count({
      where: {
        ...(examName && { examName }),
        ...(subject && { questionTopic: subject }),
        ...(year && { year }),
      },
    }),
  ])

  const examTypes = await prisma.question.findMany({
    select: { examType: true },
    distinct: ['examType'],
  })

  const subjects = await prisma.question.findMany({
    select: { questionTopic: true },
    distinct: ['questionTopic'],
  })

  const years = await prisma.question.findMany({
    select: { year: true },
    distinct: ['year'],
    where: { year: { not: null } },
  })

  return NextResponse.json({
    questions,
    total,
    page,
    examTypes: examTypes.map(e => e.examType),
    subjects: subjects.map(s => s.questionTopic),
    years: years.map(y => y.year).filter(Boolean) as number[],
  })
}

export async function POST(req: NextRequest) {
  const { authorized, error } = await requireAdmin(req)
  if (!authorized) return error

  const body = await req.json()

  const {
    examName,
    examType,
    questionNumber,
    questionText,
    questionTopic,
    options,
    correctAnswer,
    imageRequired,
    imageUrl,
    questionType,
    description,
    year,
  } = body

  if (!examName || !examType || !questionNumber || !questionText || !questionTopic || !options || !correctAnswer) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  try {
    const question = await prisma.question.create({
      data: {
        examName,
        examType,
        questionNumber,
        questionText,
        questionTopic,
        options,
        correctAnswer,
        autoAssigned: false,
        verified: true,
        imageRequired: imageRequired ?? false,
        imageUrl: imageUrl ?? null,
        questionType: questionType ?? null,
        description: description ?? null,
        year: year ?? null,
      },
    })

    return NextResponse.json(question, { status: 201 })
  } catch (e) {
    console.error('Error creating question:', e)
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    )
  }
}
