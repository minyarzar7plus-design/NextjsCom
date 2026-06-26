"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/app-store"

export default function SignupPage() {
  const router = useRouter()
  const { signup } = useApp()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    signup(name, email, password)
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">TaskCommerce</p>
        <h1 className="mt-3 text-3xl font-semibold">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">Start managing tasks and payments in minutes.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input className="w-full rounded-xl border border-border bg-background px-3 py-2" value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" />
          <input className="w-full rounded-xl border border-border bg-background px-3 py-2" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
          <input className="w-full rounded-xl border border-border bg-background px-3 py-2" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
          <Button className="w-full" type="submit">Create account</Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          Already have an account? <Link className="font-medium text-primary" href="/auth/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
