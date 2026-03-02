'use client'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'
  const [authorized, setAuthorized] = useState<'loading' | 'yes' | 'no'>('loading')

  useEffect(() => {
    if (isLoginPage) {
      setAuthorized('yes')
      return
    }
    
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/check-auth')
        if (res.ok) {
          setAuthorized('yes')
        } else {
          window.location.href = '/admin/login'
        }
      } catch {
        window.location.href = '/admin/login'
      }
    }
    checkAuth()
  }, [isLoginPage])

  if (isLoginPage) {
    return <>{children}</>
  }

  if (authorized !== 'yes') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-white">Checking authentication...</p>
        </div>
      </div>
    )
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <header className="bg-black dark:bg-gray-800 shadow">
        <div className="w-full px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-xl font-bold text-primary dark:text-primary-dark">
              Quiz Admin
            </Link>
            <nav className="flex gap-4">
              <Link 
                href="/admin" 
                className="text-primary dark:text-primary-dark hover:text-primary dark:hover:text-primary-dark font-medium"
              >
                Questions
              </Link>
              <Link 
                href="/admin/reports" 
                className="text-primary dark:text-primary-dark hover:text-primary dark:hover:text-primary-dark font-medium"
              >
                Reports
              </Link>
              <Link 
                href="/" 
                target="_blank"
                className="text-primary dark:text-primary-dark hover:text-primary dark:hover:text-primary-dark font-medium"
              >
                Home
              </Link>
            </nav>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red text-white font-medium rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
