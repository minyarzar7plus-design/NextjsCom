export const locales = ["en", "my", "th", "lo"] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

export const localeNames: Record<Locale, string> = {
  en: "English",
  my: "မြန်မာ",
  th: "ไทย",
  lo: "ລາວ",
}

export const LOCALE_COOKIE = "locale"

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value)
}
