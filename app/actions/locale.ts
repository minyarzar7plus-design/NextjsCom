"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { isLocale, LOCALE_COOKIE } from "@/lib/i18n/config"
import { createClient } from "@/lib/supabase/server"

export async function setLocale(locale: string) {
  if (!isLocale(locale)) return

  const store = await cookies()
  store.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  })

  // Persist preference to the user's profile when signed in.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) {
    await supabase.from("profiles").update({ locale }).eq("id", user.id)
  }

  revalidatePath("/", "layout")
}
