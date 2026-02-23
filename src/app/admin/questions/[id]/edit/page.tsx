'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import MultiSelect from '@/app/Components/MultiSelect'
import { categories } from '@/app/Constants/category'

interface Question {
  id: number
  examName: string
  examType: string
  questionNumber: number
  questionText: string
  questionTopic: string | string[]
  options: Record<string, string>
  correctAnswer: string
  imageRequired: boolean
  imageUrl: string | null
  questionType: string | null
  year: number | null
}

export default function EditQuestionPage() {
  const router = useRouter()
  const params = useParams()
  const id = Number(params.id)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState('')
  const [suggestions, setSuggestions] = useState<{ examTypes: string[]; subjects: string[] }>({
    examTypes: [],
    subjects: [],
  })
  const [formData, setFormData] = useState({
    examName: '',
    examType: '',
    questionNumber: 1,
    questionText: '',
    questionTopic: [] as string[],
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    imageRequired: false,
    imageUrl: '',
    questionType: '',
    year: '',
  })

  useEffect(() => {
    fetch('/api/admin/questions?page=1')
      .then(res => res.json())
      .then(data => {
        setSuggestions({
          examTypes: data.examTypes || [],
          subjects: data.subjects || [],
        })
      })

    fetch(`/api/admin/questions/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          const question = data as Question
          // Handle questionTopic that can be string or array
          const topicValue = question.questionTopic
          const topicArray = Array.isArray(topicValue) 
            ? topicValue 
            : typeof topicValue === 'string' 
              ? topicValue.split(',').map(t => t.trim()).filter(Boolean)
              : []
          
          setFormData({
            examName: question.examName,
            examType: question.examType,
            questionNumber: question.questionNumber,
            questionText: question.questionText,
            questionTopic: topicArray,
            optionA: question.options.A || '',
            optionB: question.options.B || '',
            optionC: question.options.C || '',
            optionD: question.options.D || '',
            correctAnswer: question.correctAnswer,
            imageRequired: question.imageRequired,
            imageUrl: question.imageUrl || '',
            questionType: question.questionType || '',
            year: question.year?.toString() || '',
          })
        }
        setInitialLoading(false)
      })
      .catch(() => {
        setError('Failed to load question')
        setInitialLoading(false)
      })
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const options: Record<string, string> = {
      A: formData.optionA,
      B: formData.optionB,
      C: formData.optionC,
      D: formData.optionD,
    }

    try {
      const res = await fetch(`/api/admin/questions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examName: formData.examName,
          examType: formData.examType,
          questionNumber: formData.questionNumber,
          questionText: formData.questionText,
          questionTopic: formData.questionTopic,
          options,
          correctAnswer: formData.correctAnswer,
          imageRequired: formData.imageRequired,
          imageUrl: formData.imageUrl || null,
          questionType: formData.questionType || null,
          year: formData.year ? parseInt(formData.year) : null,
        }),
      })

      if (res.ok) {
        router.push('/admin')
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to update question')
      }
    } catch {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return <div className="text-center py-8 dark:text-white">Loading...</div>
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Edit Question</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-light-black p-6 rounded shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Exam Name *</label>
            <input
              type="text"
              value={formData.examName}
              onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
              className="w-full p-2 border rounded dark:bg-primary-dark-200 dark:text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Exam Type *</label>
            <input
              type="text"
              value={formData.examType}
              onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
              className="w-full p-2 border rounded dark:bg-primary-dark-200 dark:text-black"
              required
              list="exam-types"
            />
            <datalist id="exam-types">
              {suggestions.examTypes.map(et => (
                <option key={et} value={et} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Question Number *</label>
            <input
              type="number"
              value={formData.questionNumber}
              onChange={(e) => setFormData({ ...formData, questionNumber: parseInt(e.target.value) })}
              className="w-full p-2 border rounded dark:bg-primary-dark-200 dark:text-black"
              required
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Year</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full p-2 border rounded dark:bg-primary-dark-200 dark:text-black"
              placeholder="2025"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Question Type</label>
            <select
              value={formData.questionType}
              onChange={(e) => setFormData({ ...formData, questionType: e.target.value })}
              className="w-full p-2 border rounded dark:bg-primary-dark-200 dark:text-black"
            >
              <option value="">Regular</option>
              <option value="Match_List1_With_L2">Match List</option>
              <option value="Image-Based-Question">Image Based</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 dark:text-white">Subject/Topic *</label>
          <MultiSelect
            options={categories}
            selected={formData.questionTopic}
            onChange={(selected) => setFormData({ ...formData, questionTopic: selected })}
            placeholder="Search and select subjects..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 dark:text-white">Question Text *</label>
          <textarea
            value={formData.questionText}
            onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
            className="w-full p-2 border rounded dark:bg-primary-dark-200 dark:text-black"
            required
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Option A *</label>
            <input
              type="text"
              value={formData.optionA}
              onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
              className="w-full p-2 border rounded dark:bg-primary-dark-200 dark:text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Option B *</label>
            <input
              type="text"
              value={formData.optionB}
              onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
              className="w-full p-2 border rounded dark:bg-primary-dark-200 dark:text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Option C *</label>
            <input
              type="text"
              value={formData.optionC}
              onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
              className="w-full p-2 border rounded dark:bg-primary-dark-200 dark:text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Option D *</label>
            <input
              type="text"
              value={formData.optionD}
              onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
              className="w-full p-2 border rounded dark:bg-primary-dark-200 dark:text-black"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 dark:text-white">Correct Answer *</label>
          <select
            value={formData.correctAnswer}
            onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
            className="w-full p-2 border rounded dark:bg-primary-dark-200 dark:text-black"
            required
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            id="imageRequired"
            checked={formData.imageRequired}
            onChange={(e) => setFormData({ ...formData, imageRequired: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="imageRequired" className="dark:text-white">Image Required</label>
        </div>

        {formData.imageRequired && (
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Image URL</label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              placeholder="/path/to/image.jpg"
            />
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-white font-medium rounded hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="px-6 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:opacity-80 dark:text-white font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
