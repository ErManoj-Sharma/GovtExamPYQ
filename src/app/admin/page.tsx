'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface Question {
  id: number
  examName: string
  examType: string
  questionNumber: number
  questionText: string
  questionTopic: string
  year: number | null
}

function CustomSelect({ 
  value, 
  onChange, 
  options, 
  placeholder 
}: { 
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selected = options.find(o => o.value === value)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2 border rounded bg-white dark:bg-black text-left flex justify-between items-center text-primary dark:text-primary-dark"
      >
        <span>{selected?.label || placeholder}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 border rounded bg-white dark:bg-black shadow-lg max-h-60 overflow-auto">
          <div
            onClick={() => { onChange(''); setIsOpen(false) }}
            className={`p-2 cursor-pointer ${!value ? 'bg-primary-dark text-white' : 'text-primary dark:text-primary-dark'} hover:bg-primary-dark hover:text-white`}
          >
            {placeholder}
          </div>
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => { onChange(opt.value); setIsOpen(false) }}
              className={`p-2 cursor-pointer ${value === opt.value ? 'dark:bg-primary-dark text-white' : 'text-primary dark:text-primary-dark'} hover:bg-primary-dark hover:dark:text-white`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AdminDashboard() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [examTypes, setExamTypes] = useState<string[]>([])
  const [subjects, setSubjects] = useState<string[]>([])
  const [years, setYears] = useState<number[]>([])
  const [filters, setFilters] = useState({ examName: '', subject: '', year: '' })
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    fetchQuestions()
  }, [page, filters])

  const fetchQuestions = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page) })
      if (filters.examName) params.set('examName', filters.examName)
      if (filters.subject) params.set('subject', filters.subject)
      if (filters.year) params.set('year', filters.year)

      const res = await fetch(`/api/admin/questions?${params}`)
      const data = await res.json()
      setQuestions(data.questions ?? [])
      setTotal(data.total ?? 0)
      setExamTypes(data.examTypes ?? [])
      setSubjects(data.subjects ?? [])
      setYears(data.years ?? [])
    } catch (error) {
      console.error('Failed to fetch questions:', error)
      setQuestions([])
      setTotal(0)
      setExamTypes([])
      setSubjects([])
      setYears([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this question? This cannot be undone.')) return
    
    const res = await fetch(`/api/admin/questions/${id}`, { method: 'DELETE' })
    if (res.ok) {
      fetchQuestions()
    }
    setDeleteId(null)
  }

  const totalPages = Math.ceil(total / 20)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary dark:text-primary-dark">Questions Management</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/reports"
            className="px-4 py-2 bg-green text-white font-medium rounded hover:bg-green-700"
          >
            Reports
          </Link>
          <Link
            href="/admin/questions/new"
            className="px-4 py-2 bg-primary text-white font-medium rounded hover:bg-primary-600"
          >
            Add New Question
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-light-black dark:bg-gray-800 p-4 rounded shadow">
          <div className="text-2xl font-bold text-primary dark:text-primary-dark">{total}</div>
          <div className="text-primary dark:text-primary-dark">Total Questions</div>
        </div>
        <div className="bg-light-black dark:bg-gray-800 p-4 rounded shadow">
          <div className="text-2xl font-bold text-primary dark:text-primary-dark">{examTypes?.length ?? 0}</div>
          <div className="text-primary dark:text-primary-dark">Exam Types</div>
        </div>
        <div className="bg-light-black dark:bg-gray-800 p-4 rounded shadow">
          <div className="text-2xl font-bold text-primary dark:text-primary-dark">{subjects?.length ?? 0}</div>
          <div className="text-primary dark:text-primary-dark">Subjects</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-light-black dark:bg-gray-800 p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CustomSelect
            value={filters.examName}
            onChange={(val) => setFilters({ ...filters, examName: val })}
            options={examTypes.map(et => ({ value: et, label: et }))}
            placeholder="All Exam Types"
          />
          <CustomSelect
            value={filters.subject}
            onChange={(val) => setFilters({ ...filters, subject: val })}
            options={subjects.map(s => ({ value: s, label: s }))}
            placeholder="All Subjects"
          />
          <CustomSelect
            value={filters.year}
            onChange={(val) => setFilters({ ...filters, year: val })}
            options={years.map(y => ({ value: String(y), label: String(y) }))}
            placeholder="All Years"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-light-black dark:bg-gray-800 rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left dark:text-white">Q#</th>
              <th className="px-4 py-2 text-left dark:text-white">Question</th>
              <th className="px-4 py-2 text-left dark:text-white">Exam</th>
              <th className="px-4 py-2 text-left dark:text-white">Subject</th>
              <th className="px-4 py-2 text-left dark:text-white">Year</th>
              <th className="px-4 py-2 text-right dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center dark:text-white">Loading...</td>
              </tr>
            ) : questions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center dark:text-white">No questions found</td>
              </tr>
            ) : (
              questions.map((q) => (
                <tr key={q.id} className="border-t dark:border-gray-700">
                  <td className="px-4 py-2 dark:text-white">{q.questionNumber}</td>
                  <td className="px-4 py-2 dark:text-white max-w-xs truncate">{q.questionText.slice(0, 80)}...</td>
                  <td className="px-4 py-2 dark:text-white">{q.examType}</td>
                  <td className="px-4 py-2 dark:text-white">{q.questionTopic}</td>
                  <td className="px-4 py-2 dark:text-white">{q.year || '-'}</td>
                  <td className="px-4 py-2 text-right">
                    <Link
                      href={`/admin/questions/${q.id}/edit`}
                      className="text-primary hover:underline mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 dark:text-white"
          >
            Previous
          </button>
          <span className="px-4 py-2 dark:text-white">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 dark:text-white"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}