'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Question {
  examType: string
  questionTopic: string
}

export default function NewQuestionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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
    questionTopic: '',
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
  }, [])

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
      const res = await fetch('/api/admin/questions', {
        method: 'POST',
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
        setError(data.error || 'Failed to create question')
      }
    } catch {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Add New Question</h1>
      
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
              list="exam-names"
            />
            <datalist id="exam-names">
              {suggestions.examTypes.map(et => (
                <option key={et} value={et} />
              ))}
            </datalist>
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
          <input
            type="text"
            value={formData.questionTopic}
            onChange={(e) => setFormData({ ...formData, questionTopic: e.target.value })}
            className="w-full p-2 border rounded dark:bg-primary-dark-200 dark:text-black"
            required
            list="subjects"
          />
          <datalist id="subjects">
            {suggestions.subjects.map(s => (
              <option key={s} value={s} />
            ))}
          </datalist>
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
              className="w-full p-2 border rounded dark:bg-primary-dark-200 dark:text-black"
              placeholder="/path/to/image.jpg"
            />
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Saving...' : 'Save Question'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="px-6 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500 dark:text-white"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
