import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/requireAdmin'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { authorized, error } = await requireAdmin(req)
  if (!authorized) return error

  const id = Number(params.id)

  try {
    const question = await prisma.question.findUnique({
      where: { id },
    })

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    // Parse questionTopic from JSON string to array if it's a string
    let questionTopic = question.questionTopic
    if (typeof questionTopic === 'string') {
      try {
        questionTopic = JSON.parse(questionTopic)
      } catch {
        // Keep as string if not valid JSON
      }
    }

    return NextResponse.json({ ...question, questionTopic })
  } catch (e) {
    console.error('Error fetching question:', e)
    return NextResponse.json({ error: 'Failed to fetch question' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { authorized, error } = await requireAdmin(req)
  if (!authorized) return error

  const id = Number(params.id)

  try {
    const body = await req.json()

    // Convert questionTopic array to JSON string if it's an array
    if (Array.isArray(body.questionTopic)) {
      body.questionTopic = JSON.stringify(body.questionTopic)
    }

    const question = await prisma.question.update({
      where: { id },
      data: body,
    })

    return NextResponse.json(question)
  } catch (e) {
    console.error('Error updating question:', e)
    return NextResponse.json({ error: 'Failed to update question' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { authorized, error } = await requireAdmin(req)
  if (!authorized) return error

  const id = Number(params.id)

  try {
    await prisma.question.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Error deleting question:', e)
    return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 })
  }
}
