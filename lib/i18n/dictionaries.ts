import type { Locale } from "./config"
import en from "./dictionaries/en"

export type Dictionary = {
  [K in keyof typeof en]: typeof en[K] extends object ? { [P in keyof typeof en[K]]: string } : string
}

const dictionaries: Record<Locale, () => Promise<{ default: Dictionary }>> = {
  en: () => import("./dictionaries/en"),
  my: () => import("./dictionaries/my"),
  th: () => import("./dictionaries/th"),
  lo: () => import("./dictionaries/lo"),
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const loader = dictionaries[locale] ?? dictionaries.en
  return (await loader()).default
}

export { en }
