"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { NucleicAcidPage } from "@/components/nucleic-acid-page"

export default function DashboardPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn")
    const storedUsername = sessionStorage.getItem("username")

    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    if (storedUsername) {
      setUsername(storedUsername)
    }
  }, [router])

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn")
    sessionStorage.removeItem("username")
    router.push("/login")
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">核酸检测管理</h1>
              <p className="text-xs text-gray-500">检测结果管理系统</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">欢迎, {username}</p>
              <p className="text-xs text-gray-500">管理员</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              退出登录
            </button>
          </div>
        </div>
      </nav>

      {/* 内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NucleicAcidPage />
      </div>
    </main>
  )
}
