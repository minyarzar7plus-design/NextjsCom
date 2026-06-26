"use client"

import { useTransition } from "react"
import { Globe } from "lucide-react"
import { useRouter } from "next/navigation"
import { localeNames, locales } from "@/lib/i18n/config"
import { useI18n } from "@/lib/i18n/provider"
import { setLocale } from "@/app/actions/locale"
import { cn } from "@/lib/utils"

export function LocaleSwitcher({ className }: { className?: string }) {
  const { locale } = useI18n()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function onChange(value: string) {
    startTransition(async () => {
      await setLocale(value)
      router.refresh()
    })
  }

  return (
    <div className={cn("relative inline-flex items-center", className)}>
      <Globe className="pointer-events-none absolute left-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
      <select
        aria-label="Select language"
        value={locale}
        disabled={isPending}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 appearance-none rounded-md border border-input bg-background pl-8 pr-8 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
      >
        {locales.map((l) => (
          <option key={l} value={l}>
            {localeNames[l]}
          </option>
        ))}
      </select>
    </div>
  )
}
