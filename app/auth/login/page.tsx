"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/app-store"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useApp()
  const [email, setEmail] = useState("demo@taskcommerce.app")
  const [password, setPassword] = useState("demo123")

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    login(email, password)
    router.push(searchParams.get("next") || "/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">TaskCommerce</p>
        <h1 className="mt-3 text-3xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">Use the demo account to explore the full app experience.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input className="w-full rounded-xl border border-border bg-background px-3 py-2" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
          <input className="w-full rounded-xl border border-border bg-background px-3 py-2" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
          <Button className="w-full" type="submit">Sign in</Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          New here? <Link className="font-medium text-primary" href="/auth/signup">Create an account</Link>
        </p>
      </div>
    </div>
  )
}
