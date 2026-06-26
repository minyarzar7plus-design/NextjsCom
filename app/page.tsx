import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-3xl rounded-3xl border border-border bg-card p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">TaskCommerce</p>
        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Manage tasks, payments, and orders from one place.</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Create work, settle wallet payments, and monitor your admin flow with a polished local demo experience.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/auth/login" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90">
            Sign in
          </Link>
          <Link href="/auth/signup" className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition hover:bg-secondary">
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}
