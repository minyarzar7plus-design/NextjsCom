"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/dashboard")
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">TaskCommerce</p>
        <h1 className="mt-3 text-3xl font-semibold">Finishing sign-in</h1>
        <p className="mt-2 text-sm text-muted-foreground">You will be redirected back to your workspace momentarily.</p>
      </div>
    </div>
  )
}
