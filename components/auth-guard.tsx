"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

  const isLoggedIn = typeof window !== "undefined" ? sessionStorage.getItem("isLoggedIn") : null

  if (!isLoggedIn) {
    return null
  }

  return <>{children}</>
}
