import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">TaskCommerce</p>
        <h1 className="mt-3 text-3xl font-semibold">Authentication failed</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your sign-in flow could not be completed. Please try again.</p>
        <Link className="mt-6 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" href="/auth/login">
          Return to login
        </Link>
      </div>
    </div>
  )
}
