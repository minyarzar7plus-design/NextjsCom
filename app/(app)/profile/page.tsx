"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/app-store"

export default function ProfilePage() {
  const { profile, updateProfile } = useApp()
  const [draft, setDraft] = useState(profile)

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-3xl font-semibold">Profile settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Update your account preferences and sharing details for the workspace.
        </p>
      </section>

      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          <input
            className="w-full rounded-xl border border-border bg-background px-3 py-2"
            value={draft.name}
            onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
          />
          <input
            className="w-full rounded-xl border border-border bg-background px-3 py-2"
            value={draft.email}
            onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))}
          />
          <textarea
            className="min-h-24 w-full rounded-xl border border-border bg-background px-3 py-2"
            value={draft.bio}
            onChange={(event) => setDraft((current) => ({ ...current, bio: event.target.value }))}
          />
          <input
            className="w-full rounded-xl border border-border bg-background px-3 py-2"
            value={draft.timezone}
            onChange={(event) => setDraft((current) => ({ ...current, timezone: event.target.value }))}
          />
          <Button onClick={() => updateProfile(draft)}>Save profile</Button>
        </div>
      </section>
    </div>
  )
}
