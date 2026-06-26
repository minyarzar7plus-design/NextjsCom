import type { Metadata } from "next"
import { Geist, Geist_Mono, Noto_Sans_Myanmar, Noto_Sans_Thai, Noto_Sans_Lao } from "next/font/google"
import "./globals.css"
import { getI18n } from "@/lib/i18n/server"
import { I18nProvider } from "@/lib/i18n/provider"
import { AppProvider } from "@/lib/app-store"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })
const notoMy = Noto_Sans_Myanmar({
  variable: "--font-noto-my",
  subsets: ["myanmar"],
  weight: ["400", "500", "600", "700"],
})
const notoTh = Noto_Sans_Thai({
  variable: "--font-noto-th",
  subsets: ["thai"],
  weight: ["400", "500", "600", "700"],
})
const notoLo = Noto_Sans_Lao({
  variable: "--font-noto-lo",
  subsets: ["lao"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "TaskCommerce — Manage tasks. Get paid.",
  description:
    "A multilingual platform that combines task management with a built-in marketplace and wallet payments.",
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { locale, dict } = await getI18n()
  const fontVars = `${geistSans.variable} ${geistMono.variable} ${notoMy.variable} ${notoTh.variable} ${notoLo.variable}`

  return (
    <html lang={locale} className={`${fontVars} bg-background h-full antialiased`}>
      <body className="min-h-full font-sans">
        <I18nProvider locale={locale} dict={dict}>
          <AppProvider>{children}</AppProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
