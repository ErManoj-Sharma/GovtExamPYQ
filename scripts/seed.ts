import { prisma } from '../src/lib/prisma'
import { DB29 } from '../src/app/Constants/ExamPaper/4thGrade/DB29'
import { DS22 } from '../src/app/Constants/ExamPaper/4thGrade/DS22'
import { HH56 } from '../src/app/Constants/ExamPaper/4thGrade/56HH'
import { A131_2023 } from '../src/app/Constants/ExamPaper/CETGraduation/131A-2023'
import { B131_2023 } from '../src/app/Constants/ExamPaper/CETGraduation/131B-2023'
import { C131_2023 } from '../src/app/Constants/ExamPaper/CETGraduation/131C-2023'
import { D131_2023 } from '../src/app/Constants/ExamPaper/CETGraduation/131D-2023'

function extractYear(examName: string): number | null {
  const match = examName.match(/\b(19|20)\d{2}\b/)
  return match ? parseInt(match[0], 10) : null
}

type RawQuestion = {
  question_number: number
  question_text: string
  options: Record<string, string | number>
  auto_assigned: boolean
  exam_name: string
  verified: boolean
  exam_type: string
  question_topic: string | string[]
  correct_answer: string
  image_required?: boolean
  question_type?: string
  image_url?: string
  description?: Record<string, unknown>
}

function transformQuestion(q: RawQuestion) {
  const topic = Array.isArray(q.question_topic) ? q.question_topic[0] : q.question_topic
  const stringOptions: Record<string, string> = {}
  for (const [key, value] of Object.entries(q.options)) {
    stringOptions[key] = String(value)
  }
  return {
    examName: q.exam_name,
    examType: q.exam_type,
    questionNumber: q.question_number,
    questionText: q.question_text,
    questionTopic: topic,
    options: stringOptions,
    correctAnswer: q.correct_answer,
    autoAssigned: q.auto_assigned,
    verified: q.verified,
    imageRequired: q.image_required ?? false,
    imageUrl: q.image_url ?? null,
    questionType: q.question_type ?? null,
    description: q.description ?? null,
    year: extractYear(q.exam_name),
  }
}

async function main() {
  const existingCount = await prisma.question.count()
  if (existingCount > 0) {
    console.log(`Database already has ${existingCount} questions. Skipping seed.`)
    return
  }

  const allQuestions = [
    ...DB29,
    ...DS22,
    ...HH56,
    ...A131_2023,
    ...B131_2023,
    ...C131_2023,
    ...D131_2023,
  ] as RawQuestion[]

  const transformed = allQuestions.map(transformQuestion)

  const chunkSize = 100
  for (let i = 0; i < transformed.length; i += chunkSize) {
    const chunk = transformed.slice(i, i + chunkSize)
    await prisma.question.createMany({
      data: chunk,
      skipDuplicates: true,
    })
    console.log(`Inserted ${Math.min(i + chunkSize, transformed.length)} / ${transformed.length} questions`)
  }

  console.log(`Successfully seeded ${transformed.length} questions.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
